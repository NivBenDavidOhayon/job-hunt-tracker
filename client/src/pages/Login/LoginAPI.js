import api from '../../api.js';

/**
 * Login API function
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Server response containing the token
 * @throws {Error} Network or server error
 */
export async function loginUser(email, password) {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Re-throw the error so the calling component can handle it
    throw error;
  }
}

