module.exports = sequelize => {
    const { DataTypes } = require("sequelize");

    const Profile = sequelize.define(
        "Profile",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            stage_name: { type: DataTypes.STRING(32) },
            location: { type: DataTypes.STRING(48) },
            interests: { type: DataTypes.STRING(64) },
            favourite_genres: { type: DataTypes.STRING(64) },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                }
            }
        },
        { timestamps: false, tableName: "profiles", underscored: true }
    );

    Profile.associate = models => {
        models.Profile.hasMany(models.Media, { foreignKey: "profile_id" });
        models.Profile.hasMany(models.Messages, { foreignKey: "profile_id" });
        models.Profile.hasMany(models.ProfileComments, {
            foreignKey: "profile_id"
        });
    };

    return Profile;
};
