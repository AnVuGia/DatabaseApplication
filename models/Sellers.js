module.exports = (sequelize, DataTypes) => {
  // Define the Sellers model
  const Seller = sequelize.define('Sellers', {
    seller_id: {
      type: DataTypes.BIGINT(10),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    seller_name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(50),
    },
  });
  return Seller;
};
