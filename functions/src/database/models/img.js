const Sequelize = require('sequelize');

module.exports = class Img extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        title: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        url: {
            type: Sequelize.STRING(300),
            allowNull: false,
        },
        is_deleted: {
            type:Sequelize.BOOLEAN,
            defaultValue: false
          },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Img',
      tableName: 'img',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Img.belongsTo(db.Post);
  }
};