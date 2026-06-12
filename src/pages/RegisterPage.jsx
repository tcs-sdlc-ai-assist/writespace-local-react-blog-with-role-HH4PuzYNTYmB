import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUsers, saveUsers } from '../utils/storage';
import { setSession } from '../utils/auth';

function validateForm({ name, username, password, confirmPassword }) {
  if (!name.trim()) return 'Name is required.';
  if (!username.trim()) return 'Username is required.';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores.';
  if (username.length < 3) return 'Username must be at least 3 characters.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const formError = validateForm({ name, username, password, confirmPassword });
      if (formError) {
        setError(formError);
        setSubmitting(false);
        return;
      }
      // Check username uniqueness
      const users = getUsers();
      const exists = users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
      if (exists) {
        setError('Username already exists.');
        setSubmitting(false);
        return;
      }
      // Create user object
      const newUser = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        name: name.trim(),
        username: username.trim(),
        password, // Insecure, for demo only
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      setSession({
        user: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          role: newUser.role,
        },
      });
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 800);
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
          <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-900">Register</h2>
          <p className="text-gray-600 text-sm">
            Create your account to get started.
          </p>
        </div>
        <form
          className="bg-white rounded-lg shadow px-8 py-8"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoFocus
              autoComplete="name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={submitting}
              required
            />
          </div>
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
              autoComplete="username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <div className="mb-5">
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
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm font-medium">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-green-600 text-sm font-medium">{success}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>
        <div className="text-center mt-6 text-gray-500 text-sm">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

RegisterPage.propTypes = {
  location: PropTypes.object,
};