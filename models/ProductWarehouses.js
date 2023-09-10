const { Sequelize, DataTypes } = require("sequelize");
const models = require('.');
module.exports = (sequelize, Sequelize) => {
    const ProductWarehouses = sequelize.define("ProductWarehouses", {
        product_id: {
            type: DataTypes.BIGINT(10),
            allowNull: false,
        },
        warehouse_id: {
            type: DataTypes.BIGINT(10),
            allowNull: false,
        },
        product_quantity: {
            type: DataTypes.INTEGER,
        },
    }, 
    {
        timestamps: false
    });
    return ProductWarehouses;
}