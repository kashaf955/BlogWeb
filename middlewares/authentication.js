const { validateToken } = require('../services/authentication');

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next();
        }

        try {
            req.user = validateToken(tokenCookieValue);
        } catch (error) {
            
        }
        return next();
    };
}

function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required. Please login.' });
    }
    return next();
}

function apiErrorHandler(err, req, res, next) {
    console.error('API error:', err);
    if (res.headersSent) {
        return next(err);
    }
    const status = err.status || err.statusCode || 500;
    return res.status(status).json({
        error: err.message || 'Internal server error',
    });
}

module.exports = {
    checkForAuthenticationCookie,
    requireAuth,
    apiErrorHandler,
};
