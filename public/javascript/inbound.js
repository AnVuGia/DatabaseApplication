import productHelper from './Module/product-helper.js';

document.querySelector(".inbound-button-order").addEventListener("click", () => {
    const input = document.querySelector(".product-inbound-input");
    console.log(input);
        const body ={
            "product_id" : input.id,
            "quantity" : parseInt(input.value)
        }
        if (!body.quantity || body.quantity == 0) {
            displayStatusModal("Please enter a valid quantity",false);
            return;
        }

    displayConfirmationModal("Are you sure you want to create this order?", () => {
        console.log(body);  
        let res =productHelper.createInbound(body);
        processRequest(res, "Order created successfully");
    });

});

addSideBarHtmlForSeller();

const table = document.querySelector(".browsing-table");
const inboundTable = document.querySelector(".inbound-table");
console.log(table);  
async function getAllProduct(){
    const temp = await productHelper.getProductBySeller(JSON.parse(sessionStorage.getItem('user')).seller_id);
    
    const products = [...temp];
    console.log(temp);
    displayProduct(products);
  }
function displayProduct(products){
    
    table.innerHTML = '';
    for (let i = 0; i < products.length; i++) {
        table.appendChild(createRowCard(products[i]));
        const addButton = document.querySelector(`#add-${products[i].product_id}`);
        addButton.addEventListener("click", () => {
            const buttons = document.querySelectorAll(`.add-button`);
            buttons.forEach((button) => {
                button.style.display ='none';
            });
            const inboundItem = createInboundCard(products[i]);
            inboundTable.appendChild(inboundItem);
            const minusButton = document.querySelector(`#minus-${products[i].product_id}`);
            minusButton.addEventListener("click", () => {
                const buttons = document.querySelectorAll(`.add-button`);
                buttons.forEach((button) => {
                    button.style.display ='block';
                });
                inboundItem.remove();
            });
        });
    }
}
function createRowCard(item){
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
                        <button class="add-button" id = "add-${item.product_id}" >
                          <i class="fa-solid fa-plus"></i>
                        </button>
                      </td>
                    </tr>
                    `;
return card
}

function createInboundCard(item){
    let card = document.createElement('tr');
    card.innerHTML = `
    <td>1</td>
        <td>${item.product_name}</td>
        <td>
            <input type="number"  min="0" class ="product-inbound-input" id ="${item.product_id}" style="width:90px;">
        </td>
        <td>
            <button class="minus-button"><i class="fa-solid fa-minus" id ="minus-${item.product_id}"></i></button>
        </td>
        `
    return card;
}
inboundTable.innerHTML = '';    
getAllProduct();