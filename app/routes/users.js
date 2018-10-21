const express = require('express'),
	  router = express.Router(),
	  sequelize=require('../../app.js')
	  passport = require('passport'),
	  LocalStrategy=require('passport-local').Strategy;

		const User = sequelize.import('../models/users');
		const Post= sequelize.import('../models/posts');

 //Landing page
router.get('/',async function(req,res){
  res.render('landing');
})  
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

	//Post page
	router.get('/feedpost',isLoggedIn,async (req,res)=>{
					res.render('posts');
				
	})

//for adding posts to db
router.post('/savefeed',isLoggedIn,function(req,res){
	let newPost={
		user_id: req.user.user_id,
		title:req.body.title,
		idea:req.body.idea,
		like_count: 0
	}	
	Post.create(newPost).then(function(post){
		console.log(post);
	})
		res.redirect('/dashboard')
})



//Logging out
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });


//dashboard page
router.get('/dashboard',isLoggedIn,async(req,res)=>{
Post.findAll({
		raw:true,
		attributes:['post_id','user_id','title','idea','like_count']
	}).then(function(post){
		console.log(post)
		res.render('dashboard',{docs:post})
	});
})

router.post('/addlike',isLoggedIn,async(req,res)=>{
	console.log(req.body.pid)
	Post.findById(req.body.pid).then(post=>{
		return post.increment('like_count',{by:1})
	})
res.redirect('/dashboard')
})
//profile page
router.get('/profile',isLoggedIn,(req,res)=>{
	res.render('profile');
})

//coment page for each post
router.get('/commentpage',isLoggedIn,(req,res)=>{
	res.render('comments')
})

//adding comments to db
router.post('/addcomment',isLoggedIn,(req,res)=>{
	
})

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}


module.exports = router;
