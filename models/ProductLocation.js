const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const ProductLocation = sequelize.define("product_location", {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        warehouse_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_quantity: {
            type: DataTypes.INTEGER,
        },
    }, 
    {
        timestamps: false
    });

    return ProductLocation;
}