module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts",{
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Currently: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Buy_Price: {
            type: DataTypes.STRING,
            allowNull: false
        },
        First_Bid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Number_of_Bids: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Started: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Ends: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Seller: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Rating_Seller: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Photo: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
        },
    });

   
    Posts.associate = (models) => {
        Posts.hasMany(models.Bids, {   
            onDelete: "cascade",            
        });
    };

    return Posts;
}