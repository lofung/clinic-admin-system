//to guard pages from being accessed without logged in

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view the resources')
        res.redirect('auth/login');
    }, 
    ensureNotAuthenticated: function (req, res, next) {
        if(!req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'You are already logged in. Unauthorized access to auth pages')
        if (process.env.NODE_ENV === "production") {
            res.redirect('/');
        } else {
            res.redirect('/ashboard')
        }
    }
}