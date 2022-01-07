const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        email: {
          type: Sequelize.STRING(100),
          allowNull:false,
          unique:true,
        },
        token: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        nick: {
          type: Sequelize.STRING(80),
          allowNull: false,
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
      modelName: 'User',
      tableName: 'user',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.Media, {through: 'Show'});
  }
};