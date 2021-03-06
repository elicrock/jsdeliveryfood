'use strict';

const cartButton = document.getElementById('cart-button'),
      modal = document.querySelector('.modal'),
      closeBtn = document.querySelector('.close'),
      buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      logInForm = document.getElementById('logInForm'),
      loginInput = document.getElementById('login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out'),
      cardsRestaurants = document.querySelector('.cards-restaurants'),
      containerPromo = document.querySelector('.container-promo'),
      restaurants = document.querySelector('.restaurants'),
      menu = document.querySelector('.menu'),
      logo = document.querySelector('.logo'),
      cardsMenu = document.querySelector('.cards-menu'),
      restaurantTitle = document.querySelector('.restaurant-title'),
      rating = document.querySelector('.rating'),
      minPrice = document.querySelector('.price'),
      category = document.querySelector('.category'),
      inputSearch = document.querySelector('.input-search'),
      modalBody = document.querySelector('.modal-body'),
      modalPrice = document.querySelector('.modal-pricetag'),
      clearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('deliveryFood');

const cart = [];

const loadCart = () => {
  if (localStorage.getItem(login)) {
    cart.push(...JSON.parse(localStorage.getItem(login)));
  }
};

const saveCart = () => {
  localStorage.setItem(login, JSON.stringify(cart));
};

const getData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
  }
  return await response.json();
};

getData('./db/partners.json');

const valid = (str) => {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};

const toggleModal = () => {
  modal.classList.toggle('is-open');
};

const toggleModalAuth = () => {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle('is-open');
};

const returnMain = () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
};

const authorized = () => {
  
  const logOut = () => {
    login = null;
    cart.length = 0;
    localStorage.removeItem('deliveryFood');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  };
  // console.log('Авторизован');
  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
  loadCart();
};

const notAuthorized = () => {
  // console.log('Не авторизован');

  const logIn = (event) => {
    event.preventDefault();

    if (valid(loginInput.value.trim())) {
      login = loginInput.value;
      localStorage.setItem('deliveryFood', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = 'red';
      loginInput.value = '';
    }
  };

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
};

const checkAuth = () => login ? authorized() : notAuthorized();

// cards
const createCardRestaurant = ({ image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery }) => {

  const card = document.createElement('a');
  card.className = 'card card-restaurant';
  card.products = products;
  card.infoCard = [name, price, stars, kitchen];

  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="${name}" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price.toLocaleString('ru')} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  `);

  cardsRestaurants.insertAdjacentElement('beforeend', card);

};

// Big first letter in words
const capitalize = (str) => {
  return str.replace(/(^|\s)\S/g, function(a) {return a.toUpperCase();});
};

// create goods
const createCardGood = ({ id, name, description, price, image }) => {
  const card = document.createElement('div');
  card.className = 'card';
  const newName = name.toLowerCase();

  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="${name}" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${capitalize(newName)}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);

};

// open menu restaurant
const openGoods = (event) => {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if (login) {
    if (restaurant) {
      const [ name, price, stars, kitchen ] = restaurant.infoCard;

      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price.toLocaleString('ru')} ₽`;
      category.textContent = kitchen;

      getData(`./db/${restaurant.products}`).
        then((data) => data.forEach(createCardGood));
    }
  } else {
    toggleModalAuth();
  }
};

// search
const search = (event) => {
  if (event.keyCode === 13) {
    if (login) {
      const target = event.target;
      const value = target.value.toLowerCase().trim();
      target.value = '';

      if (!value || value.length < 3) {
        target.style.borderColor = 'red';
        setTimeout(() => {
          target.style.borderColor = '';
        }, 2000);
        return;
      }

      const goods = [];
      getData('./db/partners.json')
      .then((data) => {
        const products = data.map((item) => item.products);
        products.forEach((product) => {
          getData(`./db/${product}`)
            .then((data) => {
              goods.push(...data);

              const searchGoods = goods.filter((item) => item.name.toLowerCase().includes(value));

              cardsMenu.textContent = '';
              containerPromo.classList.add('hide');
              restaurants.classList.add('hide');
              menu.classList.remove('hide');

              restaurantTitle.textContent = 'Результат поиска';
              rating.textContent = '';
              minPrice.textContent = '';
              category.textContent = '';

              return searchGoods;
            })
            .then((data) => data.forEach(createCardGood));
        });
      });
    } else {
      toggleModalAuth();
    }
  }
};

// cart
const addToCart = (event) => {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find((item) => item.id === id);

    if(food) {
      food.qty += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        qty: 1,
      });
    }
  }
  saveCart();
};

const renderCart = () => {
  modalBody.textContent = '';

  cart.forEach(({ id, title, cost, qty }) => {
    const newTitle = title.toLowerCase();
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${capitalize(newTitle)}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id="${id}">-</button>
          <span class="counter">${qty}</span>
          <button class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
      </div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce((result, item) => {
    return result + (parseFloat(item.cost) * item.qty);
  }, 0);

  modalPrice.textContent = totalPrice.toLocaleString('ru') + ' ₽';
};

const changeQty = (event) => {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find((item) => item.id === target.dataset.id);
    if (target.classList.contains('counter-minus')){
      food.qty--;
      if (food.qty === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('counter-plus')) food.qty++;
    renderCart();
  }
  saveCart();
};

function init() {
  getData('./db/partners.json')
    .then((data) => {
      data.forEach(createCardRestaurant);
    });

  cartButton.addEventListener('click', renderCart);
  cartButton.addEventListener('click', toggleModal);

  clearCart.addEventListener('click', () => {
    cart.length = 0;
    saveCart();
    renderCart();
  });
  modalBody.addEventListener('click', changeQty);
  cardsMenu.addEventListener('click', addToCart);
  closeBtn.addEventListener('click', toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  inputSearch.addEventListener('keydown', search);

  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 5000,
    },
    slidesPerView: 1,
  });
}

init();