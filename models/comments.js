const Sequelize =require('sequelize');
const DataTypes=Sequelize.DataTypes;


module.exports=function(sequelize,DataTypes){
  const Comments = sequelize.define('comment', {
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
    content:{
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    post_id:{
        type: Sequelize.INTEGER,
        allowNull:false
    }
    
  });

  Comments.associate = function (models) {
    models.comments.belongsTo(models.posts, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'post_id',
        allowNull: false
      },
    });
};

 return Comments;


 
  
}
  

