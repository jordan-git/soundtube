module.exports = sequelize => {
    const { DataTypes } = require("sequelize");

    const Messages = sequelize.define(
        "Messages",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            created_at: { type: DataTypes.DATE, allowNull: false },
            message: { type: DataTypes.STRING(128) },
            sender_id: {
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
        { timestamps: false, tableName: "messages" }
    );

    return Messages;
};
