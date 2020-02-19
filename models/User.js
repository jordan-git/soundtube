module.exports = sequelize => {
    const { DataTypes } = require('sequelize');
    const bcrypt = require('bcrypt');

    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: { type: DataTypes.STRING(24), allowNull: false },
            password: {
                type: DataTypes.STRING(128),
                allowNull: false
            },
            created_at: { type: DataTypes.DATEONLY, allowNull: false },
            email: { type: DataTypes.STRING(64), allowNull: false },
            date_of_birth: { type: DataTypes.DATEONLY, allowNull: false }
        },
        {
            timestamps: false,
            tableName: 'users',
            underscored: true,
            hooks: {
                beforeCreate: user => {
                    user.password = bcrypt.hashSync(user.password, 10);
                }
            }
        }
    );

    User.associate = models => {
        models.User.hasOne(models.Profile, { foreignKey: 'user_id' });
    };

    return User;
};
