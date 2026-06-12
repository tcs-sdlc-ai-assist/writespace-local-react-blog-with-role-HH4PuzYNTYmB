import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const session = getSession();
      setCurrentUserId(session?.user?.id || '');
      const allPosts = getPosts();
      // Sort by date descending
      const sorted = [...allPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(sorted);
    } catch (e) {
      setError('Failed to load posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">All Posts</h1>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            New Post
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-8">{error}</div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h.01M8 20h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-lg font-medium mb-2">No posts yet</div>
            <div className="mb-4">Start by creating your first post!</div>
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              Create Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {posts.map(post => (
              <BlogCard
                key={post.id}
                post={post}
                color="blue-500"
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}