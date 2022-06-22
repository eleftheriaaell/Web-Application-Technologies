module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define("Categories",{
        Category_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PostId: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    return Categories;
}