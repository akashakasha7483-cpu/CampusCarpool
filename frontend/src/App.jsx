import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

// Lazy-loaded pages for optimized FCP and code-splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FindRides = lazy(() => import('./pages/FindRides'));
const PostRide = lazy(() => import('./pages/PostRide'));
const MyRides = lazy(() => import('./pages/MyRides'));
const MyRequests = lazy(() => import('./pages/MyRequests'));
const ReceivedRequests = lazy(() => import('./pages/ReceivedRequests'));
const Profile = lazy(() => import('./pages/Profile'));
const RouteExplorer = lazy(() => import('./pages/RouteExplorer'));
const Garage = lazy(() => import('./pages/Garage'));

// Cyber Loading Suspense Fallback
const CyberLoadingFallback = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      color: '#38bdf8',
    }}
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(59, 130, 246, 0.2)',
        borderTopColor: '#38bdf8',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      Initializing Mobility Node...
    </span>
  </div>
);

// Animated Route Switcher Component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="/find-rides"
          element={
            <PageTransition>
              <FindRides />
            </PageTransition>
          }
        />
        <Route
          path="/route-explorer"
          element={
            <PageTransition>
              <RouteExplorer />
            </PageTransition>
          }
        />

        {/* Protected Student Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/garage"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Garage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-ride"
          element={
            <ProtectedRoute>
              <PageTransition>
                <PostRide />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-rides"
          element={
            <ProtectedRoute>
              <PageTransition>
                <MyRides />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute>
              <PageTransition>
                <MyRequests />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/received-requests"
          element={
            <ProtectedRoute>
              <PageTransition>
                <ReceivedRequests />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Suspense fallback={<CyberLoadingFallback />}>
              <AnimatedRoutes />
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
