

window.onload = function () {
};

function orderRow(name, price, quantity, image) {
  return `  <div class="cart-item mb-4">
        <div class="row">
          <div class="col-md-3">
            <img src="${image}" alt="Product" class="img-fluid" />
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
