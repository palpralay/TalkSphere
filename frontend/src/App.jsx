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

  // Add debug logging
  useEffect(() => {
    console.log("App state:", {
      isLoading,
      isAuthenticated,
      isOnboarded,
      authUser: authUser ? { ...authUser, isOnboarded: authUser.isOnboarded } : null
    });
  }, [isLoading, isAuthenticated, isOnboarded, authUser]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <CallPage />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : isOnboarded ? (
              <Navigate to="/" replace />
            ) : (
              <OnboardingPage />
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