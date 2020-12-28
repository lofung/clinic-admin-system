const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const path = require('path');


// welcome page
//router.get('/', (req, res) => res.render('welcome'));

// dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    {
        console.log(req.user);
        res.render('dashboard', {
            name: req.user.doc_name
        })}
    );

module.exports = router;