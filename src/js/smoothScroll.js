// Плавная прокрутка страницы по якорным ссылкам

const smoothScroll = (SPEED = 0.25) => {
  document.body.addEventListener("click", (e) => {
    const target = e.target;

    if (!target.matches("a[href^='#']:not(a[href='#'])")) return;

    e.preventDefault();

    const hash = target.getAttribute("href");
    const el = document.querySelector(hash);

    if (!el) return;

    const pageY = window.pageYOffset;
    const posTopEl = el.getBoundingClientRect().top;
    let start = 0;

    const step = (time) => {
      if (!start) start = time;

      const progress = time - start;
      const r =
        posTopEl < 0
          ? Math.max(pageY - progress / SPEED, pageY + posTopEl)
          : Math.min(pageY + progress / SPEED, pageY + posTopEl);

      scrollTo(0, r);
      if (r < pageY + posTopEl) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  });
};
