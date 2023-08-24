const socket = io();
socket.on('post item', (product) => {
    console.log(product);
  const productList = document.getElementById('product-list');
  const div = document.createElement('div');
  div.innerHTML = `
     <tr>
          <td>${product.ProductID}</td>
          <td>${product.ProductName}</td>
          <td>${product.ProductDescription}</td>
          <td>${product.Price}</td>
          <td>${product.Quantity}</td>
          <td>${product.UnitsInStock}</td>
          <td>${product.UnitsOnOrder}</td>
        </tr>
    `;
    productList.appendChild(div);
});
