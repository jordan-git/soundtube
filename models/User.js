module.exports = sequelize => {
    const { DataTypes } = require('sequelize');
    const pw = require('password-hash');

    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: { type: DataTypes.STRING(24), allowNull: false },
            password: { type: DataTypes.STRING(128), allowNull: false },
            created_at: { type: DataTypes.DATE, allowNull: false },
            email: { type: DataTypes.STRING(64), allowNull: false },
            date_of_birth: { type: DataTypes.DATE, allowNull: false }
        },
        {
            timestamps: false,
            tableName: 'users',
            hooks: {
                beforeCreate: user => {
                    const salt = pw.generate(user.password);
                    user.password = salt;
                }
            },
            instanceMethods: {
                // TODO find out how to use this when verifying
                validPassword: password => {
                    return pw.verify(password, this.password);
                }
            }
        }
    );

    User.associate = models => {
        models.User.hasOne(models.Profile);
    };

    return User;
};
