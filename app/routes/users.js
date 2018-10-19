const express = require('express'),
	  router = express.Router(),
	  sequelize=require('../../app.js')
	  passport = require('passport'),
	  LocalStrategy=require('passport-local').Strategy;

	  const User = sequelize.import('../models/users');

// Login Page
router.get('/login',async function(req, res){
	res.render('login');
});

//Signup page 
router.get('/signup',async function(req, res){
	 res.render('signup');
 });
   
//for authentication during signup
 router.post('/register',passport.authenticate('local-signup', { failureRedirect: '/signup' }),
  function(req, res) {
    res.redirect('/dashboard');
  });

//for authentication during login
  router.post('/authenticate',passport.authenticate('local-login', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard');
  });

//Logging out
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });


//dashboard page
router.get('/dashboard',isLoggedIn,(req,res)=>{
	res.render('dashboard');
})

//profile page
router.get('/profile',isLoggedIn,(req,res)=>{
	res.render('profile');
})




function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}


module.exports = router;
