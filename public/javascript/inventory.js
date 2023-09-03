const deleteInventory = document.querySelector(".delete-button");
const addInventoryButton = document.querySelector(".button_inventory--add");
const inventoryContainer = document.querySelector(".inventory-list");
import warehouse from './Module/warehouse.js';

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

let offSet = 0;
let limit = 5;


function getAllInventory(){
    const body = {
        user_credential: JSON.parse(sessionStorage.getItem("sqlUser")),
        query: {
            offset: offSet,
            limit: limit
        }
    }
    fetch("/warehouse/findAll", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    .then((res) => res.json())
    .then((res) => {
        console.log(res);
        displayAll(res);
    }
    );
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
        console.log(inventoryContainer);
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
    
    document.querySelector("#submit-update-button").onclick = () => {
        inventory.warehouse_name = document.querySelector("#inventory__name--update").value;
        inventory.address = document.querySelector("#inventory__address--update").value;
        inventory.volume = document.querySelector("#inventory__volume--update").value;
        const body = {
            user_credential: JSON.parse(sessionStorage.getItem("sqlUser")),
            query: inventory
        }
        fetch("/warehouse/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then((res) => res.json())
        .then((res) => {
            if(res.status === "success"){
                displayConfirmationModal("Inventory updated successfully!", () => {
                    window.location.reload();
                });
            }
        }
        );
    };
}

getAllInventory();