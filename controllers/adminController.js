const db = require('../models'); // Assuming you have your Sequelize models set up

const username = 'admin123';
const password = 'password123';

// Check if there are any rows in the "Admins" table
db.Admins.findAndCountAll().then((result) => {
  const rowCount = result.count;

  if (rowCount === 0) {
    // Insert a new row if the table is empty
    db.Admins.create({
      username: username,
      password: password,
    })
      .then((admin) => {
        console.log('Admin created:', admin.get());
      })
      .catch((error) => {
        console.error('Error creating admin:', error);
      });
  } else {
    console.log('Admins table is not empty.');
  }
});
