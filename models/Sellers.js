module.exports = (sequelize, DataTypes) => {
  // Define the Sellers model
  const Seller = sequelize.define('Sellers', {
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Assuming this is an auto-incrementing ID
    },
    address: {
      type: DataTypes.STRING(50),
    },
    city: {
      type: DataTypes.STRING(50),
    },
    province: {
      type: DataTypes.STRING(50),
    },
    street: {
      type: DataTypes.STRING(50),
    },
    number: {
      type: DataTypes.STRING(50),
    },
    total_value: {
      type: DataTypes.DOUBLE,
    },
  });
  // Define the associations for the Sellers model
  Seller.associate = function (models) {};
  return Seller;
};
