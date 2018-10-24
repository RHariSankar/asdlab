const express = require('express'),
	  router = express.Router(),
	  sequelize=require('../app.js')
	  passport = require('passport'),
	  LocalStrategy=require('passport-local').Strategy;

		const User = sequelize.import('../models/users');
		const Post= sequelize.import('../models/posts');
		const comment= sequelize.import('../models/comments');

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
		User.findOne({where:{user_id:post.user_id}}).then(user=>{
			console.log(user)
			res.render('dashboard',{docs:post,user:user})
		})
		console.log(post)
		
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
router.get('/commentpage/:pid',isLoggedIn,(req,res)=>{
	let pid=req.params.pid;
	console.log(pid);
	let post_user=req.user.username;
	Post.findById(pid).then(post=>{
				comment.findAll({where:{ post_id:pid},
													raw:true,
													attributes:['comm_id','user_id','content','post_id']
						}).then(function(comment){
							
				res.render('comments',{comm:comment ,post:post ,username:post_user  })
		})
	})
})

//adding comments to db
router.post('/addcomment',isLoggedIn,(req,res)=>{
	console.log(req.body.post_id)
	let new_comment={
		user_id:req.user.user_id,
		content:req.body.content,
		post_id:req.body.post_id
	}
	comment.create(new_comment).then(comm=>{
		console.log("comment entered!!!")
	})
	res.redirect('/commentpage/'+req.body.post_id)
})

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}


module.exports = router;
