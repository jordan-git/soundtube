module.exports = sequelize => {
    const { DataTypes } = require("sequelize");

    const MediaComments = sequelize.define(
        "MediaComments",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            created_at: { type: DataTypes.DATE, allowNull: false },
            comment: { type: DataTypes.STRING(128), allowNull: false },
            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "profiles",
                    key: "id"
                }
            },
            media_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "media",
                    key: "id"
                }
            }
        },
        { timestamps: false, tableName: "media_comments" }
    );

    return MediaComments;
};
