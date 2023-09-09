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
const formEdit = document.querySelector('.attribute-input-form-edit');
const selectEdit = document.querySelector('#select-cateogry-for-update');
const filterSelect = document.querySelector('#filter-product__dropdown');
const searchInput = document.querySelector('.product-input');
let offset = 0;
let page = 5;
let reachMax = false;

const modalSubmitButton = document.querySelector(
  '.modal__button modal__button--save'
);
import productHelper from './Module/product-helper.js';
import attribute from './Module/attribute.js';
import category from './Module/category.js';
// import { create } from '../../models/ProductAttribute.js';
// import { create } from '../../models/ProductAttribute.js';
let products = [];
window.onload = async () => {
  addSideBarHtmlForSeller();
  const currentUser = sessionStorage.getItem('user');
  const currentUserJSON = JSON.parse(currentUser);
};
addProductButton.addEventListener('click', () => {
  const product = createProductObject();
  console.log(product); 
  if (product.attributes.length == 0){
    displayStatusModal('Category has not been selected or Required attribute has not been filled!', false);
    return;
  }
  if ((product.price == 0 || !product.price) || (product.product_name.length == 0) ||( product.width == 0||!product.width)||( product.length == 0||!product.length)|| (product.height == 0||!product.height)  ){
    displayStatusModal('Price/Name/Width/Length/Height must be filled!', false);
    return;
  }
  displayConfirmationModal(
    'Are you sure you want to add this product?',
    async () => {
      console.log(product);
      let res = await productHelper.createProduct(product);
      processRequest(res, 'Product added successfully');
    }
  );
});

async function getAllProduct() {
  const temp = await productHelper.getProductBySeller(
    JSON.parse(sessionStorage.getItem('user')).seller_id
  );
  products = [...temp];
  console.log(temp);
  console.log(tableBody);
  displayProduct(products);
}
function displayProduct(products) {
  tableBody.innerHTML = '';
  for (let i = 0; i < products.length; i++) {
    tableBody.appendChild(createRowCard(products[i]));
    const deleteBtn = document.querySelector(
      `#delete-${products[i].product_id}`
    );
    deleteBtn.addEventListener('click', () => {
      displayConfirmationModal(
        'Are you sure you want to delete this product?',
        async () => {
          let res = await productHelper.deleteProduct(products[i]);
          processRequest(res, 'Product deleted successfully');
        }
      );
    });

    const editBtn = document.querySelector(`#edit-${products[i].product_id}`);
    editBtn.addEventListener('click', () => {
      console.log(products[i]);
      displayEditModal(products[i]);
    });
  }
}
const editButton = document.querySelector('.modal__buttuon--eidtProduct');

function createRowCard(item) {
  const card = document.createElement('tr');
  card.innerHTML = `
                    <td>${item.product_id}</td>
                    <td>${item.product_name}</td>
                    <td>
                    ${item.product_desc}
                    </td>
                    <td>${item.price}</td>
                    <td>${item.width}</td>
                    <td>${item.length}</td>
                    <td>${item.height}</td>
                    <td>
                      <button class="edit-button" id = "edit-${item.product_id}" >
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button class="delete-button" id = "delete-${item.product_id}">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  `;
  return card;
}

selectDetector(
  'manage-product__dropdown',
  'main-product__update',
  'main-product__add'
);

const nameUpdateInput = document.querySelector('#product__name--update');
const descriptionUpdateInput = document.querySelector(
  '#product__description--update'
);
const priceUpdateInput = document.querySelector('#product__price--update');
const imageUpdateInput = document.querySelector('#product__image--update');

async function displayEditModal(item) {
  backdrop.style.display = 'block';
  modal.style.display = 'block';

  nameUpdateInput.value = item.product_name;
  descriptionUpdateInput.value = item.product_desc;
  priceUpdateInput.value = item.price;
  imageUpdateInput.value = item.image;

  const selecteAtributeForUpdate = document.querySelector(
    '#select-cateogry-for-update'
  );
  selecteAtributeForUpdate.innerHTML = '';
  await getAllCategory(selecteAtributeForUpdate);
  selecteAtributeForUpdate.value = item.category_id;

  // console.log(selecteAtributeForUpdate)
  renderSelect(selecteAtributeForUpdate, formEdit);
  // console.log(selecteAtributeForUpdate)

  let data = await attribute.find(item.product_id);
  formEdit.innerHTML = '';
  const attributes = data[0].attributes;

  for (let i = 0; i < attributes.length; i++) {
    formEdit.appendChild(createInputEdit(attributes[i]));
    console.log(formEdit);
  }

  editButton.addEventListener('click', () => {
    const product = createProductForUpdate();
    product.product_id = item.product_id;
    console.log(product);
    if (product.attributes.length == 0) {
      displayStatusModal(
        'Category has not been selected or Required attribute has not been filled!',
        false
      );
      return;
    }
    if (
      product.price.length == 0 ||
      !product.price ||
      product.product_name.length == 0
    ) {
      displayStatusModal('Price/Name must be filled!', false);
      return;
    }
    displayConfirmationModal(
      'Are you sure you want to edit this product?',
      async () => {
        console.log(product);
        let res = await productHelper.updateProduct(product);
        processRequest(res, 'Product updated successfully');
      }
    );
  });
}

async function getAllCategory(selectType) {
  const res = await category.findAll();
  console.log(res.data);
  createSelectCategory(selectType, res.data);
}

const select = document.querySelector('#select-cateogry-for-create');
function createSelectCategory(selectType, catList) {
  selectType.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = 'all';
  defaultOption.innerHTML = 'Select Category';
  selectType.appendChild(defaultOption);
  for (let i = 0; i < catList.length; i++) {
    const option = document.createElement('option');
    option.value = catList[i]._id;
    option.innerHTML = catList[i].name;
    selectType.appendChild(option);
  }
  return selectType;
}

select.addEventListener('change', async () => {
  await renderSelect();
});
selectEdit.addEventListener('change', async () => {
  const clasName = 'attribute-input-edit';
  await renderSelectEdit();
});

async function renderSelect(){
    if (select.value == "all"){
      form.innerHTML = "";
      return;
    }
    const body = {
      "search_string": select.value
    }
    console.log(body);
    let res = await category.getAttributes(body);
    console.log(res.data);
    displayInputCategoryForm(res.data);
   
}
async function renderSelectEdit(){
  if (selectEdit.value == "all"){
    form.innerHTML = "";
    return;
  }
  const body = {
    "search_string": selectEdit.value
  }
  console.log(body);
  let res = await category.getAttributes(body);
  console.log(res.data);
  displayEditForm(res.data);
 
}

function displayInputCategoryForm(list) {
  form.innerHTML = '';
  for (let i = 0; i < list.length; i++) {
    form.appendChild(createCatInputCard(list[i]));
  }
}
function displayEditForm(list) {
  formEdit.innerHTML = '';
  for (let i = 0; i < list.length; i++) {
    formEdit.appendChild(createInputEdit(list[i]));
  }
}
function createCatInputCard(attribute) {
  const card = document.createElement('div');
  card.classList.add('attribute-input');
  const label = document.createElement('label');
  label.innerHTML = attribute.name;
  const input = document.createElement('input');
  input.type = attribute.type;
  input.id = attribute.name;
  input.required = attribute.required;
  

  if (attribute.type == "number"){
    input.type = "number"
    input.min = 0;
  }
  input.value = attribute.type == "text" ? (attribute.value ?attribute.value : "" ) : parseInt(attribute.value)
  const label2 = document.createElement('label');
  label2.innerHTML = attribute.required ? 'Required' : 'Optional';

  card.appendChild(label);
  card.appendChild(input);
  card.appendChild(label2);
  return card;
}
function createInputEdit(attribute) {
  const card = document.createElement('div');
  card.classList.add('attribute-input');
  const label = document.createElement('label');
  label.innerHTML = attribute.name;
  const input = document.createElement('input');
  input.type = attribute.type;
  input.id = attribute.name;
  input.required = attribute.required;
  

  if (attribute.type == "number"){
    input.type = "number"
    input.min = 0;
  }
  input.value = attribute.type == "text" ? (attribute.value ?attribute.value : "" ) : parseInt(attribute.value)
  const label2 = document.createElement('label');
  label2.innerHTML = attribute.required ? 'Required' : 'Optional';

  card.appendChild(label);
  card.appendChild(input);
  card.appendChild(label2);
  return card;
}

function createProductObject() {
  const product = {
    product_name: document.getElementById('product__name--add').value,
    product_desc: document.getElementById('product__description--add').value,
    seller_id : JSON.parse(sessionStorage.getItem('user')).seller_id,
    category_id: select.value,
    width: parseInt(document.getElementById('product__width--add').value),
    length: parseInt(document.getElementById('product__length--add').value),
    height: parseInt(document.getElementById('product__height--add').value),
    price: parseFloat (document.getElementById('product__price--add').value),
    image: document.getElementById('product__image--add').value,
    attributes: getAttributeValue('.attribute-input')
  }
  return product
  
}

function createProductForUpdate() {
  const product = {
    product_name: document.getElementById('product__name--update').value,
    product_desc: document.getElementById('product__description--update').value,
    image: document.getElementById('product__image--update').value,
    seller_id: JSON.parse(sessionStorage.getItem('user')).seller_id,
    category_id: selectEdit.value,
    price: parseFloat(document.getElementById('product__price--update').value),
    attributes: getAttributeValue('.attribute-input-edit'),
  };
  return product;
}
function getAttributeValue(className){
  console.log(className);
  const attributes = document.querySelectorAll('.attribute-input');
  const attributeList = [];
  for (let i = 0; i < attributes.length; i++) {
    if (
      attributes[i].children[1].value == '' &&
      attributes[i].children[1].required
    ) {
      return [];
    }
    const attribute = {
      name: attributes[i].children[0].innerHTML,
      value: attributes[i].children[1].value,
      type: attributes[i].children[1].type,
    }
    attributeList.push(attribute);
  }
  return attributeList;
}
getAllCategory(select);

getAllProduct();

searchInput.addEventListener('input', async () => {
  gatherInformation();
});
filterSelect.addEventListener('change', async () => {
  gatherInformation();
});
async function gatherInformation() {
  const body = {};
  if (searchInput.value.length > 0) {
    body['search'] = {
      search_string: searchInput.value,
    };
  }
  if (filterSelect.value !== 'all') {
    if (filterSelect.value == 'nameasc') {
      body['order'] = ['product_name', 'ASC'];
    } else if (filterSelect.value == 'namedcr') {
      body['order'] = ['product_name', 'DESC'];
    } else if (filterSelect.value == 'priceasc') {
      body['order'] = ['price', 'ASC'];
    } else if (filterSelect.value == 'pricedcr') {
      body['order'] = ['price', 'DESC'];
    }
  }
  console.log(body);
  body['seller_id'] = JSON.parse(sessionStorage.getItem('user')).seller_id;
  let res = await productHelper.filter(body);
  console.log(res.data);
  displayProduct(res.data);
}
