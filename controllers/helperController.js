const Sequelize = require('sequelize');

async function connectDB(credential, model) {
  const sequelize = new Sequelize(
    'lazada_database',
    credential.username,
    credential.password,
    {
      host: '127.0.0.1',
      dialect: 'mysql',
    }
  );
  table = model(sequelize, Sequelize);
  await sequelize
    .sync()
    .then(() => {
      console.log('Synced db.');
    })
    .catch((err) => {
      console.log('Failed to sync db: ' + err.message);
    });
  return table;
}

// Export the connectDB function as a named export
module.exports = { connectDB };
