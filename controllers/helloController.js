exports.getHello = (req, res) => {
  res.sendFile('hello.html', { root: 'views' });
};
exports.getSeller = (req, res) => {
  res.sendFile('seller-view.html', { root: 'views' });
};
exports.getCustomers = (req, res) => {
  res.sendFile('customer.html', { root: 'views' });
};
