import productModule from './Module/product-helper.js';
import category from './Module/category.js';

function insertViewMoreButton(filterType) {
  const container = document.querySelector(`.filter-block__${filterType}`);
  const div = document.querySelector(`.${filterType}-block__addition`);
  const elementCount = div.children.length;
  if (elementCount > 0) {
    const button = document.createElement('div');
    button.textContent = 'VIEW MORE';
    button.classList.add(`button__view-more-${filterType}`, 'view-more-button');
    container.insertAdjacentElement('afterend', button);
    document
      .querySelector(`.button__view-more-${filterType}`)
      .addEventListener('click', function () {
        const additionalContent = document.querySelector(
          `.filter-block__${filterType}`
        );
        additionalContent.classList.toggle('show-content');
        const button = document.querySelector(
          `.button__view-more-${filterType}`
        );
        if (additionalContent.classList.contains('show-content')) {
          button.textContent = 'VIEW LESS';
        } else {
          button.textContent = 'VIEW MORE';
        }
      });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  insertViewMoreButton('category');
  insertViewMoreButton('brand');
  insertViewMoreButton('location');
});

const categoryList = document.querySelector('.category-container__list');
categoryList.addEventListener('click', async () => {
  const firstOrderCatList = document.querySelector(
    '.category_container__first-order'
  );
  firstOrderCatList.style.display = 'block';
  await getFirstOrderCategory();
});
categoryList.addEventListener('mouseleave', () => {
  const containers = document.querySelectorAll(
    '.category_container__first-order'
  );
  for (let i = 0; i < containers.length; i++) {
    containers[i].style.display = 'none';
  }
  const bridges = document.querySelectorAll('.container-bridge-2nd');
  for (let i = 0; i < bridges.length; i++) {
    bridges[i].remove();
  }
});

async function getAllIem() {
  displayLoadingModel();
  let data = await productModule.getProducts();
  closeLoadingModel();
  displayItemList(data);
}

function displayItemList(itemList) {
  const container = document.querySelector('.container-list');
  container.innerHTML = '';
  for (let i = 0; i < itemList.length; i++) {
    container.appendChild(createItemCard(itemList[i]));
    const lastItem = container.lastElementChild;
    lastItem.addEventListener('click', () => {});
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

async function getFirstOrderCategory() {
  let res = await category.findAll();

  const firstOrderContainer = document.querySelector(
    '.category_container__first-order'
  );
  console.log(firstOrderContainer.offsetWidth);
  displayCategoryList(
    firstOrderContainer,
    res.data,
    firstOrderContainer.offsetWidth,
    0
  );
}
function displayCategoryList(container, categories, offsetWidth, id) {
  container.innerHTML = '';

  for (let i = 0; i < categories.length; i++) {
    const element = createCategoryItem(categories[i]);
    container.appendChild(element);
  }
}

function createCategoryItem(category) {
  const card = document.createElement('div');
  card.style.width = '100%';
  card.className = 'category-1st__item category-item d-flex';
  card.innerHTML = `
    <p class="m-auto" style="padding-right: 8px">${category.name}</p>
  `;
  return card;
}

getAllIem();
