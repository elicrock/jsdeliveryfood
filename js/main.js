const cartButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');

cartButton.addEventListener('click', toggleModal);
close.addEventListener('click', toggleModal);

function toggleModal() {
  modal.classList.toggle('is-open');
}

// Day 1

const buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      logInForm = document.querySelector('#logInForm'),
      loginInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name');
      buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('deliveryFood');

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function authorized() {
  
  function logOut() {
    login = null;
    localStorage.removeItem('deliveryFood');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }
  console.log('Авторизован');
  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}
function notAuthorized() {
  console.log('Не авторизован');

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    localStorage.setItem('deliveryFood', login);

    if(!loginInput.value) {
      loginInput.style.borderColor = 'red';
    } else {
      loginInput.style.borderColor = '';
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    }

    
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}
checkAuth();