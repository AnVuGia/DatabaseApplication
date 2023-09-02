const userName = document.querySelector('.user-name');
const userNameEl = document.querySelector('.error-uname');
const password = document.querySelector('.password');
const passwordEl = document.querySelector('.error-password');
const reEnterPass = document.querySelector('.re-enter-password');
const reEnterPassEl = document.querySelector('.error-re-password');
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
  if (!userName.validity.valid) {
    event.preventDefault();
    userNameError();
  }

  if (!password.validity.valid) {
    event.preventDefault();
    passwordError();
  }
  if (!reEnterPass.validity.valid) {
    event.preventDefault();
    reEnterPasswordError();
  }
  if (password.value !== reEnterPass.value) {
    event.preventDefault();
    reEnterPassEl.textContent = 'Passwords do not match';
    reEnterPass.classList.add('invalid');
    reEnterPass.placeholder = '';
  }
  await auth.register(userName.value, password.value, 'name', 'address');
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
