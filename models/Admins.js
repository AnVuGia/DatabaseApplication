module.exports = (sequelize, DataTypes) => {
const Admins = sequelize.define('Admins', {
    admin_id: {
    type: DataTypes.BIGINT(10),
    autoIncrement: true,
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
    }
});
return Admins;
};
