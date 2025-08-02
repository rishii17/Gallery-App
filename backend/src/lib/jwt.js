import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token (JWT).
 * @param {string} id - The user ID to be included in the token payload.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default generateToken;