addSideBarHtmlForAdmin();

const openModalButton = document.querySelector(".add-category-button");
openModalButton.addEventListener("click", () => {
  backdrop.style.display = "block";
  modal.style.display = "block";
});