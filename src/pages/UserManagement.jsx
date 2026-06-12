import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserRow from '../components/UserRow';
import { getUsers, saveUsers } from '../utils/storage';
import { getSession } from '../utils/auth';

const HARDCODED_ADMIN = {
  id: 'admin',
  username: 'admin',
  name: 'Admin',
  role: 'admin',
};

function validateForm({ name, username, password, confirmPassword }) {
  if (!name.trim()) return 'Name is required.';
  if (!username.trim()) return 'Username is required.';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores.';
  if (username.length < 3) return 'Username must be at least 3 characters.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteUserId, setDeleteUserId] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const session = getSession();
      if (!session || !session.user || session.user.role !== 'admin') {
        navigate('/login', { replace: true });
        return;
      }
      const allUsers = getUsers();
      setUsers(allUsers);
    } catch (e) {
      setError('Failed to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  function handleInputChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFormError('');
    setSuccess('');
  }

  function handleDeleteUser(userId) {
    setDeleteUserId(userId);
    setSuccess('');
    setError('');
  }

  function confirmDeleteUser() {
    setDeleting(true);
    setSuccess('');
    setError('');
    try {
      if (deleteUserId === HARDCODED_ADMIN.id) {
        setError('Cannot delete the hard-coded admin.');
        setDeleting(false);
        setDeleteUserId('');
        return;
      }
      const updatedUsers = users.filter(u => u.id !== deleteUserId);
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setSuccess('User deleted.');
      setDeleteUserId('');
    } catch (e) {
      setError('Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  }

  function cancelDeleteUser() {
    setDeleteUserId('');
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    setFormSubmitting(true);
    try {
      const err = validateForm(form);
      if (err) {
        setFormError(err);
        setFormSubmitting(false);
        return;
      }
      // Check username uniqueness
      const exists = users.some(
        u => u.username.toLowerCase() === form.username.trim().toLowerCase()
      );
      if (exists || form.username.trim().toLowerCase() === HARDCODED_ADMIN.username) {
        setFormError('Username already exists.');
        setFormSubmitting(false);
        return;
      }
      const newUser = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        name: form.name.trim(),
        username: form.username.trim(),
        password: form.password,
        role: form.role,
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setSuccess('User created!');
      setForm({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'user',
      });
    } catch (e) {
      setFormError('Failed to create user.');
    } finally {
      setFormSubmitting(false);
    }
  }

  const allUsers = [
    HARDCODED_ADMIN,
    ...users.filter(u => u.id !== HARDCODED_ADMIN.id && u.username !== HARDCODED_ADMIN.username),
  ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 py-10 px-4 shadow">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">User Management</h1>
            <p className="text-blue-100 text-lg">Manage users for writespace</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/admin"
              className="px-5 py-2 rounded bg-white text-blue-700 font-semibold hover:bg-blue-50 shadow transition-colors text-sm"
            >
              Admin Dashboard
            </Link>
            <Link
              to="/"
              className="px-5 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800 shadow transition-colors text-sm"
            >
              View Site
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Create user form */}
        <div className="bg-white rounded-lg shadow px-8 py-8 mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Create New User</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleFormSubmit} autoComplete="off">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={handleInputChange}
                disabled={formSubmitting}
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.username}
                onChange={handleInputChange}
                disabled={formSubmitting}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.password}
                onChange={handleInputChange}
                disabled={formSubmitting}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.confirmPassword}
                onChange={handleInputChange}
                disabled={formSubmitting}
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.role}
                onChange={handleInputChange}
                disabled={formSubmitting}
                required
              >
                <option value="user">User</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 w-full"
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                    Creating...
                  </span>
                ) : (
                  'Create User'
                )}
              </button>
            </div>
          </form>
          {formError && (
            <div className="mt-4 text-red-600 text-sm font-medium">{formError}</div>
          )}
          {success && (
            <div className="mt-4 text-green-600 text-sm font-medium">{success}</div>
          )}
        </div>

        {/* Error/success */}
        {error && (
          <div className="mb-6 text-red-600 font-medium">{error}</div>
        )}
        {success && !formError && (
          <div className="mb-6 text-green-600 font-medium">{success}</div>
        )}

        {/* User table */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">All Users</h2>
            <button
              className="text-blue-600 hover:underline text-sm font-medium"
              onClick={() => {
                setLoading(true);
                setError('');
                try {
                  const allUsers = getUsers();
                  setUsers(allUsers);
                  setSuccess('User list refreshed.');
                } catch (e) {
                  setError('Failed to refresh users.');
                } finally {
                  setLoading(false);
                }
              }}
              type="button"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : allUsers.length === 0 ? (
            <div className="text-gray-500 text-center py-6">No users found.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left text-sm">
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(user => (
                    <UserRow
                      key={user.id}
                      user={{
                        ...user,
                        createdAt: user.createdAt || (user.id === HARDCODED_ADMIN.id ? 'N/A' : ''),
                      }}
                      onDelete={user.id === HARDCODED_ADMIN.id ? undefined : handleDeleteUser}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete user modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">Delete User?</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                onClick={cancelDeleteUser}
                type="button"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                onClick={confirmDeleteUser}
                type="button"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;