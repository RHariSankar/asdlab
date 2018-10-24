const Sequelize =require('sequelize');
const DataTypes=Sequelize.DataTypes;

module.exports=function(sequelize,DataTypes){
  const User = sequelize.define('user', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull:false,
      autoIncrement:true,
      primaryKey:true
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull:false
    },
    username:{
        type: Sequelize.STRING(50),
        allowNull: false
    },
    email:{
      type:Sequelize.STRING(50),
      allowNull:false
    },
    password:{
        type: Sequelize.STRING(200),
        allowNull:false
    }
    
  });

  User.getUserById = function(id, callback) {
    User.findById(id).then(user => {
      console.log(user);
    });
  }
  
 User.getUserByUsername = function(username, callback) {
    User.findOne({
      where:{username: username}
    }).then(user =>{
      console.log('User_found: '+user.username)
    });
  }
  
   User.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password = hash;
        User.create(newUser);
      });
    });
  }
  
   User.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      callback(null, isMatch);
    });
  }


 return User;


 
  
}
  

