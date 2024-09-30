/* -------------burger-menu---------*/

const buttonBurger = document.querySelector(".burger-button");
const menu = document.querySelector(".main-menu");
const body = document.querySelector("body");

buttonBurger.addEventListener("click", () => {
  menu.classList.toggle("main-menu-open");
  body.classList.toggle("body-hidden");
  buttonBurger.classList.toggle("active-menu");
});

function closeBurgerMenu() {
  menu.classList.remove("main-menu-open");
  body.classList.remove("body-hidden");
  buttonBurger.classList.remove("active-menu");
}

menu.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    closeBurgerMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(max-width: 768px)").matches) {
    closeBurgerMenu();
  }
});

/*------------menu-------------*/
const coffeeButton = document.querySelector(".button-menu.coffee");
const teaButton = document.querySelector(".button-menu.tea");
const dessertButton = document.querySelector(".button-menu.dessert");
const menuContainer = document.querySelector(".container-menu");
let menuCards;

teaButton.addEventListener("click", () => changeCategory("tea"));
coffeeButton.addEventListener("click", () => changeCategory("coffee"));
dessertButton.addEventListener("click", () => changeCategory("dessert"));

function changeCategory(category) {
  /*второй аргумент в тогл - прямое условие добавления класса, если не выполняется - 
  класс удаляется*/
  teaButton.classList.toggle("active", category === "tea");
  coffeeButton.classList.toggle("active", category === "coffee");
  dessertButton.classList.toggle("active", category === "dessert");
  displayMenu(category);
}

async function loadMenuData() {
  try {
    const jsonData = await fetch("products.json");
    const data = await jsonData.json(); //превращение Promise в массив js
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке данных json", error);
  }
}

function createMenuCard(drink, index) {
  const menuCard = document.createElement("div");
  menuCard.classList.add("menu-card");

  menuCard.innerHTML = `
      <div class="menu-img">
        <img src="img/${drink.category.toLowerCase()}-${index}.jpg" alt="${
    drink.name
  }">
      </div>
      <div class="menu-text">
        <h3 class="drink-title">${drink.name}</h3>
        <p class="drink-description">${drink.description}</p>
        <h3 class="drink-price">$${drink.price}</h3>
      </div>
    `;
  menuCard.addEventListener("click", (event) => {
    makeModalWindow(drink, index);
    showModalWindow(event);
  });
  return menuCard;
}

async function displayMenu(category) {
  menuContainer.innerHTML = "";
  const menuData = await loadMenuData();
  menuCards = [];

  menuData.forEach((drink, index) => {
    if (drink.category.toLowerCase() == category) {
      const menuCard = createMenuCard(drink, index);
      menuCards.push(menuCard);
      menuContainer.appendChild(menuCard);
    }
  });
  checkUpdateButton();
}

function checkUpdateButton() {
  if (window.matchMedia("(max-width: 768px)").matches) {
    updateButton.style.display = "block";

    if (menuContainer.childElementCount < 5) {
      updateButton.style.display = "none";
    }
  }
}

displayMenu("coffee");

/*--------add update button---------*/
const updateButton = document.querySelector(".update-button");

updateButton.addEventListener("click", addMenuCards);

function addMenuCards() {
  menuCards.forEach((card) => {
    card.style.display = "block";
  });
  updateButton.style.display = "none";
}

window.addEventListener("resize", checkMediaQuery);

function checkMediaQuery() {
  if (menuContainer.childElementCount < 5) return;
  if (window.matchMedia("(max-width: 768px)").matches) {
    updateButton.style.display = "block";
    menuCards.forEach((card, index) => {
      if (index > 3) {
        card.style.display = "none";
      }
    });
  } else {
    addMenuCards();
  }
}

/*------------modal window------------*/
const modalWindow = document.querySelector(".modal-window");
const blackout = document.querySelector(".blackout");
const buttonSmall = document.querySelector(".button-menu.small");
const buttonMedium = document.querySelector(".button-menu.medium");
const buttonLarge = document.querySelector(".button-menu.large");
const finalPrice = document.querySelector("#final-price");
const additionButtons = document.querySelectorAll(".addition");
const sizeButtons = document.querySelectorAll(".button-menu.size");
let price;

function makeModalWindow(drink, index) {
  const sizes = ["s", "m", "l"];
  sizeButtons.forEach((button, index) => {
    button.innerHTML = `<div class="emoji">${sizes[index].toUpperCase()}</div>
    ${drink.sizes[sizes[index]].size}`;
  });
  additionButtons.forEach((button, index) => {
    button.innerHTML = `<div class="emoji">${index + 1}</div>
    ${drink.additives[index].name}`;
  });

  document.querySelector(
    ".modal-img"
  ).innerHTML = `<img src="img/${drink.category.toLowerCase()}-${index}.jpg" alt="${
    drink.name
  }">`;
  document.querySelector("#drink-title").textContent = drink.name;
  document.querySelector("#drink-description").textContent = drink.description;
  finalPrice.textContent = `$${drink.price}`;
  price = +drink.price;
}

function showModalWindow(event) {
  modalWindow.classList.remove("hidden");
  blackout.classList.remove("hidden");
  event.stopPropagation();
  body.style.overflow = "hidden";
}

buttonSmall.addEventListener("click", () => changeSize("s"));
buttonMedium.addEventListener("click", () => changeSize("m"));
buttonLarge.addEventListener("click", () => changeSize("l"));
//ушлепская логика, но не могу придумать как сократить
function changeSize(size) {
  if (buttonSmall.classList.contains("active")) {
    changeActiveButton(size);
    const total = size === "m" ? 0.5 : 1;
    price += total;
    finalPrice.textContent = `$${price.toFixed(2)}`;
  } else if (buttonMedium.classList.contains("active")) {
    changeActiveButton(size);
    const total = size === "s" ? -0.5 : +0.5;
    price += total;
    finalPrice.textContent = `$${price.toFixed(2)}`;
  } else {
    changeActiveButton(size);
    const total = size === "m" ? -0.5 : -1;
    price += total;
    finalPrice.textContent = `$${price.toFixed(2)}`;
  }
}

function changeActiveButton(size) {
  buttonSmall.classList.toggle("active", size === "s");
  buttonMedium.classList.toggle("active", size === "m");
  buttonLarge.classList.toggle("active", size === "l");
}

additionButtons.forEach(function (button) {
  button.addEventListener("click", addSomething);
});

function addSomething() {
  this.classList.toggle("active");
  if (this.classList.contains("active")) {
    price = +finalPrice.textContent.slice(1);
    price += 0.5;
    finalPrice.textContent = `$${price.toFixed(2)}`;
  } else {
    price = +finalPrice.textContent.slice(1);
    price -= 0.5;
    finalPrice.textContent = `$${price.toFixed(2)}`;
  }
}

function hideModalWindow() {
  modalWindow.classList.add("hidden");
  blackout.classList.add("hidden");
  body.style.overflow = "auto";
  additionButtons.forEach((item) => item.classList.remove("active"));
  buttonSmall.classList.add("active");
  buttonMedium.classList.remove("active");
  buttonLarge.classList.remove("active");
}

document.addEventListener("click", function (event) {
  if (!modalWindow.classList.contains("hidden")) {
    if (!modalWindow.contains(event.target)) {
      hideModalWindow();
    }
  }
});

document
  .querySelector("#close-button")
  .addEventListener("click", hideModalWindow);
