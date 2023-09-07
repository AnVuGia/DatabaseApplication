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
      console.log("display all category: ",res.data);
        displayAllCategory(res.data);
    }
}



function displayAllCategory(categories, isSearch = false){
    categoryContainer.innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
      categoryContainer.appendChild(createCategoryCard(categories[i]));
      document.querySelector(`#delete-${categories[i]._id}`).addEventListener("click",() => {
          displayConfirmationModal("Are you sure you want to delete this category?", async () => {
            let res = await category.delete(categories[i]);
            processRequest(res, "Category deleted successfully");
          })
      });
      document.querySelector(`#forward-${categories[i]._id}`).addEventListener("click", async () =>{   
          displayLoadingModel();
          const body = {
            "search_attribute":"parent",
            "search_string": categories[i]._id
          }
          let res = await category.search(body);
          closeLoadingModel();
          if (res.data.length > 0){
            getAllCategory(categories[i]._id); 
          }
      });
      document.querySelector(`#backward-${categories[i]._id}`).addEventListener("click" ,async () =>{ 
          if (categories[i].parent != null){
            displayLoadingModel();
            const body = {
              "search_attribute":"_id",
              "search_string": categories[i].parent
            }
            let res = await category.search(body);
            await getAllCategory(res.data[0].parent);
            closeLoadingModel();
          }
      });
          document.querySelector(`#add-${categories[i]._id}`).addEventListener("click",() =>{ 
            backdrop.style.display = "block";
            modal.style.display = "block";
            prepareAddCategoryForm(categories[i]._id);
      });
      document.querySelector(`#edit-${categories[i]._id}`).addEventListener("click",async () =>{
        backdrop.style.display = "block";
        modal.style.display = "block";
        displayLoadingModel();
        await prepareUpdateCategoryForm(categories[i]._id);
        closeLoadingModel();
      });
    }
    if (isSearch){
      return;
    }
    categoryContainer.appendChild(createAddSameLevelButton());
    document.querySelector(".add-category-same-level").addEventListener("click",() =>{
        backdrop.style.display = "block";
        modal.style.display = "block";
        prepareAddCategoryForm(categories[0].parent);
    }
    );
}

function createAddSameLevelButton(){
  let card = document.createElement("tr");
    card.innerHTML = `  <td></td>
    <td>
        <button class="add-category-same-level"><i class="fa-solid fa-plus"></i></button>
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
        <button class="edit-button" id="edit-${category._id}"><i class="fa-solid fa-pen"></i></button>
        <button class="forward-button" id ="backward-${category._id}"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="backward-button" id ="forward-${category._id}"><i class="fa-solid fa-chevron-right"></i></button>
    </td>
  `;
  return card;
}

function prepareAddCategoryForm(parentId){
    let form = document.querySelector(".attribute-section");
    form.innerHTML = "";  
    
    //reset the category name input
    document.querySelector("#category-name-form-input").value = "";

    //create Heading
    const heading = document.createElement("h3")
    heading.innerHTML = "Attributes";
    form.appendChild(heading);

    //create attribute input
    inFiniteCreate(heading,null);

    //process if they click on add category button
    document.querySelector("#category-input-save-button").addEventListener("click", async () => {
        const nameValue = document.querySelector("#category-name-form-input").value.trim();

        if (nameValue.length > 0){
          let categoryObject = CreateCategoryObject(parentId,nameValue) 
          let res = await category.create(categoryObject,nameValue);
          processRequest(res, "Category created successfully");
        } 
       
    });

}

function inFiniteCreate(lastElement, attributeName){
  //create attribute input  
  const divTobeAdded = createAttributeElemnt();
  lastElement.parentNode.insertBefore(divTobeAdded, lastElement.nextSibling);
  const button = divTobeAdded.querySelector("button");

  if (attributeName != null){
    divTobeAdded.querySelector("input").value = attributeName;
  }

  button.addEventListener("click", () => {
    inFiniteCreate(divTobeAdded,null);}
  );   
}

function createAttributeElemnt (){
    let attribute = document.createElement("div");
    attribute.innerHTML = `
    <div style = "margin: 15px 0px;>
    <label for="">Attribute Name</label>
    <input class = "category-input"  type="text">
    <button class="add-category-input-button" id ="add-category-input"><i class="fa-solid fa-plus"></i></button>
    </div>
    `;
    return attribute; 
}

function CreateCategoryObject(parentId, name){
  const category = {
    "name": name,
    "parent": parentId,
    "attributes": []
  }
  const input = document.querySelectorAll(".category-input");
  for (let i = 0; i < input.length; i++) {
    const attributeName = input[i].value.trim()
    if( attributeName.length > 0){
      category.attributes.push({"name": input[i].value});
    }
  }
  return category;
}


async function prepareUpdateCategoryForm(id){
  const body = {
    "search_attribute":"_id",
    "search_string": id
  }
 
  let res = await category.search(body);
  let categoryObject = res.data[0];

  const cateName = document.querySelector("#category-name-form-input");
  cateName.value = categoryObject.name;


  let form = document.querySelector(".attribute-section");
  form.innerHTML = "";

   //create Heading
   const name = document.createElement("h3")
   name.innerHTML = "Attributes";
   form.appendChild(name);

    //create attribute input
    for (let i = 0; i < categoryObject.attributes.length; i++) {
      inFiniteCreate(name,categoryObject.attributes[i].name);
    }
    if (categoryObject.attributes.length == 0){
      inFiniteCreate(name,null);
    }
    //process if they click on add category button
    document.querySelector("#category-input-save-button").addEventListener("click", async () => {
      const nameValue = document.querySelector("#category-name-form-input").value.trim();

      if (nameValue.length > 0){
        let categoryObject = CreateCategoryObject(category.parent,nameValue) 
        categoryObject["_id"] = id;
        console.log(categoryObject);
        let res = await category.update(categoryObject);
        processRequest(res, "Category updated successfully");
      }
    });

}
const searchNameInput = document.querySelector(".category-searcg-input")
searchNameInput.addEventListener("input", async () => { 
  if (searchNameInput.value.length == 0){
    getAllCategory(null);
    return;
  }
  const body = {
    "name": searchNameInput.value.trim()
  }
  let res = await category.searchByName(body);
  displayAllCategory(res.data, true);

});
getAllCategory(null);

