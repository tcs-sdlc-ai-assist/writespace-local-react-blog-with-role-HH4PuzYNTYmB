import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * PublicNavbar component.
 * Shows logo and navigation for guests.
 * If user is provided, shows avatar and dashboard link.
 * @param {Object} props
 * @param {Object} [props.user] - Optional user object
 */
function PublicNavbar({ user }) {
  const location = useLocation();

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="font-bold text-lg text-gray-900 hover:text-gray-700 transition-colors">
        writespace
      </Link>
      {user ? (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-semibold uppercase">
            {user.name && user.name.length > 0 ? user.name[0] : 'U'}
          </span>
          <Link
            to="/dashboard"
            className={`px-3 py-1 rounded text-sm font-medium ${
              location.pathname === '/dashboard'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            } transition-colors`}
          >
            Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className={`px-3 py-1 rounded text-sm font-medium ${
              location.pathname === '/login'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            } transition-colors`}
          >
            Login
          </Link>
          <Link
            to="/login"
            className="px-3 py-1 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}

PublicNavbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default PublicNavbar;