const Sequelize = require('sequelize');

module.exports = class Media extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            oneline: {
                type: Sequelize.ARRAY(Sequelize.STRING(50)),
                allowNull: false,
            },
            recommend: {
                type: Sequelize.ARRAY(Sequelize.STRING(50)),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Media',
            tableName: 'media',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Media.hasMany(db.Post);
        db.Media.hasMany(db.Label);
        db.Media.belongsToMany(db.User, { through: 'Show' });
    }
}
