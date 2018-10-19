const bCrypt= require('bcrypt');
const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, user) {
 
  let User = user;
  
  
  passport.use('local-signup',new LocalStrategy(
 
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
 
    },
    function(req, email, password, done) {
      const generateHash = function(password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
      };

      User.findOne({ where: {email: email} }).then(function(user) {
        if (user)
        {   return done(null, false, {
            message: 'That email is already taken',
            });
        } else {
            var userPassword = generateHash(password);
            var data ={
                    username: email,
                    password: userPassword,
                    email: req.body.email,
                    name:req.body.name
                     };
              };
          User.create(data).then(function(newUser, created) {
            if (!newUser) {
              return done(null, false);  }
            if (newUser) {
              return done(null, newUser); }     
            });
     
        });
     
    }
));

passport.use('local-login', new LocalStrategy({ 
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true 
    },
 
    function(req, username, password, done) {
 
        let User = user;
        let isValidPassword = function(userpass, password) {
             return bCrypt.compareSync(password, userpass);
         }
         User.findOne({
            where: { username: username} }).then(function(user) {
            if (!user) {
                 return done(null, false, {
                    message: 'User does not exist'
                });
             }
 
            if (!isValidPassword(user.password, password)) {
                 return done(null, false, {
                    message: 'Incorrect password.'
                });
 
            }
            var userinfo = user.get();
            return done(null, userinfo);
         }).catch(function(err) {
             console.log("Error:", err);
             return done(null, false, {
                message: 'Something wrong in login!'
            });
         });
 
    }
 
));

passport.serializeUser(function(user, done) {
  done(null, user.user_id);

});

passport.deserializeUser(function(user_id, done) {
    User.findById(user_id).then(function(user) {
    if (user) {
        done(null, user.get());
    } else {
     done(user.errors, null);

      }

  });

});

}