// sudo service mongod start/restart/stop
// mongo 
// use table name -> db.action
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const flash = require('connect-flash');
const expressValidator = require('express-validator');

// Mongodb connection
const uri = 'mongodb://localhost:27017/test'
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true
});
// mongoose.Promise = global.Promise;
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Mongodb Connected Successfully.');
});

const app = express();
app.use(morgan('tiny'));
//static files to import css in pug 
app.use(express.static('public'));

//session
app.use(session({
  secret: 'fadlkuanvdflbdissgndvdoerisfdslj',
  resave: false,
  saveUninitialized: false
}));

// flash
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());
require('./passportconfig').configure(passport);

//handle post bodies
app.use(bodyParser.urlencoded({
  extended: false
}));

// pug view setup
app.set('view engine', 'pug')

// routes
app.use(require('./routes/general'));
app.use(require('./routes/auth'));


app.listen(3000, function () {
  console.log('Listening to port 3000');
})