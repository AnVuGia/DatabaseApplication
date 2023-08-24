document.getElementById('product-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const product = {
    ProductID: document.getElementById('ProductID').value,
    ProductName: document.getElementById('ProductName').value,
    ProductDescription: document.getElementById('ProductDescription').value,
    Price: document.getElementById('Price').value,
    Quantity: document.getElementById('Quantity').value,
    UnitsInStock: document.getElementById('UnitsInStock').value,
    UnitsOnOrder: document.getElementById('UnitsOnOrder').value,
  };
  console.log(product);
  socket.emit('post item', product);
  document.getElementById('product-form').reset();
});
