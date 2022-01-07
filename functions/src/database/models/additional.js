const Sequelize = require('sequelize');

module.exports = class Additional extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        title: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        content: {
            type: Sequelize.STRING(300),
            allowNull: true,
        },
        is_deleted: {
            type:Sequelize.BOOLEAN,
            defaultValue: false
          }
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Additional',
      tableName: 'additional',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Additional.belongsTo(db.Post);
  }
};