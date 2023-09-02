const socket = io();
getProducts();
socket.on('post item', async (data) => {
  if (data.action === 'create') {
    const product = data.product;
    console.log(product);
    await getProducts();
  }
});
async function getProducts() {
  fetch('/shop/products', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((products) => {
      const productList = document.getElementById('product-list');
      productList.innerHTML = '';
      products.forEach((product) => {
        const tr = document.createElement('tr');
        const td0 = document.createElement('td');
        td0.innerHTML = product.id;
        const td1 = document.createElement('td');
        td1.innerHTML = product.product_name;
        const td2 = document.createElement('td');
        td2.innerHTML = product.product_desc;
        const td3 = document.createElement('td');
        td3.innerHTML = product.price;
        const td4 = document.createElement('td');
        td4.innerHTML = product.quantity;
        const td5 = document.createElement('td');
        td5.innerHTML = product.units_in_stock;
        const td6 = document.createElement('td');
        td6.innerHTML = product.units_on_order;
        tr.appendChild(td0);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        productList.appendChild(tr);
      });
    });
}
