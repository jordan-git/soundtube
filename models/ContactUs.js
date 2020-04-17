module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const ContactUs = sequelize.define(
        'ContactUs',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: { type: DataTypes.STRING(32) },
            email: { type: DataTypes.STRING(48) },
            message: { type: DataTypes.STRING(128) },
        },
        { timestamps: false, tableName: 'contact_us', underscored: true }
    );

    return ContactUs;
};
