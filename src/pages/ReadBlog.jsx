import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import PropTypes from 'prop-types';

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
}

function ConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-3 text-gray-900">Delete Post?</h2>
        <p className="text-gray-700 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
            onClick={onConfirm}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const session = getSession();
      setCurrentUserId(session?.user?.id || '');
      const posts = getPosts();
      const found = posts.find(p => p.id === id);
      if (!found) {
        setError('Post not found.');
        setPost(null);
      } else {
        setPost(found);
      }
    } catch (e) {
      setError('Failed to load post.');
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  function handleEdit() {
    navigate(`/dashboard?edit=${id}`);
  }

  function handleDelete() {
    setShowConfirm(true);
  }

  function confirmDelete() {
    try {
      const posts = getPosts();
      const updated = posts.filter(p => p.id !== id);
      savePosts(updated);
      setShowConfirm(false);
      navigate('/dashboard', { replace: true });
    } catch (e) {
      setError('Failed to delete post.');
      setShowConfirm(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
        <div className="text-2xl font-bold mb-2">Error</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <Link to="/" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm">
          Go Home
        </Link>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const isOwner = currentUserId && post.userId && currentUserId === post.userId;

  return (
    <div className="min-h-screen bg-white">
      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:underline text-sm font-medium">
            ← Back to all posts
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
        <div className="flex items-center gap-3 mb-6">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-bold text-lg uppercase">
              {post.author.name && post.author.name.length > 0 ? post.author.name[0] : 'U'}
            </span>
          )}
          <div>
            <div className="font-medium text-gray-900">{post.author.name}</div>
            <div className="text-xs text-gray-500">{formatDate(post.date)}</div>
          </div>
          {isOwner && (
            <div className="ml-auto flex gap-2">
              <button
                className="inline-flex items-center px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
                onClick={handleEdit}
                type="button"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 01.586-1.414l6.768-6.768z" />
                </svg>
                Edit
              </button>
              <button
                className="inline-flex items-center px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium border border-red-200 transition-colors"
                onClick={handleDelete}
                type="button"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
        <article className="prose prose-blue max-w-none text-gray-900 text-lg leading-relaxed">
          {post.content ? (
            post.content.split('\n').map((line, idx) =>
              line.trim() === '' ? <br key={idx} /> : <p key={idx}>{line}</p>
            )
          ) : (
            <p className="text-gray-500">No content.</p>
          )}
        </article>
      </div>
    </div>
  );
}