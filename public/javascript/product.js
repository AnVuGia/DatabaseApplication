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
const modalSubmitButton = document.querySelector(
  '.modal__button modal__button--save'
);
import product from './Module/product-helper.js';
let products = [];
window.onload = async () => {
  addSideBarHtmlForSeller();
  const currentUser = sessionStorage.getItem('user');
  const currentUserJSON = JSON.parse(currentUser);
  const temp = await product.getProductBySeller(currentUserJSON.seller_id);
  products = [...temp];
  console.log(temp);
  console.log(tableBody);
  products.forEach((product) => {
    tableBody.appendChild(productRow(product));
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
      window.location.reload();
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
  const edit_button = document.createElement('button');
  edit_button.classList.add('edit-button');
  edit_button.innerHTML = '<i class="fa-solid fa-pen"></i>';
  const delete_button = document.createElement('button');
  delete_button.classList.add('delete-button');
  delete_button.innerHTML = '<i class="fa-solid fa-trash"></i>';
  edit_button.addEventListener('click', () => {
    onEditClick(product);
  });
  delete_button.addEventListener('click', () => {
    onDeleteClick(product);
  });
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.appendChild(edit_button);
  td.appendChild(delete_button);
  tr.innerHTML = `
    <td>${product.product_id}</td>
    <td>${product.product_name}</td>
    <td>${product.product_desc}</td>
    <td>${product.price}</td>
    <td>${product.width}</td>
    <td>${product.length}</td>
    <td>${product.height}</td>
    `;
  tr.appendChild(td);
  return tr;
};
const onEditClick = (product) => {
  sessionStorage.setItem('current-product', JSON.stringify(product.product_id));
  const product_find = products.find(
    (item) => item.product_id === product.product_id
  );
  nameEl.value = product_find.product_name;
  descriptionEl.value = product_find.product_desc;
  priceEl.value = product_find.price;
  quantityEl.value = product_find.quantity;
  widthEl.value = product_find.width;
  heightEl.value = product_find.height;
  lengthEl.value = product_find.length;
  backdrop.style.display = 'block';
  modal.style.display = 'block';
};
const onDeleteClick = (product) => {
  displayConfirmationModal(
    'Are you sure you want to delete this product?',
    async () => {
      await product.deleteProduct(product);
      window.location.reload();
    }
  );
};
const onConfirmEditClick = async (product) => {
  const product_find = products.find(
    (item) => item.product_id === product.product_id
  );
  const product_temp = {
    product_id: product_find.product_id,
    product_name: nameEl.value,
    product_desc: descriptionEl.value,
    price: priceEl.value,
    seller_id: product_find.seller_id,
    quantity: quantityEl.value,
    category_id: '1',
    width: widthEl.value,
    height: heightEl.value,
    length: lengthEl.value,
  };
  await product_find.updateProduct(product_temp);
  window.location.reload();
};
modalSubmitButton.addEventListener('click', () => {
  const product_id = sessionStorage.getItem('current-product');
  onConfirmEditClick(product_id);
});
