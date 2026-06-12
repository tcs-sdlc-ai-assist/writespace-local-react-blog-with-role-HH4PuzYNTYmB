import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import UserRow from '../components/UserRow';
import BlogCard from '../components/BlogCard';
import { getUsers, saveUsers, getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [deleteUserId, setDeleteUserId] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState('');
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
      const allPosts = getPosts();
      setUsers(allUsers);
      setPosts(allPosts);
    } catch (e) {
      setError('Failed to load dashboard data.');
      setUsers([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  function handleDeleteUser(userId) {
    setDeleteUserId(userId);
  }

  function confirmDeleteUser() {
    setDeleting(true);
    setSuccess('');
    setError('');
    try {
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

  // Stats
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;
  const editorCount = users.filter(u => u.role === 'editor').length;
  const latestPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const latestUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient header */}
      <div className="w-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 py-12 px-4 shadow">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 text-lg">Overview & management for writespace</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded bg-white text-blue-700 font-semibold hover:bg-blue-50 shadow transition-colors text-sm"
            >
              My Dashboard
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

      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            label="Total Users"
            value={totalUsers}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2a2 2 0 012-2h4a2 2 0 012 2zM3 16v2a2 2 0 002 2h4a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2z" /></svg>}
            color="blue-500"
          />
          <StatCard
            label="Admins"
            value={adminCount}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" /></svg>}
            color="red-500"
          />
          <StatCard
            label="Posts"
            value={totalPosts}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h5l2-2h5a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>}
            color="green-500"
          />
          <StatCard
            label="Editors"
            value={editorCount}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 01.586-1.414l6.768-6.768z" /></svg>}
            color="green-400"
          />
        </div>

        {/* Quick actions */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              Create Post
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors text-sm"
            >
              View Home
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-sm"
            >
              My Dashboard
            </Link>
          </div>
        </div>

        {/* Error/success */}
        {error && (
          <div className="mb-6 text-red-600 font-medium">{error}</div>
        )}
        {success && (
          <div className="mb-6 text-green-600 font-medium">{success}</div>
        )}

        {/* Recent posts */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Posts</h2>
            <Link
              to="/"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View all
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="text-gray-500 text-center py-6">No posts yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestPosts.map(post => (
                <BlogCard key={post.id} post={post} color="blue-500" />
              ))}
            </div>
          )}
        </div>

        {/* Recent users */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Users</h2>
            <Link
              to="/admin"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Refresh
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : latestUsers.length === 0 ? (
            <div className="text-gray-500 text-center py-6">No users yet.</div>
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
                  {latestUsers.map(user => (
                    <UserRow key={user.id} user={user} onDelete={handleDeleteUser} />
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

export default AdminDashboard;