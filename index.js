/* -------------burger-menu---------*/
const buttonBurger = document.querySelector(".burger-button");
const menu = document.querySelector(".main-menu");
const body = document.querySelector("body");
const modalLinks = document.querySelectorAll(".nav-link");

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

//сначала скрыть меню, а потом перейти по ссылке
modalLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    closeBurgerMenu();
    menu.addEventListener("transitionend", function handler() {
      window.location.href = link.href;
      menu.removeEventListener("transitionend", handler);
    });
  });
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(max-width: 768px)").matches) {
    closeBurgerMenu();
  }
});

/* --------slider-------- */
const sliderWindow = document.querySelector(".slider-window");
const sliderContainer = document.querySelector(".slider-container");
const sliderCards = document.querySelectorAll(".favorite-card");
const progressLine = document.querySelectorAll(".progress-line");

let count = 0;
const swipeTime = 5000;
const interval = 100; // Частота обновления прогресс-бара в милисекундах
let progress = 0;
let progressBar;

function shiftSlide() {
  //сдвиг влево на актуальную измеренную ширину слайда
  const widthSlide = sliderWindow.offsetWidth;
  sliderContainer.style.transform = "translate(-" + count * widthSlide + "px)";
}

//прогресс-бар
function updateProgressBar() {
  progressBar = setInterval(() => {
    progress += (interval / swipeTime) * 100;
    progressLine[count].style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(progressBar);
      shiftToLeft();
      setTimeout(updateProgressBar, 0); //предотвращение переполнения стека вызовов
    }
  }, interval);
}

updateProgressBar();

//зависания слайдов при наведении
sliderWindow.addEventListener("mouseenter", () => {
  clearInterval(progressBar);
});
sliderWindow.addEventListener("mouseleave", updateProgressBar);
sliderWindow.addEventListener("touchstart", () => {
  clearInterval(progressBar);
});
sliderWindow.addEventListener("touchend", updateProgressBar);

//нажатия на кнопки
function shiftToLeft() {
  progressLine[count].style.width = "0";
  progress = 0;
  count++;
  if (count >= sliderCards.length) {
    count = 0;
  }
  shiftSlide();
}

function shiftToRight() {
  progressLine[count].style.width = "0";
  progress = 0;
  count--;
  if (count < 0) {
    count = sliderCards.length - 1;
  }
  shiftSlide();
}

document
  .querySelector("#slider-right-b")
  .addEventListener("click", shiftToLeft);

document
  .querySelector("#slider-left-b")
  .addEventListener("click", shiftToRight);

//swiper
let startX = 0;
let endX = 0;

sliderWindow.addEventListener("touchstart", (event) => {
  startX = event.touches[0].clientX;
});

sliderWindow.addEventListener("touchend", (event) => {
  endX = event.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 5;
  const deltaX = endX - startX;

  if (deltaX > swipeThreshold) {
    shiftToRight();
  } else if (deltaX < -swipeThreshold) {
    shiftToLeft();
  }
}
