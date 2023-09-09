const { Sequelize, DataTypes } = require("sequelize");

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
    ProductWarehouses.associate = function (models) {
        // associations can be defined here
        ProductWarehouses.belongsTo(models.Products, {
          foreignKey: 'product_id',
          onDelete: 'CASCADE',
        });
      };
    return ProductWarehouses;
}