module.exports = (sequelize, DataTypes) => {
  const Customers = sequelize.define('Customers', {
    customer_id: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(15),
      allowNull: false,
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
    phone: {
      type: DataTypes.STRING(20),
    },
  });
  Customers.associate = function (models) {
    // associations can be defined here
  };
  return Customers;
};
// Sync the model with the database (this will create the table if it doesn't exist)
