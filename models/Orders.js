module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Orders', {
    OrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Assuming this is an auto-incrementing ID
    },
    CustomerID: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    ShipperID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    WareHouseOrSellerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING(20),
    },
  });
  Order.associate = function (models) {
    // associations can be defined here
  };
  return Order;
};
