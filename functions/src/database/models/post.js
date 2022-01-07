const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        star: {
          type: Sequelize.INTEGER,
          allowNull:false,
        },
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        oneline: {
          type: Sequelize.ARRAY(Sequelize.STRING(50)),
          allowNull: false,
        },
        comment: {
          type: Sequelize.STRING(300),
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        is_deleted: {
          type:Sequelize.BOOLEAN,
          defaultValue: false
        }
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Post',
      tableName: 'post',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsTo(db.Media);
    db.Post.hasMany(db.Additional);
    db.Post.hasOne(db.Img);
  }
};