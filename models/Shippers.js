module.exports = (sequelize, DataTypes) => {
  const Shipper = sequelize.define('Shippers', {
    ShipperID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Assuming this is an auto-incrementing ID
    },
    Phone: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
  });
  Shipper.associate = function (models) {
    // associations can be defined here
  };
  return Shipper;
};
