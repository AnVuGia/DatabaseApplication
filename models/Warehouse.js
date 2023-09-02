//This is a test model for the User table
module.exports = (sequelize, DataTypes) => {
  const Warehouse = sequelize.define(
    'Warehouse',
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
      total_volume: {
        type: DataTypes.INTEGER,
      }
    },
  );
  Warehouse.associate = function (models) {
    // associations can be defined here
    Warehouse.hasMany(models.ProductWarehouse, {
      foreignKey: 'warehouse_id',
      as: 'productWarehouse',
    });
  };
  return Warehouse;
};
