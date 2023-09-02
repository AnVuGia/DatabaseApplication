exports.getHello = (req, res) => {
  res.sendFile('index.html', { root: 'views' });
};
exports.getLogin = (req, res) => {
  res.sendFile('sign-in.html', { root: 'views' });
};
exports.getSignup = (req, res) => {
  res.sendFile('sign-up.html', { root: 'views' });
};
exports.getSellerInbound = (req, res) => {
  res.sendFile('seller-inbound.html', { root: 'views/sellerView' });
};
exports.getSellerProduct = (req, res) => {
  res.sendFile('seller-product.html', { root: 'views/sellerView' });
};
exports.getAdminVentory = (req, res) => {
  res.sendFile('admin-inventory.html', { root: 'views/adminView' });
};
exports.getAdminCategory = (req, res) => {
  res.sendFile('admin-category.html', { root: 'views/adminView' });
};
exports.getCustomers = (req, res) => {
  res.sendFile('customer-view.html', { root: 'views' });
};
exports.getProductDetail = (req, res) => {
  res.sendFile('product-details-view.html', { root: 'views' });
};
