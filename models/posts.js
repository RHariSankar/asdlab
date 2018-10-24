const Sequelize =require('sequelize');
const DataTypes=Sequelize.DataTypes;


module.exports=function(sequelize,DataTypes){
  const Post = sequelize.define('post', {
    post_id: {
      type: Sequelize.INTEGER,
      allowNull:false,
      autoIncrement:true,
      primaryKey:true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull:false
    },
    title:{
        type: Sequelize.STRING(200),
        allowNull:false
    },
    idea:{
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    like_count:{
        type:Sequelize.INTEGER,
        allowNull:true,
        default:0
    }
      
  });

  Post.associate = function (models) {
    models.Post.belongsTo(models.users, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'user_id',
        allowNull: false
      },
    });
};

 return  Post;


 
  
}
  

