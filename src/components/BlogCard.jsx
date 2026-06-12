import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * BlogCard component.
 * Displays a blog post summary: title, excerpt, date, author avatar, colored border.
 * Shows edit icon if current user is the owner.
 * @param {Object} props
 * @param {Object} props.post - Blog post object
 * @param {string} props.post.id - Post ID
 * @param {string} props.post.title - Post title
 * @param {string} props.post.excerpt - Post excerpt
 * @param {string} props.post.date - ISO date string
 * @param {Object} props.post.author - Author object
 * @param {string} props.post.author.name - Author name
 * @param {string} [props.post.author.avatar] - Optional avatar URL
 * @param {string} [props.color] - Optional border color (Tailwind color, e.g. 'blue-500')
 * @param {string} [props.currentUserId] - Current user ID for edit icon
 * @param {string} [props.post.userId] - Post owner user ID
 * @param {Function} [props.onEdit] - Optional edit handler
 */
function BlogCard({ post, color = 'blue-500', currentUserId, onEdit }) {
  const isOwner = currentUserId && post.userId && currentUserId === post.userId;

  // Format date as "MMM D, YYYY"
  let formattedDate = '';
  try {
    const d = new Date(post.date);
    formattedDate = d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    formattedDate = post.date;
  }

  return (
    <div
      className={`flex items-start bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 mb-6 border-${color}`}
      data-testid="blog-card"
    >
      <div className="flex-shrink-0 pl-4 pt-4">
        {post.author.avatar ? (
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-700 font-bold text-lg uppercase">
            {post.author.name && post.author.name.length > 0
              ? post.author.name[0]
              : 'U'}
          </span>
        )}
      </div>
      <div className="flex-1 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to={`/posts/${post.id}`}
            className="text-xl font-semibold text-gray-900 hover:underline"
          >
            {post.title}
          </Link>
          {isOwner && (
            <button
              className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label="Edit post"
              onClick={onEdit}
              type="button"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 01.586-1.414l6.768-6.768z"
                />
              </svg>
            </button>
          )}
        </div>
        <p className="text-gray-700 mt-2 mb-3 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>{post.author.name}</span>
          <span className="mx-2">·</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    userId: PropTypes.string,
  }).isRequired,
  color: PropTypes.string,
  currentUserId: PropTypes.string,
  onEdit: PropTypes.func,
};

export default BlogCard;