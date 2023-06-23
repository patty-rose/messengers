import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase.js";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import MolPage from "./pages/MolPage";
import SharedLayout from "./components/SharedLayout";
import Dashboard from "./pages/Dashboard";
import AddPage from "./pages/AddPage";
import EditPage from "./pages/EditPage";
import PreviewPage from "./pages/PreviewPage";
import Error from "./pages/Error";

function App() {
  const [mainPageList, setMainPageList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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
    const unSubscribe = onSnapshot(
      collection(db, "TESTpages"),
      (collectionSnapshot) => {
        const pages = [];
        collectionSnapshot.forEach((doc) => {
          pages.push({
            pageText: doc.data().pageText,
            textPosition: doc.data().textPosition,
            backgroundImage: doc.data().backgroundImage,
            imageRefName: doc.data().imageRefName,
            timestamp: serverTimestamp(),
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
    const docRef = await addDoc(collection(db, "TESTpages"), newPageData);
    return docRef;
  };

  const handleEditingPageInList = async (pageToEdit) => {
    const pageRef = doc(db, "TESTpages", pageToEdit.id);
    await updateDoc(pageRef, pageToEdit);
  };

  const handleClickingDelete = async (id) => {
    await deleteDoc(doc(db, "TESTpages", id));
  };

  const handleGetRandomPageId = (pagesArr, currentPage) => {
    const max = pagesArr?.length;
    if (max > 0) {
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
                // restoreListOfPages={restoreMainPageListFromLocalStorage}
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

            <Route
              path="preview/:pageId"
              element={
                <ProtectedRoute>
                  <PreviewPage pageList={mainPageList} />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Error />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
