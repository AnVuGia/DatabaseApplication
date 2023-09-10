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
    total_price: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
  });
  return Order;
};
