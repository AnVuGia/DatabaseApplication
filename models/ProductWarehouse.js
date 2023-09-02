module.exports = (sequelize, DataTypes) => {
  const ProductWarehouse = sequelize.define('ProductWarehouse', {
    pwID: {
      type: DataTypes.BIGINT(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Assuming this is an auto-incrementing ID
    },
    product_id: {
      type: DataTypes.BIGINT(10),
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.BIGINT(10),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
  });
  ProductWarehouse.associate = function (models) {
    // associations can be defined here
    ProductWarehouse.belongsTo(models.Products, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
    });
  };
  return ProductWarehouse;
};
