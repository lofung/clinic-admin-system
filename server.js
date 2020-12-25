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

dotenv.config({ path: './config/config.env' });

//connectDB(); for mongodb
//client();
//elephantSQL test, seems not needed


const routes = require('./routes/routes');
const users = require('./routes/users');
const client = require('./config/elephantsql');

const app = express();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyparser
app.use(express.urlencoded({ extended: false }))

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
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));