const express = require("express"),
	app		= express(),
	methodOverride = require("method-override"),
	bodyParser = require('body-parser'),
  passport=require('passport'),
  session=require('express-session'),
  cookieParser=require('cookie-parser'),
  bcrypt =require('bcrypt');


require('dotenv').config();
const db_config =require('./config/database');

const Sequelize = require('sequelize');

//database connection
const sequelize = new Sequelize(db_config.name, db_config.user, db_config.pass, {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

const User=require('./app/models/users')(sequelize,sequelize.DataTypes)
const Post=require('./app/models/posts')(sequelize,sequelize.DataTypes)

 module.exports =sequelize;
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync();



app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({ secret: 'secret',resave:true,saveUninitialized:true }));

//passport-js config
app.use(passport.initialize());
app.use(passport.session());


// app.use(function(req, res, next){
// 	res.locals.error = req.flash('error');
// 	res.locals.success = req.flash('success');
// 	next();
// });

//Requiring Passport-congig
require('./config/auth')(passport,User);


//Requiring Routes
const router= require('./app/routes/users')
app.use(router);
// app.use(indexRoutes);
// app.use('/login',login);

app.listen(process.env.PORT, process.env.IP, function(err){
	if(err){
		console.log(err);
	} else{
		console.log('Started successfully ' + process.env.PORT);
	}
});
