const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const path = require('path');


// welcome page
if (process.env.NODE_ENV === "production") {
    router.get('/', ensureAuthenticated, (req, res) => res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"), {
        displayName: req.user.doc_name
    }));
}


// dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    {
        //console.log(req.user);
        res.render('dashboard', {
            name: req.user.doc_name
        })}
    );

module.exports = router;