const deleteInventory = document.querySelector(".delete-button");
const addInventoryButton = document.querySelector(".button_inventory--add");
const inventoryContainer = document.querySelector(".inventory-list");
import warehouse from './Module/warehouse.js';

let offset = 0;
const page = 5
let reachMax = false;

const credential ={
    username: "lazada_admin",
    password: "password"
}
sessionStorage.setItem("sqlUser", JSON.stringify(credential)); 


addInventoryButton.addEventListener("click", () => {
    displayConfirmationModal("Are you sure you want to add this inventory?", async() => {
        closeConfirmationButton.click();
        displayLoadingModel();
        const body = {
            user_credential: JSON.parse(sessionStorage.getItem("sqlUser")),
            query: {
                warehouse_name: document.querySelector("#inventory__name--add").value,
                address: document.querySelector("#inventory__address--add").value,
                volume: document.querySelector("#inventory__volume--add").value
            }
        }
        let res = await warehouse.create(body.user_credential, body.query);
        closeLoadingModel();
        if (res.status == 200) {
            displayStatusModal("Create Successfully", true);
        }else{
            displayStatusModal(res.data.message, false);
        }
    });
});
async function createInventory(){
    console.log("create inventory");
    const body = {
        user_credential: JSON.parse(sessionStorage.getItem("sqlUser")),
        query: {
            warehouse_name: document.querySelector("#inventory__name--add").value,
            address: document.querySelector("#inventory__address--add").value,
            volume: document.querySelector("#inventory__volume--add").value
        }
    }
    fetch("/warehouse/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    .then((res) => res.json())
    .then((res) => {
        if(res.status === "success"){
            displayConfirmationModal("Inventory added successfully!", () => {
                window.location.reload();
            });
        }
    }
    );
}
// const openModalButton = document.querySelector(".edit-button");
// openModalButton.addEventListener("click", () => {
  
// });
addSideBarHtmlForAdmin();
selectDetector('manage-inventory__dropdown','main-inventory__update','main-inventory__add')




async function getAllInventory(){
    const body = {
        user_credential: JSON.parse(sessionStorage.getItem("sqlUser")),
        query: {
            offset: offset,
            limit: page
        }
    }
    console.log(body);
    let res = await warehouse.findAll(body.user_credential, body.query);
    
    if (res.status == 500){
        displayStatusModal(res.data.message, false);
    }else{
        if (res.data.length < page){
            reachMax = true;
        }
        displayAll(res.data);
        await createPagination(false);
    }
}
function displayAll(inventoryList){
    inventoryContainer.innerHTML = "";
    for(let i = 0; i < inventoryList.length; i++){
        inventoryContainer.appendChild(createInventoryCard(inventoryList[i]));
        document.querySelector(`#edit-${inventoryList[i].warehouse_id}`).addEventListener("click", () => {
            prepareEditInventoryModal(inventoryList[i]);
            backdrop.style.display = "block";
            modal.style.display = "block";
        });
        document.querySelector(`#delete-${inventoryList[i].warehouse_id}`).addEventListener("click", () => {
            displayConfirmationModal("Are you sure you want to delete this inventory?", async () => {  
                closeConfirmationButton.click()
                displayLoadingModel();
                const body = {
                    user_credential: JSON.parse(sessionStorage.getItem("sqlUser")),
                    query: inventoryList[i]
                }
                let res = await warehouse.delete(body.user_credential, body.query);
                closeLoadingModel();
                console.log(res);
                if (res.message === "Delete Warehouse successfully!") {
                    displayStatusModal(res.message, true);
                }else{
                    displayStatusModal(res.message, false);
                }
            });
        }
        );

    }
}
function createInventoryCard(inventory){
    let card = document.createElement("tr");
    card.innerHTML = `
        <td>${inventory.warehouse_id}</td>
        <td>${inventory.warehouse_name}</td>
        <td>${inventory.address}</td>
        <td>${inventory.volume}</td>
        <td>${inventory.available_volume}</td>
        <td>
            <button class="edit-button" id="edit-${inventory.warehouse_id}"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-button" id="delete-${inventory.warehouse_id}"><i class="fa-solid fa-trash"></i></button>
        </td>
    `;
    return card;
}
function prepareEditInventoryModal(inventory){
    document.querySelector("#inventory__name--update").value = inventory.warehouse_name;
    document.querySelector("#inventory__address--update").value = inventory.address;  
    document.querySelector("#inventory__volume--update").value = inventory.volume;
    
    document.querySelector("#submit-update-button").onclick = async () => {
        displayLoadingModel();
        inventory.warehouse_name = document.querySelector("#inventory__name--update").value;
        inventory.address = document.querySelector("#inventory__address--update").value;
        inventory.volume = document.querySelector("#inventory__volume--update").value;
        const body = {
            user_credential: JSON.parse(sessionStorage.getItem("sqlUser")),
            query: inventory
        }
        let res = await warehouse.update(body.user_credential, body.query);
        closeLoadingModel();
        if (res.status = 200){
            displayStatusModal("Update Successfully", true);
        }else{
            displayStatusModal(res.data.message, false);
        }
    };
}

const searchBySelector = document.querySelector(".attribute-filter-select");
const searchInput = document.querySelector(".inventory-search-input");
const sortSelector = document.querySelector(".sort-selector")
searchBySelector.addEventListener("change", ()=>{gatherInformation(false)});
searchInput.addEventListener("input",  ()=>{gatherInformation(false)});
sortSelector.addEventListener("change",  ()=>{gatherInformation(false)});

function gatherInformation(isPaginating){
    const search  ={}
    let isSearching = false;

    if (!(searchBySelector.value === "all")){
        isSearching = true;
        search["search"] = {}
        if(searchBySelector.value === "name"){
            search["search"]["search_attribute"] = "warehouse_name";
        }else if (searchBySelector.value === "address"){
            search["search"]["search_attribute"] = "address";
        }
        search["search"]["search_string"] = searchInput.value;
    }
    if(!(sortSelector.value === "all")){
        isSearching = true;
        if(sortSelector.value === "asc"){
            search["order"] = ["volume", "ASC"];
        }else if(sortSelector.value === "desc"){
            search["order"] = ["volume", "DESC"];
        }
    }
    if (isSearching){
        search["offset"] = isPaginating ? offset :0;
        search["limit"] = page;
    }
   
    searchInventory(search);
}

async function searchInventory(searchContent){
    if (searchContent === {}){
        await getAllInventory();
        return;
    }
    console.log(searchContent);
    const body = {
        user_credential: JSON.parse(sessionStorage.getItem("sqlUser")),
        query: searchContent
    }
    console.log(body);
    let res = await warehouse.search(body.user_credential, body.query);
    if (res.status == 500){
        displayStatusModal(res.data.message, false);
    }else{
        if (res.data.length < page){    
            reachMax = true;
        }
        console.log(res.data);
        displayAll(res.data);
        await createPagination(true);
    }
}

async function createPagination(isSearching){
    document.querySelector(".pagination").innerHTML = "";
    document.querySelector(".pagination").innerHTML += `
    <div><i class="fa-solid fa-angle-left"></i></div>
    <div><i class="fa-solid fa-angle-right"></i></div>
    `
    document.querySelector(".fa-angle-left").addEventListener("click", (event) => {
        if (offset > 0){
            offset = offset - page;
            reachMax = false;
            if (isSearching){
                gatherInformation(true);
            }else{
                getAllInventory();
            }
        }else{
            event.preventDefault();
        }

    })
    document.querySelector(".fa-angle-right").addEventListener("click", async (event) => {
        console.log(offset);
        if (!reachMax){
            offset += page;
            if (isSearching){
                gatherInformation(true);
            }else{
                await getAllInventory();
            }
        }else{
            event.preventDefault();
        }
    })
}
getAllInventory();