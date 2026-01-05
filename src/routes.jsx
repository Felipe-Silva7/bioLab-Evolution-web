import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useGame } from './contexts/GameContext';

// Layout components
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Page components
import LabStation from './components/lab/LabStation';
import ExperimentsView from './pages/ExperimentsView';
import ShopView from './pages/ShopView';
import ProgressView from './pages/ProgressView';
import LearnView from './pages/LearnView';
import ProfileView from './pages/ProfileView';
import AchievementsView from './pages/AchievementsView';
import LeaderboardView from './pages/LeaderboardView';
import PatentOfficeView from './pages/PatentOfficeView';

// Auth components
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Game components
import ExperimentModal from './components/experiments/ExperimentModal';
import QuizModal from './components/quiz/QuizModal';
import LoadingSpinner from './components/common/LoadingSpinner';

// Layout wrapper
const MainLayout = ({ children }) => {
  const { gameState } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      <Header />
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

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

// Auth route wrapper (redirect if already logged in)
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

// Page components
const HomePage = () => {
  const { gameState } = useGame();
  const [activeExperiment, setActiveExperiment] = React.useState(null);
  const [activeQuiz, setActiveQuiz] = React.useState(null);

  return (
    <MainLayout>
      <LabStation />
      
      {/* Modals */}
      {activeExperiment && (
        <ExperimentModal
          experimentId={activeExperiment}
          onClose={() => setActiveExperiment(null)}
        />
      )}
      
      {activeQuiz && (
        <QuizModal
          experimentId={activeQuiz}
          onComplete={(passed) => {
            setActiveQuiz(null);
            if (passed) {
              setActiveExperiment(activeQuiz);
            }
          }}
        />
      )}
    </MainLayout>
  );
};

const ExperimentsPage = () => {
  return (
    <MainLayout>
      <ExperimentsView />
    </MainLayout>
  );
};

const ShopPage = () => {
  return (
    <MainLayout>
      <ShopView />
    </MainLayout>
  );
};

const ProgressPage = () => {
  return (
    <MainLayout>
      <ProgressView />
    </MainLayout>
  );
};

const LearnPage = () => {
  return (
    <MainLayout>
      <LearnView />
    </MainLayout>
  );
};

const ProfilePage = () => {
  return (
    <MainLayout>
      <ProfileView />
    </MainLayout>
  );
};

const AchievementsPage = () => {
  return (
    <MainLayout>
      <AchievementsView />
    </MainLayout>
  );
};

const LeaderboardPage = () => {
  return (
    <MainLayout>
      <LeaderboardView />
    </MainLayout>
  );
};

const PatentOfficePage = () => {
  return (
    <MainLayout>
      <PatentOfficeView />
    </MainLayout>
  );
};

// App router
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        } />
        
        <Route path="/register" element={
          <AuthRoute>
            <RegisterPage />
          </AuthRoute>
        } />
        
        <Route path="/forgot-password" element={
          <AuthRoute>
            <ForgotPasswordPage />
          </AuthRoute>
        } />
        
        <Route path="/reset-password" element={
          <AuthRoute>
            <ResetPasswordPage />
          </AuthRoute>
        } />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/experiments" element={
          <ProtectedRoute>
            <ExperimentsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/shop" element={
          <ProtectedRoute>
            <ShopPage />
          </ProtectedRoute>
        } />
        
        <Route path="/progress" element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        } />
        
        <Route path="/learn" element={
          <ProtectedRoute>
            <LearnPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/achievements" element={
          <ProtectedRoute>
            <AchievementsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/patents" element={
          <ProtectedRoute>
            <PatentOfficePage />
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;