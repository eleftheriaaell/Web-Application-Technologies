module.exports = (sequelize, DataTypes) => {
    const Actions = sequelize.define("Actions",{
        Username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PostId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Visited: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Bidded: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Actions;
}