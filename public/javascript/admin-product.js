import pWarehouseHelper from "./Module/pWarehouse.js";
addSideBarHtmlForAdmin();
let table = document.querySelector(".pwhouse-list");
let offset = 0;

async function getAll(){
    const body = {
        "offset" : offset
    }
    let data = await pWarehouseHelper.findAll(body);
    console.log(data);
    displayAll(data);
}

function displayAll(data){
    table.innerHTML = "";
    for(let i = 0; i < data.length; i++){
        const row = createRow(data[i]);
        table.appendChild(row);

        const button = row.querySelector("button");
        button.addEventListener("click", async () => {
            console.log("clicked");
            const moveQuantity = parseInt(row.querySelector(".first-input").value);
            const destination =  parseInt(row.querySelector(".second-input").value);
            console.log(moveQuantity);
            console.log(typeof(moveQuantity));
            if ((!moveQuantity || moveQuantity == 0) || (!destination || destination == 0)){
                displayStatusModal("Please enter a valid quantity",false);
                return;
            }
            const body = {
                "wid_start" : parseInt(row.querySelector("[name='wid']").innerHTML),
                "productID" : parseInt(row.querySelector("[name='product']").id),
                "quantity" : moveQuantity,
                "wid_dest": parseInt(destination),
            }
            let res = await pWarehouseHelper.moveProduct(body);
            console.log(res);   
            processRequest(res);
        });    
    }
}

function createRow(item){
    const row = document.createElement('tr');
    row.innerHTML = `
        <td name="wid">${item.warehouse_id}</td>
        <td name="wname">${item.warehouse_name}</td>
        <td name="wname">${item.available_volume == 0 ? "Empty" : item.available_volume} </td>
        <td name="product" id ="${item.product_id}" >${item.product_name}</td>
        <td name="pQuantity">${item.product_quantity}</td>
        <td name="td_availability"><input class = "first-input" type="number" min="0" step="1" ></td>
        <td name="td_availability"><input class = "second-input" type="number" min="0" step="1" ></td>
        <td>
            <button class="edit-button">Submit</i></button>
        
        </td>
    `;
    return row;
}

getAll();