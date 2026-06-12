import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getSession } from '../utils/auth';

/**
 * ProtectedRoute component for route guarding.
 * Checks writespace_session in localStorage.
 * Redirects guests to /login.
 * If role prop is 'admin' and user is not admin, redirects to /blogs.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Protected content
 * @param {string} [props.role] - Optional required role ('admin')
 */
function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const session = getSession();

  if (!session || !session.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === 'admin' && session.user.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

export default ProtectedRoute;