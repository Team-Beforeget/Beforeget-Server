const Sequelize = require('sequelize');

module.exports = class Label extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            page: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            content: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Label',
            tableName: 'label',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Label.belongsTo(db.Media);
    }
}