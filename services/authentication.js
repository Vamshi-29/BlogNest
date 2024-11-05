const jwt = require('jsonwebtoken'); // Import jwt directly, not destructured

const secret = "vamshisec@123";

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };
    const token = jwt.sign(payload, secret); // Generate token with payload and secret
    return token;
}

function validateToken(token) { // Use token as the parameter
    try {
        const decoded = jwt.verify(token, secret); // Verify token
        return decoded;
    } catch (error) {
        console.error("Token validation error:", error);
        return null; // Return null if verification fails
    }
}

module.exports = {
    createTokenForUser,
    validateToken
};
