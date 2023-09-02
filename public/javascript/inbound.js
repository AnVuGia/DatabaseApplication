document.querySelector(".inbound-button-order").addEventListener("click", () => {
    displayConfirmationModal("Are you sure you want to create this order?", () => {});
});

addSideBarHtmlForSeller();