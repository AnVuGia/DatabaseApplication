const productTitle = document.querySelector('.product-details-title');
const productPrice = document.querySelector('.product-details-price');
const productDesc = document.querySelector('.product-details-desc');
const productImage = document.querySelector('.product-img-container');
const productQuantity = document.querySelector('#quantity');
const productWidth = document.querySelector('.product-details-width');
const productHeight = document.querySelector('.product-details-height');
const productLength = document.querySelector('.product-details-length');
const AddToCartButton = document.querySelector('.add-cart');
const BuyNowButton = document.querySelector('.buy-now');
const product = JSON.parse(sessionStorage.getItem('current-item'));

const currentUser = sessionStorage.getItem('user');
const currentUserJSON = JSON.parse(currentUser);
import cartHelp from './Module/cart-helper.js';
window.onload = function () {
  productTitle.innerHTML = `<h1> ${product.product_name} </h1>`;
  productPrice.innerHTML = `<h1> ${product.price}$</h1>`;
  productDesc.innerHTML = `<p> ${product.product_desc} </p>`;
  productImage.innerHTML = `<img src=${
    product.image ||
    'https://down-vn.img.susercontent.com/file/6db97a22ffdf63960cdb0fe349877cc9'
  } alt="product image " class="img-fluid"/>`;
};
AddToCartButton.addEventListener('click', async () => {
  const currentUser = sessionStorage.getItem('user');
  const currentUserJSON = JSON.parse(currentUser);
  const value = parseInt(productQuantity.value);
  console.log(value);
  const cart = {
    customer_id: `${currentUserJSON.customer_id}`,
    product_id: product.product_id,
    quantity: value,
  };

  await cartHelp.addToCart(cart);
  console.log(cart);
  window.location.href = 'cart-view';
});
