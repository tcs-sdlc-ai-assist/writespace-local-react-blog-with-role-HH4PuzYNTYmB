import React from 'react';
import PropTypes from 'prop-types';

/**
 * UserRow component.
 * Displays a user as a table row or card: avatar, name, username, role badge, created date, delete button.
 * @param {Object} props
 * @param {Object} props.user - User object
 * @param {string} props.user.id - User ID
 * @param {string} props.user.name - Display name
 * @param {string} props.user.username - Username
 * @param {string} [props.user.avatar] - Optional avatar URL
 * @param {string} props.user.role - Role (e.g. 'admin', 'user')
 * @param {string} props.user.createdAt - ISO date string
 * @param {Function} [props.onDelete] - Optional delete handler (userId) => void
 */
function UserRow({ user, onDelete }) {
  // Format date as "MMM D, YYYY"
  let formattedDate = '';
  try {
    const d = new Date(user.createdAt);
    formattedDate = d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    formattedDate = user.createdAt;
  }

  const roleColors = {
    admin: 'bg-red-100 text-red-700 border-red-300',
    user: 'bg-blue-100 text-blue-700 border-blue-300',
    editor: 'bg-green-100 text-green-700 border-green-300',
  };
  const badgeClass =
    'inline-block px-2 py-0.5 rounded text-xs font-semibold border ' +
    (roleColors[user.role] || 'bg-gray-100 text-gray-700 border-gray-300');

  return (
    <tr className="bg-white border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 text-gray-700 font-bold text-base uppercase">
              {user.name && user.name.length > 0 ? user.name[0] : 'U'}
            </span>
          )}
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">@{user.username}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={badgeClass}>{user.role}</span>
      </td>
      <td className="px-4 py-3 text-gray-700">{formattedDate}</td>
      <td className="px-4 py-3 text-right">
        <button
          className="inline-flex items-center px-2 py-1 text-sm rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
          onClick={() => onDelete && onDelete(user.id)}
          aria-label="Delete user"
          type="button"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Delete
        </button>
      </td>
    </tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
};

export default UserRow;