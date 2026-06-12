import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUsers } from '../utils/storage';
import { setSession } from '../utils/auth';

const HARDCODED_ADMIN = {
  username: 'admin',
  password: 'admin123',
  name: 'Admin',
  role: 'admin',
  id: 'admin',
};

function validateCredentials(username, password) {
  // Check hardcoded admin
  if (
    username === HARDCODED_ADMIN.username &&
    password === HARDCODED_ADMIN.password
  ) {
    return {
      id: HARDCODED_ADMIN.id,
      name: HARDCODED_ADMIN.name,
      username: HARDCODED_ADMIN.username,
      role: HARDCODED_ADMIN.role,
    };
  }
  // Check localStorage users
  const users = getUsers();
  const found = users.find(
    (u) =>
      u.username === username &&
      u.password === password // Insecure, but for demo only
  );
  if (found) {
    return {
      id: found.id,
      name: found.name,
      username: found.username,
      role: found.role || 'user',
    };
  }
  return null;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      // Simulate async login
      await new Promise((res) => setTimeout(res, 400));
      const user = validateCredentials(username.trim(), password);
      if (!user) {
        setError('Invalid username or password.');
        setSubmitting(false);
        return;
      }
      setSession({ user });
      navigate(from, { replace: true });
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="max-w-md w-full mx-auto mt-16 px-4">
        <div className="mb-8 text-center">
          <Link to="/" className="font-extrabold text-3xl text-blue-600">
            writespace
          </Link>
          <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-900">Login</h2>
          <p className="text-gray-600 text-sm">
            Sign in to your account to continue.
          </p>
        </div>
        <form
          className="bg-white rounded-lg shadow px-8 py-8"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoFocus
              autoComplete="username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm font-medium">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                Signing in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="text-center mt-6 text-gray-500 text-sm">
          <span>Don&apos;t have an account? </span>
          <Link to="/login" className="text-blue-600 hover:underline">
            Contact admin
          </Link>
        </div>
        <div className="mt-8 text-xs text-gray-400 text-center">
          <div>
            <span className="font-semibold">Demo admin:</span> <span>admin / admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  location: PropTypes.object,
};