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
    const row = orderRow(product, order);
    orderContainer.appendChild(row);
  }
};

function orderRow(product, order) {
  console.log('product');
  console.log(product);
  console.log('order');
  console.log(order);
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `  <div class="cart-item mb-4">
        <div class="row">
          <div class="col-md-3">
            <img src="${
              product.image ||
              'https://down-vn.img.susercontent.com/file/6db97a22ffdf63960cdb0fe349877cc9'
            }" alt="Product" class="img-fluid" />
          </div>
          <div class="col-md-6">
            <h4>${product.product_name}</h4>
            <p>${product.price}</p>
          </div>
          <div class="col-md-3">
            <p>Quantity: ${order.product_quantity}</p>
            <p>Order ID: ${order.order_id}</p>  
            <button class="btn btn-sm btn-danger">Remove</button>
            <button class="btn btn-sm btn-success">Accept</button>
            <button class="btn btn-sm btn-secondary">Decline</button>
          </div>
        </div>
      </div>`;
  const acceptBtn = row.querySelector('.btn-success');
  const declineBtn = row.querySelector('.btn-secondary');
  const removeBtn = row.querySelector('.btn-danger');
  acceptBtn.addEventListener('click', async () => {
    await orderHelper.AcceptOrder({
      order_id: order.order_id,
      product_id: product.product_id,
    });
    window.location.reload();
  });
  declineBtn.addEventListener('click', async () => {
    await orderHelper.DeleteOrder({
      order_id: order.order_id,
      product_id: product.product_id,
    });
    window.location.reload();
  });
  removeBtn.addEventListener('click', () => {
    console.log('remove');
  });
  return row;
}
