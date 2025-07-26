import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignUp from "./pages/SignUp";
import Loginpage from "./pages/Loginpage";
import Notification from "./pages/Notification";
import Onboarding from "./pages/Onboarding";
import Callpage from "./pages/Callpage";
import Chatpage from "./pages/Chatpage";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.onboarded;

  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <div className="h-screen" data-theme="dark">
      <Routes>
        <Route
          path="/"
          element={isAuthenticated && isOnboarded ? (<Homepage />) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Loginpage />}
        />
        <Route
          path="/notification"
          element={isAuthenticated ? <Notification /> : <Navigate to="/login" />}
        />
        <Route
          path="/call"
          element={isAuthenticated ? <Callpage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <Chatpage /> : <Navigate to="/login" />}
        />
        <Route
          path="/onboarding"
          element={isOnboarded ? <Onboarding /> : <Navigate to="/login" />}
        />
        
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
