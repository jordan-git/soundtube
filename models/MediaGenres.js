module.exports = sequelize => {
    const { DataTypes } = require("sequelize");

    const MediaGenres = sequelize.define(
        "MediaGenres",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            genre_id: {
                type: DataTypes.INTEGER,
                allowNull: false
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
        { timestamps: false, tableName: "media_genres" }
    );

    return MediaGenres;
};
