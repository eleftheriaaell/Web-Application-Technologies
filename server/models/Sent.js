module.exports = (sequelize, DataTypes) => {
    const Sent = sequelize.define("Sent",{
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
    });

    return Sent;
}