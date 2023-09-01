
const deleteProductButton = document.querySelector(".delete-button");
const addProductButton = document.querySelector(".button_product--add");
deleteProductButton.addEventListener("click", () => {
    displayConfirmationModal("Are you sure you want to delete this product?", () => {});
});
addProductButton.addEventListener("click", () => {
    displayConfirmationModal("Are you sure you want to add this product?");
});
const openModalButton = document.querySelector(".edit-button");
openModalButton.addEventListener("click", () => {
  backdrop.style.display = "block";
  modal.style.display = "block";
});
selectDetector('manage-product__dropdown','main-product__update','main-product__add')
addSideBarHtmlForSeller();



