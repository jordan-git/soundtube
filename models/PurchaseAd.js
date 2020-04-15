module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const PurchaseAd = sequelize.define(
        'PurchaseAd',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            fullName: { type: DataTypes.STRING(48) },
            company: { type: DataTypes.STRING(48) },
            email: { type: DataTypes.STRING(48) },
            adDescription: { type: DataTypes.STRING(128) },
        },
        { timestamps: false, tableName: 'purchasead', underscored: true }
    );

    return PurchaseAd;
};
