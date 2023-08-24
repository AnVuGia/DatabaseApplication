module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Orders', {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Assuming this is an auto-incrementing ID
    },
    customer_id: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    shipper_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
  });
  Order.associate = function (models) {
    // associations can be defined here
  };
  return Order;
};
