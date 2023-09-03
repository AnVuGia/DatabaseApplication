const userName = document.querySelector(".user-name");
const userNameEl = document.querySelector(".error-uname");
const password = document.querySelector(".password");
const passwordEl = document.querySelector(".error-password");
const signUp = document.querySelector("#btn-sign-up")
const submit = document.querySelector("#btn-sign-in");

const credential ={
  username: "lazada_auth",
  password: "password"
}
sessionStorage.setItem("sqlUser", JSON.stringify(credential));

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

  const data = {
    user_credential: JSON.parse(sessionStorage.getItem("sqlUser")),
    info: {
      username: userName.value,
      password: password.value
    }
  }
  console.log(JSON.stringify(data));
  let url = "/login"
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data); 
      if (data.msg ===  "Your username or password is invalid.") {
        userNameEl.textContent = data;
        userName.classList.add("invalid");
        userName.placeholder = "";
      } else {
        if (data.role === "admin") {
        window.location.href = "./admin-inventory";
        sessionStorage.setItem("user", JSON.stringify(data.account));
      }else if (data.role === "seller") {
        window.location.href = "./seller-product";
        sessionStorage.setItem("user", JSON.stringify(data.account));
      }else if (data.role === "customer") {
        window.location.href = "./customers";
        sessionStorage.setItem("user", JSON.stringify(data.account));
        }
      }
    }
    ).catch((err) => {
      res.json(err);
    }
    );
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
