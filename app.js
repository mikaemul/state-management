'use strict';
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('./utils/pass');
const app = express();
const port = 3000;
/*const username = 'foo';
const password = 'bar';

 */
const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({secret:'Shh, its a secret!',
  saveUninitialized: true,
  resave: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', './views');
app.set('view engine', 'pug');



app.get('/', (req, res) => {
  res.render('home');
});
app.get('/setCookie/:clr', (req, res) => {
  res.cookie('color', req.params.clr).send('cookie set');
  console.log('works');
});
app.get('/deleteCookie', (req, res) => {
  res.clearCookie('color').send('color deleted');
  console.log('delete color cookie');
});
app.get('/form', (req,res) =>{
  res.render('form.pug');
});
// modify app.post('/login',...
app.post('/login',
    passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
      console.log('success');
      res.redirect('/secret');
    });

// modify app.get('/secret',...
app.get('/secret', loggedIn, (req, res) => {
  res.render('secret');
});

/*
app.post('/login', (req,res) =>{
  var user = req.body.username;
  var passwd = req.body.password;
  if(user === username  && passwd === password){
    req.session.loggedIn = true;
  res.redirect('/secret');
  }else{
    //req.session.logged = false;
    res.redirect('/form');
  }
  res.end();
});
app.get('/secret', (req,res) =>{
  if(req.session.loggedIn){
    //res.redirect('/secret');
    res.render('secret.pug');

  }else{
    res.redirect('/form');
  }
  res.end();
});

 */
app.get('/logout',(req, res) =>{
  req.logout();
  res.redirect('/');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
