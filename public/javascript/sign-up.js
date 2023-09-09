const userName = document.querySelector('.user-name');
const userNameEl = document.querySelector('.error-uname');
const password = document.querySelector('.password');
const passwordEl = document.querySelector('.error-password');
const reEnterPass = document.querySelector('.re-enter-password');
const reEnterPassEl = document.querySelector('.error-re-password');
const normalName = document.querySelector('.user-normal-name');
const normalNameEl = document.querySelector('.error-normal-name');
const accountType = document.querySelector('.account-type');
const accountTypeEl = document.querySelector('.error-account-type');
const address = document.querySelector('.address');
const addressEl = document.querySelector('.error-address');
const submit = document.querySelector('#btn-sign-up');
const back = document.querySelector('#btn-back');

import auth from './Module/auth.js';
back.addEventListener('click', () => {
  window.location.href = 'login';
});

console.log(submit);
userName.addEventListener('change', () => {
  if (userName.validity.valid) {
    userName.textContent = '';
    userNameEl.textContent = '';
    userName.classList.remove('invalid');
  } else {
    userNameError();
  }
});

password.addEventListener('change', () => {
  if (password.validity.valid) {
    password.textContent = '';
    passwordEl.textContent = '';
    password.classList.remove('invalid');
  } else {
    passwordError();
  }
});
reEnterPass.addEventListener('change', () => {
  if (reEnterPass.validity.valid) {
    reEnterPass.textContent = '';
    reEnterPassEl.textContent = '';
    reEnterPass.classList.remove('invalid');
  } else {
    reEnterPasswordError();
  }
});

// FORM VALIDATION WHEN USER PRESSES SUBMIT //

submit.addEventListener('click', async (event) => {
  let valid = true;
  if (!userName.validity.valid) {
    event.preventDefault();
    valid = false;
    userNameError();
  }

  if (!password.validity.valid) {
    event.preventDefault();
    valid = false;
    passwordError();
  }
  if (!reEnterPass.validity.valid) {
    event.preventDefault();
    valid = false;
    reEnterPasswordError();
  }
  if (password.value !== reEnterPass.value) {
    event.preventDefault();
    valid = false;
    reEnterPassEl.textContent = 'Passwords do not match';
    reEnterPass.classList.add('invalid');
    reEnterPass.placeholder = '';
  }
  if (!normalName.validity.valid) {
    event.preventDefault();
    valid = false;
    normalNameError();
  }
  if (!address.validity.valid) {
    event.preventDefault();
    valid = false;
    addressError();
  }
  if (!accountType.validity.valid) {
    event.preventDefault();
    valid = false;
    accountTypeError();
  }
  if (valid) {
    const response = await auth.register(
      userName.value,
      password.value,
      normalName.value,
      address.value,
      accountType.value
    );
    console.log(response);
    if (response === 'Username already exists.') {
      userNameEl.textContent = 'Username already exists.';
      userName.classList.add('invalid');
    } else {
      displayConfirmationModal(
        'Account created successfully. Please login.',
        () => {
          window.location.href = '/login';
        }
      );
    }
  }
});

// FORM VALIDATION FORMULAS //

function userNameError() {
  if (userName.validity.valueMissing) {
    userNameEl.textContent = 'User Name cannot be empty';
    userName.classList.add('invalid');
    userName.placeholder = '';
  }
}
function passwordError() {
  if (password.validity.valueMissing || password.validity.tooShort) {
    password.classList.add('invalid');
    password.placeholder = '';
  }

  if (password.validity.valueMissing) {
    passwordEl.textContent = 'Password cannot be empty';
  } else if (password.validity.tooShort) {
    passwordEl.textContent = 'Password should be at least 8 characters';
  }
}
function reEnterPasswordError() {
  if (reEnterPass.validity.valueMissing || reEnterPass.validity.tooShort) {
    reEnterPass.classList.add('invalid');
    reEnterPass.placeholder = '';
  }

  if (reEnterPass.validity.valueMissing) {
    reEnterPassEl.textContent = 'Password cannot be empty';
  } else if (reEnterPass.validity.tooShort) {
    reEnterPassEl.textContent = 'Password should be at least 8 characters';
  }
}
function normalNameError() {
  if (normalName.validity.valueMissing) {
    normalNameEl.textContent = 'Name cannot be empty';
    normalName.classList.add('invalid');
    normalName.placeholder = '';
  }
}
function addressError() {
  if (address.validity.valueMissing) {
    addressEl.textContent = 'Address cannot be empty';
    address.classList.add('invalid');
    address.placeholder = '';
  }
}
address.addEventListener('change', () => {
  if (address.validity.valid) {
    address.textContent = '';
    addressEl.textContent = '';
    address.classList.remove('invalid');
  } else {
    addressError();
  }
});
function accountTypeError() {
  if (accountType.validity.valueMissing) {
    accountTypeEl.textContent = 'Please select an account type';
  }
}
accountType.addEventListener('change', () => {
  if (accountType.validity.valid) {
    accountTypeEl.textContent = '';
  } else {
    accountTypeError();
  }
});
normalName.addEventListener('change', () => {
  if (normalName.validity.valid) {
    normalName.textContent = '';
    normalNameEl.textContent = '';
    normalName.classList.remove('invalid');
  } else {
    normalNameError();
  }
});
