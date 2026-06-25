const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secret = process.env.JWT_SECRET;


const createTokenForUser = (user) => {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };
    return jwt.sign(payload, secret);
};

function validateToken(token) {
   const payload = jwt.verify(token, secret);
   return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
};