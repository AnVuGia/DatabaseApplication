//This is a test model for the User table
module.exports = (sequelize, DataTypes) => {
  const Warehouses = sequelize.define(
    'Warehouses',
    {
      warehouse_id: {
        type: DataTypes.BIGINT(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, // Assuming this is an auto-incrementing ID
      },
      warehouse_name: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(50),
      },
      volume: {
        type: DataTypes.INTEGER,
      },
      available_volume: {
        type: DataTypes.INTEGER,
      }
    },
  );
  return Warehouses;
};
