const userName = document.querySelector(".user-name");
const userNameEl = document.querySelector(".error-uname");
const password = document.querySelector(".password");
const passwordEl = document.querySelector(".error-password");
const signUp = document.querySelector("#btn-sign-up")
const submit = document.querySelector("#btn-sign-in");
signUp.addEventListener("click", ()=>{
    window.location.href = "signup"
})

userName.addEventListener("change", () => {
  if (userName.validity.valid) {
    userName.textContent = "";
    userNameEl.textContent ="";
    userName.classList.remove("invalid");
  } else {
    userNameError();
  }
});

password.addEventListener("change", () => {
  if (password.validity.valid) {
    password.textContent = "";
    passwordEl.textContent ="";
    password.classList.remove("invalid");
  } else {
    passwordError();
  }
});

// FORM VALIDATION WHEN USER PRESSES SUBMIT //

submit.addEventListener("click", (event) => {

  if (!userName.validity.valid) {
    event.preventDefault();
    userNameError();
  }

  if (!password.validity.valid) {
    event.preventDefault();
    passwordError();
  }
 
});

// FORM VALIDATION FORMULAS //

function userNameError() {
    if (userName.validity.valueMissing) {
        userNameEl.textContent = "User Name cannot be empty";
        userName.classList.add("invalid");
        userName.placeholder = "";
    }
}
function passwordError() {
  if (password.validity.valueMissing || password.validity.tooShort) {
    password.classList.add("invalid");
    password.placeholder = "";
  }

  if (password.validity.valueMissing) {
    passwordEl.textContent = "Password cannot be empty";
  } else if (password.validity.tooShort) {
    passwordEl.textContent = "Password should be at least 8 characters";
  }
}
