
const sideBarContainer = document.querySelector(".sidebar");
const cofirmationBackdrop = document.querySelector(".confirmation-backdrop");
const confirmationModal = document.querySelector(".confirmation-modal");
const closeModalButton = document.querySelector(".closeModalButton");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
closeModalButton.addEventListener("click", () => {
  backdrop.style.display = "none";
  modal.style.display = "none";
});

function displayConfirmationModal(message, callback) {
    const confirmationMessage = document.querySelector(".confirmation-message");
    confirmationMessage.innerHTML = `<p>${message}</p>`;
    console.log(document.querySelector(".modal__button--save"));
    document.querySelector(".modal__button--yes").addEventListener("click", () => {
        callback();
    });
    cofirmationBackdrop.style.display = "block";
    confirmationModal.style.display = "block";
}

const closeConfirmationButton = document.getElementById("button__cancel-confirmation");
closeConfirmationButton.addEventListener("click", () => {
    cofirmationBackdrop.style.display = "none";
    confirmationModal.style.display = "none";
});

function selectDetector(selectClassName, updateClassName, createClassName){
    const selectProductDisplayMode = document.getElementById(`${selectClassName}`);
    selectProductDisplayMode.addEventListener("change", () => {
    const selectedValue = selectProductDisplayMode.value;
    if (selectedValue === "option1") {
        document.querySelector(`.${updateClassName}`).style.display = "block";
        document.querySelector(`.${createClassName}`).style.display = "none";
    } else if (selectedValue === "option2"){
        document.querySelector(`.${updateClassName}`).style.display = "none";
        document.querySelector(`.${createClassName}`).style.display = "block";
    }
    });
    selectProductDisplayMode.dispatchEvent(new Event("change"));
}

function addSideBarHtmlForAdmin(){
    // <img src="/image/icon/storeal-website-favicon-color.png" alt="icon" width="30px"></img>
    sideBarContainer.innerHTML ="";
    sideBarContainer.innerHTML += `
    <div class="top">
    <div class="logo">
        

        <span> Storeal</span>
    </div>
    <i class="fa-solid fa-bars" id="menu_btn"></i>
</div>

<div class="user">
    <img class="user-img" src="/image/user_avatar.jpeg" alt="user avatar" width="30px">
    <div>
        <p id="username">Iris Young</p>
        <p id="role">Admin</p>
    </div>
</div>

<ul>


    <li>
        <a href="./admin-inventory">
            <i class="fa-solid fa-warehouse"></i>
            <span class="nav-item">Inventory</span>
        </a>
        <span class="tooltip">Inventory</span>
    </li>

   

    <li>
        <a href="./admin-category">
            <i class="fa-solid fa-tags"></i>
            <span class="nav-item">Category</span>
        </a>
        <span class="tooltip">Category</span>
    </li>


    <li>
        <a href="#">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span class="nav-item">Logout</span>
        </a>
        <span class="tooltip">Logout</span>
    </li>
</ul>
    `
    let btn = document.querySelector("#menu_btn");
    let sidebar = document.querySelector(".sidebar");

    btn.onclick = function() {
    sidebar.classList.toggle('active');
}
}
function addSideBarHtmlForSeller(){
    sideBarContainer.innerHTML ="";
    sideBarContainer.innerHTML += `
    <div class="top">
    <div class="logo">
        <img src="/image/icon/storeal-website-favicon-color.png" alt="icon" width="30px">
        <span> Storeal</span>
    </div>
    <i class="fa-solid fa-bars" id="menu_btn"></i>
</div>

<div class="user">
    <img class="user-img" src="/image/user_avatar.jpeg" alt="user avatar" width="30px">
    <div>
        <p id="username">Iris Young</p>
        <p id="role">Admin</p>
    </div>
</div>

<ul>
    <li>
    <a href="./seller-inbound">
        <i class="fa-solid fa-dolly"></i>
        <span class="nav-item">Inbound</span>
    </a>
    <span class="tooltip">Inbound</span>
    </li>

    <li>

        <a href="./seller-product">
            <i class="fa-solid fa-boxes-stacked"></i>
            <span class="nav-item">Product</span>
        </a>
        <span class="tooltip">Product</span>
    </li>
    <li>
        <a href="#">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span class="nav-item">Logout</span>
        </a>
        <span class="tooltip">Logout</span>
    </li>
</ul>
    `
    let btn = document.querySelector("#menu_btn");
let sidebar = document.querySelector(".sidebar");

btn.onclick = function() {
    sidebar.classList.toggle('active');
}
}


function displayLoadingModel(){
    const modal = document.getElementById('loading-modal');
    modal.style.display = 'block';

}
function closeLoadingModel(){
    const modal = document.getElementById('loading-modal');
    modal.style.display = 'none';
}
function displayStatusModal(msg, success){
    const modal = document.querySelector('.modal-status');
    if(success){
        console.log("success");
        document.querySelector(".modal-status-content").classList.add("success");
        document.querySelector(".modal-status-content").classList.remove("error");
        document.querySelector("#close-status-modal-btn").classList.remove("error-btn");
        document.querySelector("#close-status-modal-btn").classList.add("success-btn");
    }else{
        console.log("fail");
        document.querySelector(".modal-status-content").classList.remove("success");
        document.querySelector(".modal-status-content").classList.add("error");
        document.querySelector("#close-status-modal-btn").classList.add("error-btn");
        document.querySelector("#close-status-modal-btn").classList.remove("success-btn");
    }
    document.querySelector(".status-msg").innerHTML = msg;   
    document.querySelector("#close-status-modal-btn").addEventListener("click", () => { 
        window.location.reload();
    });
    modal.style.display = 'block';

}