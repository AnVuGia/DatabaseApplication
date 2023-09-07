// import { get } from 'mongoose';
import category from './Module/category.js'; 
const categoryContainer = document.querySelector(".category-list");

addSideBarHtmlForAdmin();

// const openModalButton = document.querySelector(".add-category-button");
// openModalButton.addEventListener("click", () => {
//   backdrop.style.display = "block";
//   modal.style.display = "block";
// });


async function getAllCategory(parentId){
    const body = {
      "search_attribute":"parent",
      "search_string": parentId
    }
    let res = await category.search(body);
    if(res.status == 500){
        displayStatusModal(res.data.message, false);
    }else{  
        console.log(res);
        displayAllCategory(res.data);
    }
}


function displayAllCategory(categories){
    categoryContainer.innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
      categoryContainer.appendChild(createCategoryCard(categories[i]));
      document.querySelector(`#delete-${categories[i]._id}`).addEventListener("click",() => {
          displayConfirmationModal("Are you sure you want to delete this category?", async () => {
            let res = await category.delete(categories[i]);
            processRequest(res, "Category deleted successfully");
           
            // getAllCategory(categories[i].parentId);
          })
        });

    }
    // document.querySelectorAll(".add-category-button").forEach((button) => {
    //     button.addEventListener("click", () => {
    //       backdrop.style.display = "block";
    //       modal.style.display = "block";
    //     });
    // });
    
    // document.querySelectorAll(".forward-button").forEach((button) => {
    //     button.addEventListener("click", () => {
    //       let id = button.id.split("-")[1];
    //       getAllCategory(id);
    //     });
    // });
    // document.querySelectorAll(".backward-button").forEach((button) => {
    //     button.addEventListener("click", () => {
    //       getAllCategory(null);
    //     });
    // });

    categoryContainer.appendChild(createAddSameLevelButton());
}

function createAddSameLevelButton(){
  let card = document.createElement("tr");
    card.innerHTML = `  <td></td>
    <td>
        <button class="add-category-button"><i class="fa-solid fa-plus"></i></button>
    </td>
  `;
  return card
}


function createCategoryCard(category){
  let card = document.createElement("tr");
  card.innerHTML = `
    <td>${category.name}</td>
    <td>
        <button class="add-category-button" id ="add-${category._id}"><i class="fa-solid fa-plus"></i></button>
        <button class="delete-button" id ="delete-${category._id}"><i class="fa-solid fa-trash"></i></button>
        <button class="forward-button" id ="goforward-${category._id}"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="backward-button" id ="gobackward-${category._id}"><i class="fa-solid fa-chevron-right"></i></button>
    </td>
  `;
  return card;
}

getAllCategory(null);

