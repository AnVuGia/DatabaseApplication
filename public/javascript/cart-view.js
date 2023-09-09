// Sample cart data (replace with actual data or load dynamically)
import cartHelper from './Module/cart-helper.js';
import customer from './Module/cart-helper.js';
const cartItems = [];
const currentUser = sessionStorage.getItem('user');
const currentUserJSON = JSON.parse(currentUser);
console.log(currentUserJSON);
window.onload = async function () {
  await customer
    .getCartProducts(currentUserJSON.customer_id.toString())
    .then((data) => {
      console.log(data);
      data.forEach((item) => {
        cartItems.push(item);
      });
    });
  console.log(cartItems);
  displayCart();
};

// Function to display cart items
function displayCart() {
  const cartContainer = document.querySelector('.cart-container');
  cartContainer.innerHTML = ''; // Clear previous content

  cartItems.forEach((item) => {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');
    cartItemDiv.innerHTML = `
                    <div class="row">
                        <div class="col-md-3">
                            <img src="${
                              item.img ||
                              'https://down-vn.img.susercontent.com/file/6db97a22ffdf63960cdb0fe349877cc9'
                            }" alt="${item.name}" class="img-fluid">
                        </div>
                        <div class="col-md-6">
                            <h4>${item.product_name}</h4>
                            <p>Price: $${item.price}</p>
                        </div>
                        <div class="col-md-3">
                            <p>Quantity: ${item.quantity}</p>
                            <button class="btn btn-sm btn-danger remove" onclick="removeFromCart(${
                              item.id
                            })">Remove</button>
                        </div>
                    </div>
                `;
    cartItemDiv.querySelector('.remove').addEventListener('click', () => {
      cartHelper.removeFromCart({
        customer_id: currentUserJSON.customer_id.toString(),
        product_id: item.product_id,
      });
      window.location.reload();
    });
    cartContainer.appendChild(cartItemDiv);
  });
}
