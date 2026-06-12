import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';

const TITLE_MAX = 100;
const CONTENT_MAX = 5000;

function validate({ title, content }) {
  if (!title.trim()) return 'Title is required.';
  if (title.length > TITLE_MAX) return `Title must be at most ${TITLE_MAX} characters.`;
  if (!content.trim()) return 'Content is required.';
  if (content.length > CONTENT_MAX) return `Content must be at most ${CONTENT_MAX} characters.`;
  return null;
}

export default function WriteBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSession();
  const query = new URLSearchParams(location.search);
  const editId = query.get('edit') || '';
  const [mode, setMode] = useState(editId ? 'edit' : 'create');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postOwnerId, setPostOwnerId] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    if (!session || !session.user) {
      setError('You must be logged in to write a post.');
      setLoading(false);
      return;
    }
    if (mode === 'edit') {
      try {
        const posts = getPosts();
        const found = posts.find(p => p.id === editId);
        if (!found) {
          setError('Post not found.');
          setLoading(false);
          return;
        }
        setTitle(found.title);
        setContent(found.content || '');
        setPostOwnerId(found.userId || '');
        if (found.userId && found.userId !== session.user.id && session.user.role !== 'admin') {
          setError('You do not have permission to edit this post.');
        }
      } catch (e) {
        setError('Failed to load post.');
      }
    }
    setLoading(false);
    // eslint-disable-next-line
  }, [editId, mode]);

  function handleCancel() {
    if (mode === 'edit') {
      navigate(`/posts/${editId}`);
    } else {
      navigate('/dashboard');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const formError = validate({ title, content });
      if (formError) {
        setError(formError);
        setSubmitting(false);
        return;
      }
      const posts = getPosts();
      if (mode === 'edit') {
        const idx = posts.findIndex(p => p.id === editId);
        if (idx === -1) {
          setError('Post not found.');
          setSubmitting(false);
          return;
        }
        const post = posts[idx];
        if (post.userId && post.userId !== session.user.id && session.user.role !== 'admin') {
          setError('You do not have permission to edit this post.');
          setSubmitting(false);
          return;
        }
        posts[idx] = {
          ...post,
          title: title.trim(),
          content: content.trim(),
          date: new Date().toISOString(),
        };
        savePosts(posts);
        setSuccess('Post updated!');
        setTimeout(() => {
          navigate(`/posts/${editId}`, { replace: true });
        }, 700);
      } else {
        const newId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        const newPost = {
          id: newId,
          title: title.trim(),
          content: content.trim(),
          excerpt: content.trim().slice(0, 120) + (content.trim().length > 120 ? '...' : ''),
          date: new Date().toISOString(),
          author: {
            name: session.user.name,
            avatar: '', // Could add avatar support
          },
          userId: session.user.id,
        };
        savePosts([newPost, ...posts]);
        setSuccess('Post created!');
        setTimeout(() => {
          navigate(`/posts/${newId}`, { replace: true });
        }, 700);
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
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
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm"
          onClick={() => navigate('/dashboard')}
          type="button"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">
            {mode === 'edit' ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <button
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm transition-colors"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
        <form className="bg-white rounded-lg shadow px-6 py-8" onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
              value={title}
              onChange={e => {
                if (e.target.value.length <= TITLE_MAX) setTitle(e.target.value);
              }}
              maxLength={TITLE_MAX}
              disabled={submitting}
              required
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {title.length}/{TITLE_MAX}
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[180px] font-normal text-base resize-vertical"
              value={content}
              onChange={e => {
                if (e.target.value.length <= CONTENT_MAX) setContent(e.target.value);
              }}
              maxLength={CONTENT_MAX}
              ref={contentRef}
              disabled={submitting}
              required
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {content.length}/{CONTENT_MAX}
            </div>
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm font-medium">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-green-600 text-sm font-medium">{success}</div>
          )}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                  {mode === 'edit' ? 'Saving...' : 'Publishing...'}
                </span>
              ) : (
                mode === 'edit' ? 'Save Changes' : 'Publish'
              )}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
        <div className="mt-8 text-sm text-gray-400 text-center">
          <Link to="/" className="hover:underline text-blue-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}