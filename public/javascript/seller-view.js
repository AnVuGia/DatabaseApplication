const socket = io();
document.getElementById('product-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const product = {
    product_name: document.getElementById('product_name').value,
    product_desc: document.getElementById('product_desc').value,
    price: document.getElementById('price').value,
    quantity: document.getElementById('quantity').value,
    units_in_stock: document.getElementById('units_in_stock').value,
    units_on_order: document.getElementById('units_on_order').value,
  };
  console.log(product);
  socket.emit('post item', product);
  document.getElementById('product-form').reset();
});
