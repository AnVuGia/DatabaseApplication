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
const form = document.querySelector('.attribute-input-form');


const modalSubmitButton = document.querySelector(
  '.modal__button modal__button--save'
);
import productHelper from './Module/product-helper.js';
import category from './Module/category.js';
// import { create } from '../../models/ProductAttribute.js';
let products = [];
window.onload = async () => {
  addSideBarHtmlForSeller();
  const currentUser = sessionStorage.getItem('user');
  const currentUserJSON = JSON.parse(currentUser);
  const temp = await productHelper.getProductBySeller(currentUserJSON.seller_id);
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
  const product = createProductObject();
        if (product.attributes.length == 0){
          displayStatusModal('Category has not been selected or Required attribute has not been filled!', false);
          return;
        }
        if (product.price.length == 0 || product.product_name.length == 0 || product.width == 0|| product.length == 0|| product.height == 0  ){
          displayStatusModal('Price/Name/Width/Length/Height must be filled!', false);
          return;
        }
  displayConfirmationModal(
    'Are you sure you want to add this product?',
    async () => {
      console.log(product);
        let res = await productHelper.createProduct(product);
        processRequest(res,'Product added successfully')
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


async function getAllCategory(){
  const res = await category.findAll();
  console.log(res.data);
  createSelectCategory(res.data);
}

const select = document.querySelector('#select-cateogry-for-create');
function createSelectCategory(catList){
  select.innerHTML = "";
  const defaultOption = document.createElement('option');
  defaultOption.value = "all";
  defaultOption.innerHTML = "Select Category";
  select.appendChild(defaultOption);
  for (let i = 0; i < catList.length; i++) {
    const option = document.createElement('option');
    option.value = catList[i]._id;
    option.innerHTML = catList[i].name;
    select.appendChild(option);
  }
  return select;
}

select.addEventListener('change', async () => {
  if (select.value == "all"){
    form.innerHTML = "";
    return;
  }
  const body = {
    "search_attribute":"_id",
    "search_string": select.value
  }
  let res = await category.search(body);
  displayInputCategoryForm(res.data[0].attributes);
  
})
function displayInputCategoryForm(list){
    
    form.innerHTML = "";
    for (let i = 0; i < list.length; i++) {
      form.appendChild(createCatInputCard(list[i]));
    }

}
function createCatInputCard(attribute){
  const card = document.createElement('div');
  card.classList.add('attribute-input');
  const label = document.createElement('label');
  label.innerHTML = attribute.name;
  const input = document.createElement('input');
  input.type = 'text';
  input.id = attribute.name;
  input.required = attribute.required;

  const label2 = document.createElement('label');
  label2.innerHTML = attribute.required ? 'Required' : 'Optional';  

  card.appendChild(label);
  card.appendChild(input);
  card.appendChild(label2);
  return card;
}

getAllCategory();
function createProductObject(){
  const product = {
    product_name: document.getElementById('product__name--add').value,
    product_desc: document.getElementById('product__description--add').value,
    image: document.getElementById('product__image--add').value,
    seller_id : JSON.parse(sessionStorage.getItem('user')).seller_id,
    category_id: select.value,
    price: parseFloat (document.getElementById('product__price--add').value),
    width: parseInt(document.getElementById('product__width--add').value),
    height: parseInt(document.getElementById('product__height--add').value),
    length: parseInt(document.getElementById('product__length--add').value),
    attributes: getAttributeValue()
  }
  return product
  
}
function getAttributeValue(){
  const attributes = document.querySelectorAll('.attribute-input');
  const attributeList = [];
  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i].children[1].value == "" && attributes[i].children[1].required){
      
      return [];
    }
    const attribute = {
      name: attributes[i].children[0].innerHTML,
      value: attributes[i].children[1].value
    }
    attributeList.push(attribute);
  }
  return attributeList;
}
