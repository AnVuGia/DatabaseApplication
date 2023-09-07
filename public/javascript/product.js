const deleteProductButton = document.querySelector('.delete-button');
const addProductButton = document.querySelector('.button_product--add');
const descriptionEl = document.querySelector('.product__description-input');
const priceEl = document.querySelector('.product__price-input');
const quantityEl = document.querySelector('.product__quantity-input');
const nameEl = document.querySelector('.product__name-input');
const widthEl = document.querySelector('.product__width-input');
const heightEl = document.querySelector('.product__height-input');
const lengthEl = document.querySelector('.product__length-input');
const tableBody = document.querySelector('#tablebody');
 
import product from './Module/product-helper.js';
let products = [];
window.onload = async () => {
  addSideBarHtmlForSeller();
  const temp = await product.getProducts();
  products = [...temp];
  console.log(temp);
  console.log(tableBody);
  products.forEach((product) => {
    tableBody.innerHTML += productRow(product);
  });
};
deleteProductButton.addEventListener('click', () => {
  displayConfirmationModal(
    'Are you sure you want to delete this product?',
    () => {}
  );
});
addProductButton.addEventListener('click', () => {
  displayConfirmationModal(
    'Are you sure you want to add this product?',
    async () => {
      const currentUser = sessionStorage.getItem('user');
      const currentUserJSON = JSON.parse(currentUser);
      console.log(currentUser);
      const product_temp = {
        product_name: nameEl.value,
        product_desc: descriptionEl.value,
        price: priceEl.value,
        seller_id: currentUserJSON.seller_id,
        quantity: quantityEl.value,
        category_id: '1',
        width: widthEl.value,
        height: heightEl.value,
        length: lengthEl.value,
      };
      await product.createProduct(product_temp);
      console.log(product_temp);
    }
  );
});
const openModalButton = document.querySelector('.edit-button');
openModalButton.addEventListener('click', () => {
  backdrop.style.display = 'block';
  modal.style.display = 'block';
});
selectDetector(
  'manage-product__dropdown',
  'main-product__update',
  'main-product__add'
);
const productRow = (product) => {
  return `
    <tr>
        <td>${product.product_id}</td>
        <td>${product.product_name}</td>
        <td>${product.product_desc}</td>
        <td>${product.price}</td>
 
        <td>${product.width}</td>
        <td>${product.height}</td>
        <td>${product.length}</td>
          <td>
        <button class="edit-button">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="delete-button">
          <i class="fa-solid fa-trash"></i>
        </button>
         </td>
    </tr>
    `;
};
