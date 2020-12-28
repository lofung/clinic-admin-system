//to guard pages from being accessed without logged in

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view the resources')
        res.redirect('auth/login');
    }
}