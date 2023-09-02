const deleteInventory = document.querySelector(".delete-button");
const addInventoryButton = document.querySelector(".button_inventory--add");
const credential ={
    username: "lazada_auth",
    password: "password"
}
sessionStorage.setItem("sqlUser", JSON.stringify(credential));

deleteInventory.addEventListener("click", () => {
    displayConfirmationModal("Are you sure you want to delete this inventory?", () => {});
});
addInventoryButton.addEventListener("click", () => {
    displayConfirmationModal("Are you sure you want to add this inventory?");
});
const openModalButton = document.querySelector(".edit-button");
openModalButton.addEventListener("click", () => {
  backdrop.style.display = "block";
  modal.style.display = "block";
});
addSideBarHtmlForAdmin();
selectDetector('manage-inventory__dropdown','main-inventory__update','main-inventory__add')