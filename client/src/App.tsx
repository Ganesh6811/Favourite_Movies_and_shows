import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/Auth.store.tsx";
import  Login  from "./pages/Login.page.tsx";
import  SignUp  from "./pages/SignUp.page.tsx";
import  Home  from "./pages/Home.page.tsx";

function App() {
  const {isAuthenticated , isLoading, fetchUser} = useAuthStore();

  useEffect(()=>{
    const getUser = async()=>{
      await fetchUser();
    }
    getUser();
  }, []);

  if(isLoading){
    return(<>Loading</>)
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" /> } />
          <Route path="/signUp" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
