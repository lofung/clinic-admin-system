const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const pool = require('./config/elephantsql')
const expressLayouts = require('express-ejs-layouts');
//const client = require('./config/elephantsql'); 
//elephantSQL test, seems not needed
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { ensureAuthenticated } = require('./config/auth');

dotenv.config({ path: './config/config.env' });

//connectDB(); for mongodb
//client();
//elephantSQL test, seems not needed


const routes = require('./routes/routes');
const users = require('./routes/users');
const client = require('./config/elephantsql');

const app = express();

//passport config
require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyparser
app.use(express.urlencoded({ extended: false }))

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global variables for colors
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use(express.json());

//morgan for development
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.use('/api/v1/', routes);
app.use('/auth/', users);
app.use('/', require('./routes/index'));

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'));
    app.get('*', ensureAuthenticated, (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")));
    
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));