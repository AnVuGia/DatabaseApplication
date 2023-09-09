const orderContainer = document.querySelector('.order-container');
import orderHelper from './Module/order-helper.js';

const ordersList = [];
window.onload = async function () {
  const currentUser = sessionStorage.getItem('user');
  const currentUserJSON = JSON.parse(currentUser);
  console.log(currentUserJSON);
  const ordersData = await orderHelper.getOrdersByCustomerId(
    currentUserJSON.customer_id
  );
  console.log(ordersData);
  ordersList.push(...ordersData.orders);
  console.log(ordersList);
  const productList = ordersData.products;
  for (let i = 0; i < ordersList.length; i++) {
    const product = productList[i];
    const order = ordersList[i];
    const row = orderRow(
      product.product_name,
      product.price,
      order.product_quantity,
      product.image
    );
    orderContainer.insertAdjacentHTML('beforeend', row);
  }
};

function orderRow(name, price, quantity, image) {
  return `  <div class="cart-item mb-4">
        <div class="row">
          <div class="col-md-3">
            <img src="${
              image ||
              'https://down-vn.img.susercontent.com/file/6db97a22ffdf63960cdb0fe349877cc9'
            }" alt="Product" class="img-fluid" />
          </div>
          <div class="col-md-6">
            <h4>${name}</h4>
            <p>${price}</p>
          </div>
          <div class="col-md-3">
            <p>Quantity: ${quantity}</p>
            <button class="btn btn-sm btn-danger">Remove</button>
            <button class="btn btn-sm btn-success">Accept</button>
            <button class="btn btn-sm btn-secondary">Decline</button>
          </div>
        </div>
      </div>`;
}
