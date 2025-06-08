import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  query, 
  orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, storage } from "./firebase.js";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import MolPage from "./pages/MolPage";
import SharedLayout from "./components/SharedLayout";
import Dashboard from "./pages/Dashboard";
import AddPage from "./pages/AddPage";
import EditPage from "./pages/EditPage";
import Error from "./pages/Error";
import { deleteObject, ref } from "firebase/storage";

function App() {
  const [mainPageList, setMainPageList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // cleanup if needed
    };
  }, []);
  
  //Auth object & observer:
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  });

  //query Firestore
  useEffect(() => {
    const pagesQuery = query(collection(db, "pages"), orderBy("timeOpen", "desc"));

    const unSubscribe = onSnapshot(
      pagesQuery,
      (collectionSnapshot) => {
        const pages = [];
        collectionSnapshot.forEach((doc) => {
          pages.push({
            pageText: doc.data().pageText,
            textPosition: doc.data().textPosition,
            backgroundImage: doc.data().backgroundImage,
            imageRefName: doc.data().imageRefName,
            timestamp: serverTimestamp(),
            timeOpen: doc.data().timeOpen,
            id: doc.id,
          });
        });
        setMainPageList(pages);
        localStorage.setItem("mainPageList", JSON.stringify(pages));
      },
      (error) => {
        console.log("Error:", error);
      }
    );
    return () => unSubscribe();
  }, []);

  //protected route comp:
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      console.log("access denied: not authenticated");
      return <Navigate to="/" />;
    }
    return children;
  };

  //CRUD handlers:
  const handleAddingNewPageToList = async (newPageData) => {
    const docRef = await addDoc(collection(db, "pages"), newPageData);
    return docRef;
  };

  const handleEditingPageInList = async (pageToEdit) => {
    const pageRef = doc(db, "pages", pageToEdit.id);
    await updateDoc(pageRef, {
      ...pageToEdit,
      timeOpen: serverTimestamp(),
    });
  };

  const handleClickingDelete = async (id, imageRefName) => {
    await deleteDoc(doc(db, "pages", id));
    const imageRef = ref(storage, imageRefName);
    deleteObject(imageRef)
      .then(() => {
        console.log(`${imageRefName} successfully deleted from storage`);
      })
      .catch((error) => {
        console.log(`Error: unsuccessful image deletion`);
      });
  };

  const handleGetRandomPageId = (pagesArr, currentPage) => {
    const max = pagesArr?.length;
    if (max === 1) {
      return pagesArr[0].id;
    } else if (max > 1) {
      let randomPageId;
      do {
        const arrIndex = Math.floor(Math.random() * max);
        randomPageId = pagesArr[arrIndex].id;
      } while (randomPageId === currentPage);
      return randomPageId;
    } else {
      return null;
    }
  };

  return (
    <>
      <BrowserRouter>
        <AppWrapper>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  listOfPages={mainPageList}
                  onGetRandomPageId={handleGetRandomPageId}
                />
              }
            />
            <Route
              path="/mol/:pageId"
              element={
                <MolPage
                  listOfPages={mainPageList}
                  onGetRandomPageId={handleGetRandomPageId}
                />
              }
            />

            <Route path="/admin" element={<SharedLayout user={currentUser} />}>
              <Route index element={<SignIn />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard
                      listOfPages={mainPageList}
                      onClickingDelete={handleClickingDelete}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="addPage"
                element={
                  <ProtectedRoute>
                    <AddPage onNewPageCreation={handleAddingNewPageToList} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="edit/:pageId"
                element={
                  <ProtectedRoute>
                    <EditPage
                      listOfPages={mainPageList}
                      onEditPage={handleEditingPageInList}
                    />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<Error />} />
          </Routes>
        </AppWrapper>
      </BrowserRouter>
    </>
  );
}

export default App;
