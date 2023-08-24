module.exports = (sequelize, DataTypes) => {
  // Define the Sellers model
  const Seller = sequelize.define('Sellers', {
    SellerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Assuming this is an auto-incrementing ID
    },
    Address: {
      type: DataTypes.STRING(50),
    },
    City: {
      type: DataTypes.STRING(50),
    },
    Province: {
      type: DataTypes.STRING(50),
    },
    Street: {
      type: DataTypes.STRING(50),
    },
    Number: {
      type: DataTypes.STRING(50),
    },
    TotalVolume: {
      type: DataTypes.DOUBLE,
    },
  });
  // Define the associations for the Sellers model
  Seller.associate = function (models) {};
  return Seller;
};
