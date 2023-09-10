module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Orders', {
    order_id: {
      type: DataTypes.BIGINT(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Assuming this is an auto-incrementing ID
    },
    customer_id: {
      type: DataTypes.BIGINT(10),
      allowNull: false
    },
    seller_id: {
      type: DataTypes.BIGINT(10),
      allowNull: false,
    },
    product_id: {
      type: DataTypes.BIGINT(10),
      allowNull: false,
    },
    product_quantity: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
  });
  Order.associate = function (models) {
    // associations can be defined here
    Order.belongsTo(models.Customers, {
      foreignKey: 'customer_id',
      onDelete: 'CASCADE',
    });
  };
  return Order;
};
