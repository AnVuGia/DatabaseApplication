const deleteProductButton = document.querySelector('.delete-button');
const addProductButton = document.querySelector('.button_product--add');
const descriptionEl = document.querySelector('.product__description-input');
const priceEl = document.querySelector('.product__price-input');
const quantityEl = document.querySelector('.product__quantity-input');
const nameEl = document.querySelector('.product__name-input');
const widthEl = document.querySelector('.product__width-input');
const heightEl = document.querySelector('.product__height-input');
const lengthEl = document.querySelector('.product__length-input');

deleteProductButton.addEventListener('click', () => {
  displayConfirmationModal(
    'Are you sure you want to delete this product?',
    () => {}
  );
});
addProductButton.addEventListener('click', () => {
  displayConfirmationModal('Are you sure you want to add this product?');
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
addSideBarHtmlForSeller();
