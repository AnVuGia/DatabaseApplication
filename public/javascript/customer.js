import productModule from './Module/product-helper.js';
import category from './Module/category.js';
// import { INTEGER } from 'sequelize';
var offset = 0;
var limit = 5;
var reachMax = false;
const selectCategory = document.querySelector('#select-category');
const categoryList = document.querySelector('.category-container__list');
const searchInput = document.querySelector('#search-input');
const selectFilter = document.querySelector('#select-filter');
const btnSearch = document.querySelector('#search-button');
const buttonPrice = document.querySelector('.search-price__button');
selectCategory.addEventListener('change', () => {
  gatherInformation();
});
selectFilter.addEventListener('change', () => {
  if (selectFilter.value === 'price') {
    document.querySelector('.filter-block__price').style.display = 'block';
    return;
  }else{
    document.querySelector('.filter-block__price').style.display = 'none';
  }
  offset = 0;
  reachMax = false;
  gatherInformation();
});
buttonPrice.addEventListener('click', () => {
  offset = 0;
  reachMax = false;
  gatherInformation();
});
btnSearch.addEventListener('click', () => {
  offset = 0;
  reachMax = false;
  console.log('search');
  gatherInformation();
});





async function getAllIem(body) {
  displayLoadingModel();
  console.log(body);
  let res = await productModule.searchFilter(body); 
  displayItemList(res.data);
  if (res.data.length < limit){
    reachMax = true;
  }
  closeLoadingModel();
}

function displayItemList(itemList) {
  const container = document.querySelector('.container-list');
  container.innerHTML = '';
  for (let i = 0; i < itemList.length; i++) {
    container.appendChild(createItemCard(itemList[i]));
    const lastItem = container.lastElementChild;
    lastItem.addEventListener('click', () => {
      sessionStorage.setItem('product', JSON.stringify(itemList[i]));
      window.location.href = '/product-detail';
    });
  }
}

function createItemCard(item) {
  const card = document.createElement('div');
  card.className = 'card__item';
  card.innerHTML = `
  <img class="img-item" src="${
    item.image ||
    'https://down-vn.img.susercontent.com/file/6db97a22ffdf63960cdb0fe349877cc9'
  }" alt="" srcset="">
      <div class="card-info__container">
          <div class="card-info__item-name">
              ${item.product_name}
          </div>
          <div class="card-info__price">
              ${item.price}
          </div>
      </div>
      `;
  return card;
}

async function getAllCategory() {
  let res = await category.findAll();
  displayCategorySelect(res.data);
}

function displayCategorySelect(list){
    selectCategory.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.style.width = '175px'
    defaultOption.value = "all";
    defaultOption.innerHTML = "Select Category";

    selectCategory.appendChild(defaultOption);

    for(let i = 0; i < list.length; i++){
        selectCategory.appendChild(createCategoryCard(list[i]));
    }
}

function createCategoryCard(item){
  const option = document.createElement('option');
  option.style.width = '175px'
  option.value = item._id;
  option.innerHTML = item.name;
  return option;
}

const shopCartEl = document.querySelector('.fa-cart-shopping');
shopCartEl.addEventListener('click', () => {
  window.location.href = '/cart-view';
});


function gatherInformation (){
  const body = {
      "search_string": searchInput.value,
      "price": getPriceFilter(),
      "category_id": selectCategory.value === "all" ? "" : selectCategory.value,
      "sort": getSortFilter(),
      "pagination": {
        "offset": offset,
        "limit": limit
      }
    }
    
  getAllIem(body);
}

function getPriceFilter(){
    if (selectFilter.value === "price"){
      console.log((document.querySelector('#max-price')));
      var max = parseInt(document.querySelector('#max-price').value);
      var min = parseInt(document.querySelector('#min-price').value);
      max = max ? max : Number.MAX_SAFE_INTEGER;
      min = min ? min : 0;

      return {
        "max":max ,
        "min": min
      }
    }
    return {
      "max": Number.MAX_SAFE_INTEGER,
      "min": 0
    }
}
function getSortFilter(){
  if (selectFilter.value === "all"){
    return {
      "attribute": "product_id",
      "order": "asc"
    }
  }else if (selectFilter.value === "price"){
    return {
      "attribute": "price",
      "order": "asc"
    }
  }
  return {
    "attribute": selectFilter.value.split('-')[0],
    "order": selectFilter.value.split('-')[1]
  }
}
gatherInformation();
getAllCategory();

document.querySelector('.fa-angle-right').addEventListener('click', () => {
    if(reachMax){
      return;
    }else{
      offset += limit;
      gatherInformation();
    }
});
document.querySelector('.fa-angle-left').addEventListener('click', () => {
  if (offset  > 0){
    offset -= limit;
    reachMax = false;
    gatherInformation();
  }
});
