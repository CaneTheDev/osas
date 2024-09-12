// Middleware to protect admin routes
exports.isAdminAuthenticated = (req, res, next) => {
    if (req.session.admin) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized. Admin access only.' });
};
