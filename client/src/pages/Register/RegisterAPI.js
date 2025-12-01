import api from '../../api.js';

/**
 * Register API function
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} username - Desired username
 * @returns {Promise<Object>} Server response containing the token
 * @throws {Error} Network or server error
 */
export async function registerUser(email, password, username) {
  try {
    const response = await api.post('/auth/register', {
      email,
      password,
      username,
    });
    return response.data;
  } catch (error) {
    // Re-throw the error so the calling component can handle it
    throw error;
  }
}

