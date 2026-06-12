import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatCard component.
 * Displays a stat tile for admin dashboard: icon, label, value, optional change.
 * @param {Object} props
 * @param {string} props.label - Stat label (e.g. "Users")
 * @param {number|string} props.value - Stat value
 * @param {React.ReactNode} [props.icon] - Optional icon (SVG or element)
 * @param {string} [props.color] - Tailwind color for icon bg (e.g. "blue-500")
 * @param {string|number} [props.change] - Optional change indicator (e.g. "+5%")
 * @param {string} [props.changeType] - "up" | "down" for change arrow color
 */
function StatCard({ label, value, icon, color = 'blue-500', change, changeType }) {
  const iconBg = `bg-${color}`;
  const changeColor =
    changeType === 'up'
      ? 'text-green-600'
      : changeType === 'down'
      ? 'text-red-600'
      : 'text-gray-500';

  return (
    <div className="flex items-center bg-white rounded-lg shadow px-5 py-4 mb-4">
      {icon && (
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBg} bg-opacity-10 mr-4`}>
          <span className={`text-2xl text-${color}`}>{icon}</span>
        </div>
      )}
      <div className="flex-1">
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change !== undefined && change !== null && (
          <div className={`flex items-center text-xs mt-1 font-medium ${changeColor}`}>
            {changeType === 'up' && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
            {changeType === 'down' && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
  change: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeType: PropTypes.oneOf(['up', 'down']),
};

export default StatCard;