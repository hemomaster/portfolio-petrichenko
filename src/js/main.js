"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const scrollLinkAll = document.querySelectorAll(
    "a[href^='#']:not(a[href='#'])"
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

  // SMOOTH SCROLL
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

  scrollLinkAll.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = e.target
        .closest(".scroll-link")
        .getAttribute("href")
        .substring(1);

      if (!id) return;

      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
      });
    })
  );

  // end js
});
