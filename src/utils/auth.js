/**
 * Get the current session object from localStorage.
 * @returns {Object|null} Session object or null if not found/invalid
 */
export function getSession() {
  try {
    const data = localStorage.getItem('writespace_session');
    if (!data) return null;
    const parsed = JSON.parse(data);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch (e) {
    return null;
  }
}

/**
 * Save a session object to localStorage.
 * @param {Object} obj
 */
export function setSession(obj) {
  try {
    localStorage.setItem('writespace_session', JSON.stringify(obj));
  } catch (e) {
    // Ignore write errors
  }
}

/**
 * Remove the session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem('writespace_session');
  } catch (e) {
    // Ignore remove errors
  }
}