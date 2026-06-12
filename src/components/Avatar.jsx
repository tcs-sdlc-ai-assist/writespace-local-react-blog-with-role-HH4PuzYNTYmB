import React from 'react';
import PropTypes from 'prop-types';

/**
 * getAvatar returns a styled <span> with emoji and color for the given role.
 * @param {string} role - User role ('admin', 'user', 'editor', etc.)
 * @returns {JSX.Element}
 */
export function getAvatar(role) {
  let emoji = '👤';
  let className =
    'inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold text-base uppercase ';

  switch (role) {
    case 'admin':
      emoji = '🛡️';
      className += 'bg-red-100 text-red-700 border border-red-300';
      break;
    case 'editor':
      emoji = '✍️';
      className += 'bg-green-100 text-green-700 border border-green-300';
      break;
    case 'user':
      emoji = '📝';
      className += 'bg-blue-100 text-blue-700 border border-blue-300';
      break;
    default:
      emoji = '👤';
      className += 'bg-gray-200 text-gray-700 border border-gray-300';
      break;
  }

  return (
    <span className={className} title={role}>
      {emoji}
    </span>
  );
}

getAvatar.propTypes = {
  role: PropTypes.string,
};