/**
 * Get posts array from localStorage.
 * @returns {Array} Array of posts or []
 */
export function getPosts() {
  try {
    const data = localStorage.getItem('posts');
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * Save posts array to localStorage.
 * @param {Array} arr
 */
export function savePosts(arr) {
  try {
    localStorage.setItem('posts', JSON.stringify(arr));
  } catch (e) {
    // Ignore write errors
  }
}

/**
 * Get users array from localStorage.
 * @returns {Array} Array of users or []
 */
export function getUsers() {
  try {
    const data = localStorage.getItem('users');
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * Save users array to localStorage.
 * @param {Array} arr
 */
export function saveUsers(arr) {
  try {
    localStorage.setItem('users', JSON.stringify(arr));
  } catch (e) {
    // Ignore write errors
  }
}