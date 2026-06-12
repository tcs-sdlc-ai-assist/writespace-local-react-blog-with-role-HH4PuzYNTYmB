import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { clearSession } from '../utils/auth';

/**
 * Authenticated Navbar component.
 * Shows logo, role-based links, user avatar, logout dropdown, and mobile hamburger toggle.
 * @param {Object} props
 * @param {Object} props.user - Authenticated user object
 * @param {string} props.user.name - User's name
 * @param {string} [props.user.role] - Optional user role (e.g., 'admin')
 */
function Navbar({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  // Role-based links
  const links = [
    { to: '/dashboard', label: 'Dashboard', roles: ['user', 'admin'] },
    { to: '/posts', label: 'My Posts', roles: ['user', 'admin'] },
    { to: '/admin', label: 'Admin', roles: ['admin'] },
  ];

  const userRole = user.role || 'user';

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow relative z-20">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg text-white hover:text-gray-200 transition-colors">
          writespace
        </Link>
        <div className="hidden md:flex items-center gap-2 ml-6">
          {links
            .filter(link => link.roles.includes(userRole))
            .map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-white text-gray-900'
                    : 'hover:bg-gray-800 hover:text-white text-gray-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
        </div>
      </div>
      {/* Mobile hamburger */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded hover:bg-gray-800 focus:outline-none"
        aria-label="Open menu"
        onClick={() => setMobileOpen(v => !v)}
        type="button"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>
      {/* User avatar and dropdown */}
      <div className="relative ml-4" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none"
          onClick={() => setDropdownOpen(v => !v)}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          type="button"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-semibold uppercase">
            {user.name && user.name.length > 0 ? user.name[0] : 'U'}
          </span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white text-gray-900 rounded shadow-lg py-2 z-30">
            <div className="px-4 py-2 text-sm font-medium border-b border-gray-100">
              {user.name}
            </div>
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              Settings
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 text-white shadow-lg flex flex-col md:hidden z-10">
          {links
            .filter(link => link.roles.includes(userRole))
            .map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-6 py-3 border-b border-gray-800 text-base font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-white text-gray-900'
                    : 'hover:bg-gray-800 hover:text-white text-gray-200'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          <Link
            to="/settings"
            className={`px-6 py-3 border-b border-gray-800 text-base font-medium transition-colors ${
              location.pathname === '/settings'
                ? 'bg-white text-gray-900'
                : 'hover:bg-gray-800 hover:text-white text-gray-200'
            }`}
            onClick={() => setMobileOpen(false)}
          >
            Settings
          </Link>
          <button
            className="px-6 py-3 text-base font-medium text-left w-full hover:bg-gray-800 transition-colors"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string,
  }).isRequired,
};

export default Navbar;