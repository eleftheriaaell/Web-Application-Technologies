module.exports = (sequelize, DataTypes) => {
    const Inbox = sequelize.define("Inbox",{
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senderName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        receiverName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Seen: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    return Inbox;
}