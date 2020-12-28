const express = require('express');
const router = express.Router();
const pool = require("../config/elephantsql");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const { ensureNotAuthenticated } = require('../config/auth');


// login page
router.get('/login', ensureNotAuthenticated, (req, res) => res.render('login'));
//will render login.ejs

// register page
router.get('/register', ensureNotAuthenticated, (req, res) => res.render('register'));
//will render register.ejs

// register handle
router.post('/register', async (req, res) => {
    //console.log(req.body);
    //res.send('hello');
    const { name, loginId, password, password2} = req.body;
    let errors =[];
    //check required fields
    if(!name || !loginId || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'});
    }
    //check password match
    if(password !== password2) {
        errors.push({msg: "Passwords do not match"})
    }
    //check password legnth
    if(password.length < 8 ) {
        errors.push({msg: "Password should be at least 8 characters"})
    }
    //if no error then proceed
    if(errors.length > 0){
        res.render('register', {errors, name, loginId, password, password2})
    
    } else {
        //console.log("into validation")
        // validation passed
        try {
            const doctorList = await pool.query("SELECT * FROM login_table");
            var result = await doctorList["rows"]
            if (result.length === 0) {
                errors.push({ msg: "Please try pushing register again" });
                res.render('register', {
                    errors,
                    name,
                    loginId,
                    password,
                    password2
                })
            }
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: "Server Error - cannot load doctor list"
            });
        }
    

        result.forEach(doctor => {
            if (doctor.login_name === loginId) {
                //same login name
                errors.push({ msg: "login ID is already registered" });
            } 
            //console.log(doctor.doc_name)
            if (doctor.doc_name === name) {
                //same display name
                errors.push({ msg: "display name is already registered" });

            } 
        })
        if (errors.length>0){
            res.render('register', {
                errors,
                name,
                loginId,
                password,
                password2
            })
            return 1
        }
        const isAdmin = false;
        //res.send('success')
        bcrypt.genSalt(10, (err, salt) => 
            bcrypt.hash(password, salt, async (err, hash)=> {
                if(err) throw err;
                //console.log(hash)
                //console.log("login ID is " + loginId + "!! name is " + name + "!! hashpassword is " + hash)
                //console.log(hash.length)
                try {
                    const newDoctor = await pool.query("INSERT INTO login_table (login_name, doc_name, password, is_Admin) VALUES ($1, $2, $3, $4)",
                    [loginId, name, hash, isAdmin])
                    req.flash('success_msg', "You are now registered and can log in")
                    return res.redirect('/auth/login')
                    //MUST use redirect for req.flash
                } catch (err) {
                    return res.status(500).json({
                        success: false,
                        error: "Server Error, can retrieve register draft but cannot register"
                    });
                }
        }))
    }
});

//login handle
router.post('/login', (req, res, next) => {
    //console.log(res.body)
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/auth/login",
        failureFlash: true
    }) (req, res, next);
})

//logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', "You have been logged out");
    res.redirect('/auth/login');
})

module.exports = router;