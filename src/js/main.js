"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const openMenuEl = document.querySelector(".hero__hamburger");
  const menuEl = document.querySelector(".menu");
  const technologyValueEls = document.querySelectorAll(
    ".technology__levels-value"
  );
  const technologyProgressEls = document.querySelectorAll(
    ".technology__levels-progress"
  );

  // JUSTVALIDATE
  const validateForm = (selector, rules) => {
    if (!selector) return;

    new JustValidate(selector, {
      rules,
      submitHandler: function (form) {
        const dataForm = new FormData(form);

        fetch(form.action, {
          method: "POST",
          body: dataForm,
        })
          .then((response) => {
            if (response.ok) return response.json();
            else new Error(response);
          })
          .then((data) => {
            console.log("Ответ сервера: ", data);
          })
          .catch((e) => console.warn(`Ошибка: ${e.status}`))
          .finally(() => {
            form.reset();
          });
      },
    });
  };

  validateForm("", {
    fio: { required: true },
    email: { required: true, email: true },
    tel: { required: true },
  });

  // ПОКАЗАТЬ/СКРЫТЬ ССЫЛКУ ПРОКРУТКИ К НАЧАЛУ СТРАНИЦЫ
  // селектор вида a.#scroll-up
  let isDoneIn = false,
    isDoneOut = false;

  const handlerScrollUp = () => {
    if (window.pageYOffset >= window.innerHeight * 2) {
      if (!isDoneIn) {
        isDoneIn = true;
        isDoneOut = false;
        fadeIn("#scroll-up");
      }
    } else {
      if (!isDoneOut) {
        isDoneOut = true;
        isDoneIn = false;
        fadeOut("#scroll-up");
      }
    }
  };

  window.addEventListener("scroll", handlerScrollUp);
  handlerScrollUp();

  // ПОКАЗАТЬ/СКРЫТЬ МЕНЮ САЙТА
  const handlerCloseMenu = (e) => {
    const target = e.target;
    if (target.closest(".menu__close") || target.closest(".menu__overlay")) {
      menuEl.classList.remove("active");
      menuEl.removeEventListener("click", handlerCloseMenu);
    }
  };

  openMenuEl.addEventListener("click", () => {
    menuEl.classList.add("active");
    menuEl.addEventListener("click", handlerCloseMenu);
  });
  // ОТОБРАЗИТЬ ШКАЛУ В PROGRESS
  technologyValueEls.forEach(
    (val, i) =>
      (technologyProgressEls[i].style.width = parseInt(val.textContent) + "%")
  );

  // end js
});
