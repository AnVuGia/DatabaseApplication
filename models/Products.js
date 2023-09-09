const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    product_id: {
      type: DataTypes.BIGINT(10),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    product_desc: {
      type: DataTypes.STRING(300),
    },
    seller_id: {
      type: DataTypes.BIGINT(10),
      allowNull: false,
    },
    category_id: {
      type: DataTypes.STRING(24),
      allowNull: false,
    }, 
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(250),
    },
    unit_in_stock: {
      type: DataTypes.INTEGER,
    },
    unit_on_order: {
      type: DataTypes.INTEGER,
    }
  });
  Products.associate = function (models) {
    // associations can be defined here
    Products.belongsTo(models.Sellers, {
      foreignKey: 'seller_id',
      onDelete: 'CASCADE',
    });
    Products.hasMany(models.Orders, {
      foreignKey: 'product_id',
      as: 'orders',
    });
    Products.hasMany(models.ProductWarehouses, {
      foreignKey: 'product_id',
      as: 'productWarehouse',
    });
    
  };
  return Products;
};
