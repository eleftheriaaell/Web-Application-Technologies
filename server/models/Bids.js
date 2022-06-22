module.exports = (sequelize, DataTypes) => {
    const Bids = sequelize.define("Bids",{
        Bidder: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Rating_Bidder: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Amount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Bids;
}