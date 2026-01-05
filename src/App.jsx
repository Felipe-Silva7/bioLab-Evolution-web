import React, { useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useGame } from './contexts/GameContext';

// Layout
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';

// Pages
import LabStation from './components/lab/LabStation';
import ExperimentsView from './pages/ExperimentsView';
import ShopView from './pages/ShopView';
import ProgressView from './pages/ProgressView';
import LearnView from './pages/LearnView';
import AchievementsView from './pages/AchievementsView';
import LeaderboardView from './pages/LeaderboardView';
import PatentOfficeView from './pages/PatentOfficeView';
import ProfileView from './pages/ProfileView';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Components
import Notification from './components/common/Notification';
import LoadingSpinner from './components/common/LoadingSpinner';

// Main Layout Wrapper
const GameLayout = ({ children }) => {
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      {!hideNav && <Header />}
      {!hideNav && <Navigation />}
      
      <main className="w-full p-4 md:p-6 max-w-7xl mx-auto">
        {children}
      </main>
      
      {!hideNav && <Footer />}
    </div>
  );
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { gameState } = useGame();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const { user } = useAuth();
  const { gameState, dispatch } = useGame();
  const handleNotificationClose = useCallback((nid) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: nid });
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <GameLayout>
            <LoginPage />
          </GameLayout>
        } />
        
        <Route path="/register" element={
          <GameLayout>
            <RegisterPage />
          </GameLayout>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <GameLayout>
              <LabStation />
            </GameLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/experiments" element={
          <ProtectedRoute>
            <GameLayout>
              <ExperimentsView />
            </GameLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/shop" element={
          <ProtectedRoute>
            <GameLayout>
              <ShopView />
            </GameLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/progress" element={
          <ProtectedRoute>
            <GameLayout>
              <ProgressView />
            </GameLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/learn" element={
          <ProtectedRoute>
            <GameLayout>
              <LearnView />
            </GameLayout>
          </ProtectedRoute>
        } />

        <Route path="/achievements" element={
          <ProtectedRoute>
            <GameLayout>
              <AchievementsView />
            </GameLayout>
          </ProtectedRoute>
        } />

        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <GameLayout>
              <LeaderboardView />
            </GameLayout>
          </ProtectedRoute>
        } />

        <Route path="/patents" element={
          <ProtectedRoute>
            <GameLayout>
              <PatentOfficeView />
            </GameLayout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <GameLayout>
              <ProfileView />
            </GameLayout>
          </ProtectedRoute>
        } />
      </Routes>

      {/* Notifications (fila única) */}
      <div className="fixed top-4 right-4 z-50">
        {Boolean((gameState.notifications || []).length) && (
          <Notification
            id={gameState.notifications[0].id}
            message={gameState.notifications[0].message}
            type={gameState.notifications[0].type}
            duration={4000}
            position={1}
            total={(gameState.notifications || []).length}
            onClose={handleNotificationClose}
          />
        )}
      </div>
    </>
  );
}

export default App;
