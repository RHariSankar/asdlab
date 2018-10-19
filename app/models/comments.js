const Sequelize =require('sequelize');
const DataTypes=Sequelize.DataTypes;

module.exports=function(sequelize,DataTypes){
  const Comment = sequelize.define('comment', {
    comm_id: {
      type: Sequelize.INTEGER,
      allowNull:false,
      autoIncrement:true,
      primaryKey:true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull:false
    },
    description:{
        type: Sequelize.STRING(500),
        allowNull: false
    },
    post_id:{
        type: Sequelize.INTEGER,
        allowNull:false
    }
    
  });

 return Comment;


 
  
}
  

