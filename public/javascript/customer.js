import productModule from "./Module/product-helper.js"

function insertViewMoreButton (filterType){
    const container = document.querySelector(`.filter-block__${filterType}`)
    const div = document.querySelector(`.${filterType}-block__addition`)
    const elementCount = div.children.length 
    if (elementCount >0){
        const button = document.createElement('div')
        button.textContent = "VIEW MORE"
        button.classList.add(`button__view-more-${filterType}`,'view-more-button') 
        container.insertAdjacentElement( 'afterend',button)
        document.querySelector(`.button__view-more-${filterType}`).addEventListener('click', function() {
            const additionalContent = document.querySelector(`.filter-block__${filterType}`)
            additionalContent.classList.toggle('show-content');
            const button = document.querySelector(`.button__view-more-${filterType}`);
            if (additionalContent.classList.contains('show-content')) {
                button.textContent = 'VIEW LESS';
              } else {
                button.textContent = 'VIEW MORE';
              }
        })
    }
   
}

document.addEventListener('DOMContentLoaded', function() {
   insertViewMoreButton('category')
   insertViewMoreButton('brand')
   insertViewMoreButton('location')
});


const categoryList = document.querySelector(".category-container__list")
  categoryList.addEventListener("mouseenter",()=>{
    const firstOrderCatList = document.querySelector(".category_container__first-order")
    firstOrderCatList.style.display = 'block'

    
    const bridge =  document.createElement("div")
    bridge.className = "container-bridge-2nd"
    firstOrderCatList.insertAdjacentElement( 'afterend',bridge)
    bridge.style.left =  `${document.querySelector(".category_container__first-order").offsetWidth+56}px`;
    bridge.style.height =  `${document.querySelector(".category_container__first-order").offsetHeight}px`;
    document.querySelector(".category_container__second-order").style.left = `${document.querySelector(".category_container__first-order").offsetWidth+60}px`
    document.querySelector(".category_container__second-order").style.height = `${document.querySelector(".category_container__first-order").offsetWidth+60}px`
    const lists = document.querySelectorAll(".category-1st__item");

    for (let i = 0; i < lists.length;i++){
      
      lists[i].addEventListener("mouseenter",function(){
        console.log("display")
        document.querySelector(".category_container__second-order").style.display = "block"
      })
      categoryList.addEventListener("mouseleave",()=>{
        document.querySelector(".category_container__second-order").style.display = 'none'
        bridge.remove()
    })
  }
  })
  categoryList.addEventListener("mouseleave",()=>{
    document.querySelector(".category_container__first-order").style.display = 'none'
})


async function getAllIem (){
    displayLoadingModel()
    let data = await productModule.getProducts()
    closeLoadingModel()
    displayItemList(data)
}



function displayItemList (itemList){

  const container = document.querySelector(".container-list")
  container.innerHTML = ""
  for (let i = 0 ; i < itemList.length;i++){
    container.appendChild(createItemCard(itemList[i]))
    lastItem = container.lastElementChild
    lastItem.addEventListener("click",()=>{
    })
  }
}


function createItemCard (item){
  const card  = document.createElement("div")
  card.className = "card__item"
  card.innerHTML = `
  <img class="img-item" src="${item.image}" alt="" srcset="">
      <div class="card-info__container">
          <div class="card-info__item-name">
              ${item.product_name}
          </div>
          <div class="card-info__price">
              ${item.price}
          </div>
      </div>
      `
  return card
}

getAllIem()






