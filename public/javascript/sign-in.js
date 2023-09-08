const userName = document.querySelector('.user-name');
const userNameEl = document.querySelector('.error-uname');
const password = document.querySelector('.password');
const passwordEl = document.querySelector('.error-password');
const signUp = document.querySelector('#btn-sign-up');
const submit = document.querySelector('#btn-sign-in');
import {
  getSessionCookie,
  getCookieValue,
  parseJSONCookie,
} from './Module/cookieUtils.js';
import auth from './Module/auth.js';
const credential = {
  username: 'lazada_auth',
  password: 'password',
};
sessionStorage.setItem('sqlUser', JSON.stringify(credential));

signUp.addEventListener('click', () => {
  window.location.href = 'signup';
});

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
  const data = {
    info: {
      username: userName.value,
      password: password.value,
    },
  };
  const responseData = await auth.login(data.info.username, data.info.password);
  console.log(responseData);
  if (responseData === 'User does not exist.') {
    userNameEl.textContent = 'User does not exist.';
    userName.classList.add('invalid');
  } else if (responseData === 'Incorrect password.') {
    passwordEl.textContent = 'Incorrect password.';
    password.classList.add('invalid');
  } else {
    displayStatusModal('Login successful', true);
    if (responseData.role === 'admins') {
      window.location.href = './admin-inventory';
      sessionStorage.setItem('user', JSON.stringify(responseData.account));
    } else if (responseData.role === 'sellers') {
      window.location.href = './seller-product';
      sessionStorage.setItem('user', JSON.stringify(responseData.account));
    } else if (responseData.role === 'customers') {
      window.location.href = './customers';
      sessionStorage.setItem('user', JSON.stringify(responseData.account));
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
