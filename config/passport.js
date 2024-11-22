const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
//const pool = require("../config/elephantsql");
const pool = require("../config/tembosql");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'loginId'}, async (loginId, password, done) => {
            //Match user

            try {
                const doctorList = await pool.query("SELECT * FROM public.login_table WHERE login_name=$1", [loginId]);
                //console.log(doctorList);
                var result = await doctorList["rows"]
            } catch (err) {
                console.log(err);
            }
            //console.log(doctorList);
            if (result.length === 0 || !result) { return done(null, false, { message: "Login ID not found" })}
            result = result[0]
            bcrypt.compare(password, result['password'], (err, isMatch) => {
                if (err) throw err;
                if (isMatch) { 
                    return done(null, result) 
                    //done(error, success)
                } else {
                    return done(null, false, { message: "Password incorrect" })
                }
            })
        }
    ))

    //https://stackoverflow.com/questions/30066094/how-to-configure-passportjs-with-sql-server
    passport.serializeUser(function (user, done) {
        console.log('serializing user:', user);
        done(null, user);
    });

    passport.deserializeUser(function (username, done) {
        console.log('deserializing user:', username);
        done(null, username);
    });
}
