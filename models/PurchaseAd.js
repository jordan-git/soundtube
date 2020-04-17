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
            name: { type: DataTypes.STRING(48) },
            company: { type: DataTypes.STRING(48) },
            email: { type: DataTypes.STRING(48) },
            description: { type: DataTypes.STRING(128) },
        },
        { timestamps: false, tableName: 'purchase_ad', underscored: true }
    );

    return PurchaseAd;
};
