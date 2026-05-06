import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import {
  collection,
  addDoc,
  getDocs,
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

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function App() {
  const [mainPageList, setMainPageList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ?? null);
    });
    return () => unsubscribe();
  }, []);

  const fetchPages = useCallback(async () => {
    const pagesQuery = query(collection(db, "pages"), orderBy("timeOpen", "desc"));
    try {
      const snapshot = await getDocs(pagesQuery);
      const pages = snapshot.docs.map((document) => ({
        pageText: document.data().pageText,
        textPosition: document.data().textPosition,
        backgroundImage: document.data().backgroundImage,
        imageRefName: document.data().imageRefName,
        timeOpen: document.data().timeOpen,
        id: document.id,
      }));
      setMainPageList(pages);
      localStorage.setItem("mainPageList", JSON.stringify(pages));
      localStorage.setItem("mainPageListTime", String(Date.now()));
    } catch (error) {
      console.log("Error fetching pages:", error);
      const cached = localStorage.getItem("mainPageList");
      if (cached) setMainPageList(JSON.parse(cached));
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem("mainPageList");
    const cachedTime = localStorage.getItem("mainPageListTime");
    if (cached && cachedTime && Date.now() - parseInt(cachedTime) < CACHE_TTL) {
      setMainPageList(JSON.parse(cached));
      return;
    }
    fetchPages();
  }, [fetchPages]);

  //protected route comp:
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      console.log("access denied: not authenticated");
      return <Navigate to="/" />;
    }
    return children;
  };

  const invalidateCache = () => {
    localStorage.removeItem("mainPageListTime");
  };

  //CRUD handlers:
  const handleAddingNewPageToList = async (newPageData) => {
    const docRef = await addDoc(collection(db, "pages"), newPageData);
    invalidateCache();
    await fetchPages();
    return docRef;
  };

  const handleEditingPageInList = async (pageToEdit) => {
    const { oldImageRefName, ...updateData } = pageToEdit;
    const pageRef = doc(db, "pages", updateData.id);
    await updateDoc(pageRef, {
      ...updateData,
      timeOpen: serverTimestamp(),
    });
    if (oldImageRefName && oldImageRefName !== updateData.imageRefName) {
      deleteObject(ref(storage, oldImageRefName)).catch(() => {
        console.log("Error deleting old image from storage");
      });
    }
    invalidateCache();
    await fetchPages();
  };

  const handleClickingDelete = async (id, imageRefName) => {
    await deleteDoc(doc(db, "pages", id));
    invalidateCache();
    await fetchPages();
    if (imageRefName) {
      const imageRef = ref(storage, imageRefName);
      deleteObject(imageRef).catch(() => {
        console.log(`Error: unsuccessful image deletion`);
      });
    }
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
