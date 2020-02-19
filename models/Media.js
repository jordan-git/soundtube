module.exports = sequelize => {
    const { DataTypes } = require("sequelize");

    const Media = sequelize.define(
        "Media",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: { type: DataTypes.STRING(64), allowNull: false },
            created_at: { type: DataTypes.DATE, allowNull: false },
            views: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            profile_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "profiles",
                    key: "id"
                }
            }
        },
        { timestamps: false, tableName: "media", underscored: true }
    );

    Media.associate = models => {
        models.Media.hasMany(models.MediaComments, { foreignKey: "media_id" });
        models.Media.hasMany(models.MediaGenres, { foreignKey: "media_id" });
        models.Media.hasMany(models.MediaRatings, { foreignKey: "media_id" });
    };

    return Media;
};
