import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Dummy authentication check (replace with real logic as needed)
function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async session fetch
    const timer = setTimeout(() => {
      // setSession({ user: { name: 'Alice' } }); // Uncomment to simulate logged in
      setSession(null); // Simulate logged out
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { session, loading };
}

function ProtectedRoute({ children, session, loading }) {
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  session: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};

// Dummy Navbars (replace with real implementations)
function Navbar({ user }) {
  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
      <span className="font-bold text-lg">writespace</span>
      <span>Welcome, {user.name}</span>
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

function PublicNavbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow">
      <span className="font-bold text-lg text-gray-900">writespace</span>
      <span className="text-gray-600">A place to write</span>
    </nav>
  );
}

// Dummy pages (replace with real implementations)
function HomePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to writespace</h1>
      <p className="text-gray-700">Your distraction-free writing environment.</p>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <p className="text-gray-700">Login form goes here.</p>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="text-gray-700">Your private dashboard.</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-gray-600">Page not found.</p>
    </div>
  );
}

export default function App() {
  const { session, loading } = useSession();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {session ? <Navbar user={session.user} /> : <PublicNavbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session} loading={loading}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}