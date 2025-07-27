import { Navigate, Route, Routes } from "react-router";
import { useEffect } from "react";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUp.jsx";
import LoginPage from "./pages/Loginpage.jsx";
import NotificationsPage from "./pages/Notification.jsx";
import CallPage from "./pages/Callpage.jsx";
import ChatPage from "./pages/Chatpage.jsx";
import OnboardingPage from "./pages/Onboarding.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme, initTheme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  // Initialize theme on app start
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* 404 Route */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--fallback-b1,oklch(var(--b1)))',
            color: 'var(--fallback-bc,oklch(var(--bc)))',
          },
        }}
      />
    </div>
  );
};

export default App;