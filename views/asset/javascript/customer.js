
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

// illustrate the page might delete later  
const container = document.querySelector(".container-list")
for (i = 0 ; i < 50;i++){
  container.innerHTML += `
  <div class="card__item">
      <img class="img-item" src="https://down-vn.img.susercontent.com/file/6db97a22ffdf63960cdb0fe349877cc9" alt="" srcset="">
      <div class="card-info__container">
          <div class="card-info__item-name">
              Sim 4G Ốp Điện Thoại Nhựa Dẻo In Logo Thương Hiệu Cho iPhone 11 / 12 / 13 Promax 6 / 7 / 8 Plus / X / XR / Xs Max
          </div>
          <div class="card-info__price">
              đ17.000 - đ35.000
          </div>
          <div class="card-info__location">
              Hà Nội
          </div>
      </div>
  </div>
`
}

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





