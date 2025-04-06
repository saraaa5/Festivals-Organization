var swiper = new Swiper(".slajdovi", {
    slidesPerView: 3,
    spaceBetween: 25,
    loop: true,
    centerSlide: 'true',
    fade: 'true',
    grabCursor: 'true',
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        520: {
            slidesPerView: 2,
        },
        950: {
            slidesPerView: 3,
        },
    }
  });

const wrapper = document.querySelector(".wrapper");
const loginkLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");


registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

loginkLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});


btnPopup.addEventListener("click", function() {
  document.querySelector(".wrapper").classList.add("active-popup");
});

iconClose.addEventListener("click", function() {
  document.querySelector(".wrapper").classList.remove("active-popup");
});