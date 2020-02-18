module.exports = sequelize => {
    const { DataTypes } = require("sequelize");

    const ProfileComments = sequelize.define(
        "ProfileComments",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            created_at: { type: DataTypes.DATE, allowNull: false },
            comment: { type: DataTypes.STRING(128), allowNull: false },
            poster_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "profiles",
                    key: "id"
                }
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
        { timestamps: false, tableName: "profile_comments" }
    );

    return ProfileComments;
};
