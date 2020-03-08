module.exports = sequelize => {
    const { DataTypes } = require('sequelize');

    const MediaRatings = sequelize.define(
        'MediaRatings',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            media_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'media',
                    key: 'id'
                }
            },
            profile_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'profiles',
                    key: 'id'
                }
            }
        },
        { timestamps: false, tableName: 'media_ratings' }
    );

    return MediaRatings;
};
