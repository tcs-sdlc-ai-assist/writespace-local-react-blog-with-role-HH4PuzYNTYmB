import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../utils/storage';

function Feature({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mb-3 text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

export default function LandingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const allPosts = getPosts();
      // Sort by date descending, take latest 3
      const sorted = [...allPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(sorted.slice(0, 3));
    } catch (e) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-blue-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Welcome to <span className="text-blue-600">writespace</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Your distraction-free writing environment. Write, share, and grow your ideas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3 rounded-md bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-md bg-gray-900 text-white font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why writespace?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <Feature
            icon="✍️"
            title="Distraction-Free"
            desc="A clean, minimal interface to help you focus on your words."
          />
          <Feature
            icon="🔒"
            title="Private & Secure"
            desc="Your drafts are private by default. You control what you share."
          />
          <Feature
            icon="🚀"
            title="Instant Publishing"
            desc="Publish your posts with one click and share your ideas with the world."
          />
        </div>
      </section>

      {/* Latest Posts */}
      <section className="max-w-4xl mx-auto py-12 px-4 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Latest Posts</h2>
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium text-sm"
          >
            View all
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No posts yet. Be the first to write!</div>
        ) : (
          posts.map(post => (
            <BlogCard
              key={post.id}
              post={post}
              color="blue-500"
            />
          ))
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto w-full bg-gray-50 border-t border-gray-200 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
          <div>
            &copy; {new Date().getFullYear()} writespace. All rights reserved.
          </div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
            <Link to="/login" className="hover:text-blue-600 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}