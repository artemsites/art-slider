/**
 * Слайдер ArtSlider
 * @author web.master-artem.ru
 * @version 1.3 - 02.04.2023
 * @source (cacher) https://snippets.cacher.io/snippet/876ca231e95e4f8239a6
 * @source (github) https://github.com/artemijeka/art-slider
 *
 * @param {Object} params
 * @returns {Object} state
 */
export function ArtSlider(params) {
  // console.log("ArtSlider params");
  // console.log(params);

  let state = {
    curSlideView: params.curSlideView || "auto",

    autoplay: params.autoplay || false,

    popupEnabled: params.popupEnabled || false,
    popupPaused: null,
    popupHTMLStartSlider: params.popupHTMLStartSlider || "",
    popupHTMLStopSlider: params.popupHTMLStopSlider || "",
    popupShowTimeout: params.popupShowTimeout || 500,

    stopOnHover: params.stopOnHover || true,
    speed: params.speed || 500,
    // TODO loop: false не сделано
    loop: params.loop || true,
    btnNext: params.btnNext || null,
    btnPrev: params.btnPrev || null,
    selSlider: params.selSlider || ".art-slider",
    selSliderList: params.selSliderList || ".art-slider__list",
    selSliderItem: params.selSliderItem || null,
    classSliderItem: ["art-slider__item"],
    sliders: null,
    sliderList: null,
    listWidth: null,
    slides: {
      items: {},
      nodes: null,
      active: null,
      activeIndex: null,
      count: null,
    },
    slideWidth: null,
    margin: params.margin || 0,
    curTranslateX: null,
    swipeX: null,
    isSwiping: false,
    next: function () {
      nextSlide();
      return this.slides.active;
    },
    prev: function () {
      prevSlide();
      return this.slides.active;
    },
    autoplayInterval: null,
  };
  // console.log(state);

  // Стили слайдера
  createStyles();

  initSlider();
  // Клики по кнопкам навигации
  initNavBtns();

  ////////////////////////////////////////////////////////////////////
  /* Далее идут функции которые взаимодействуют вызывая друг друга: */
  ////////////////////////////////////////////////////////////////////

  function initSlider() {
    // Если передан селектор для поиска
    if (state.selSlider && typeof state.selSlider === "string") {
      state.sliders = document.querySelectorAll(state.selSlider);
    }
    // Если передан уже найденный элемент
    else if (state.selSlider && typeof state.selSlider === "object") {
      state.sliders = [state.selSlider];
    }

    state.sliders.forEach(function (slider) {
      // console.log("slider");
      // console.log(slider);

      slider.classList.add("--slide-view-" + state.curSlideView);

      state.sliderList = slider.querySelector(state.selSliderList);

      state.sliderList.style.transition = state.speed + "ms";
      state.listWidth = state.sliderList.getBoundingClientRect().width;

      if (state.btnNext && typeof state.btnNext === "string") {
        state.btnNext = slider.querySelector(state.btnNext);
      }
      if (state.btnPrev && typeof state.btnPrev === "string") {
        state.btnPrev = slider.querySelector(state.btnPrev);
      }

      state.slides.nodes = state.sliderList.children;
      // console.log('state.slides.nodes')
      // console.log(state.slides.nodes)
      state.slides.nodes[0].classList.add("--active");
      state.slides.active = state.slides.nodes[0];
      state.slides.activeIndex = 0;
      state.slides.count = state.slides.nodes.length;

      // Проставляем класс art-slider__item детям если явно не проставлены эти классы
      if (!state.selSliderItem) {
        state.selSliderItem = "." + state.classSliderItem;
      } else {
        state.classSliderItem = state.selSliderItem.split(".");
      }

      for (let className of state.classSliderItem) {
        if (className) {
          for (let slide of state.slides.nodes) {
            slide.classList.add(className);
          }
        }
      }

      if (state.autoplay) {
        autoplayOn(slider);

        if (state.stopOnHover) {
          slider.addEventListener("mouseenter", function () {
            autoplayOff(slider);
          });
          slider.addEventListener("mouseleave", function () {
            autoplayOn(slider);
          });
        }
      }

      // !Важно ширина обёртки list должна быть равна сумме ширин слайдов
      state.slideWidth = state.listWidth / state.slides.count;

      // Инициализация старта свайпа на каждом слайде
      for (let i in state.slides.nodes) {
        let slide = state.slides.nodes[i];

        // Отсеиваем не элементы DOM из списка
        if (typeof slide === "object") {
          slide.dataset.artSlideI = i;
          state.slides.items[i] = slide;

          // !Помогает избавиться от багов с началом обработки драга вместо требуемых touchstart и mousedown
          slide.addEventListener("dragstart", function (e) {
            e.preventDefault;
          });

          ["touchstart", "mousedown"].forEach(function (eventName) {
            slide.addEventListener(eventName, (e) => {
              onSwipeStart(e);
            });
          });
        }
      }
      // Инициализация окончания свайпа где угодно
      ["touchend", "mouseup"].forEach(function (eventName) {
        document.addEventListener(eventName, (e) => {
          console.log(eventName);
          onSwipeEnd(e);
        });
      });
    });
  }

  function initNavBtns() {
    if (state.btnNext) {
      state.btnNext.addEventListener("click", function () {
        nextSlide();
      });
    }
    if (state.btnPrev) {
      state.btnPrev.addEventListener("click", function () {
        prevSlide();
      });
    }
  }

  function nextSlide() {
    translateNext();
    setActiveSlideNext();
    if (state.loop) {
      moveSlideToEnd();
    }
    createEventSlideChange();
  }

  function prevSlide() {
    translatePrev();
    setActiveSlidePrev();
    if (state.loop) {
      moveSlideToStart();
    }
    createEventSlideChange();
  }

  function createEventSlideChange() {
    let artSlideChange = new CustomEvent("artSlideChange", {
      detail: {
        slideActive: state.slides.active,
      },
    });
    window.dispatchEvent(artSlideChange);
    document.dispatchEvent(artSlideChange);
  }

  function translateNext() {
    state.curTranslateX -= state.slideWidth;
    setTransformTranslateX();
  }

  function translatePrev() {
    state.curTranslateX += state.slideWidth;
    setTransformTranslateX();
  }

  function setTransformTranslateX() {
    state.sliderList.style.transform = `translateX(${state.curTranslateX}px)`;
  }

  function moveSlideToStart() {
    state.slides.nodes = state.sliderList.querySelectorAll(state.selSliderItem);

    state.slides.nodes.forEach(function (slide) {
      slide.style.transform = `translateX(${-state.curTranslateX}px)`;
    });

    let curSlideLast = state.slides.nodes[state.slides.nodes.length - 1];
    state.sliderList.prepend(curSlideLast);
  }

  function moveSlideToEnd() {
    state.slides.nodes = state.sliderList.querySelectorAll(state.selSliderItem);

    state.slides.nodes.forEach(function (slide) {
      slide.style.transform = `translateX(${-state.curTranslateX}px)`;
    });

    let curSlideFirst = state.slides.nodes[0];
    state.sliderList.append(curSlideFirst);
  }

  function setActiveSlideNext() {
    state.slides.activeIndex += 1;
    if (!(state.slides.activeIndex < state.slides.count)) {
      state.slides.activeIndex = 0;
    }
    setActiveSlide();
  }

  function setActiveSlidePrev() {
    state.slides.activeIndex -= 1;
    if (state.slides.activeIndex < 0) {
      state.slides.activeIndex = state.slides.count - 1;
    }
    setActiveSlide();
  }

  function setActiveSlide() {
    state.slides.active.classList.remove("--active");
    state.slides.active = state.slides.items[state.slides.activeIndex];
    state.slides.active.classList.add("--active");
  }

  function onSwipeStart(e) {
    if (state.popupEnabled) state.popupPaused = true;
    console.log("onSwipeStart");
    // TODO autoplay('stop')
    // #autoplay('stop');

    const event = e.type.search("touch") === 0 ? e.touches[0] : e;
    state.swipeX = event.clientX;
    state.isSwiping = true;
  }

  function onSwipeEnd(e) {
    console.log("onSwipeEnd");
    if (!state.isSwiping) {
      return;
    }
    const event = e.type.search("touch") === 0 ? e.changedTouches[0] : e;
    const diffPos = state.swipeX - event.clientX;
    if (diffPos > 50) {
      nextSlide();
    } else if (diffPos < -50) {
      prevSlide();
    }
    state.isSwiping = false;
    if (state.loop) {
      // TODO autoplay:
      // autoplay();
    }

    if (state.popupEnabled) state.popupPaused = false;
  }

  function autoplayOn(sliderItem) {
    state.autoplayInterval = setInterval(function () {
      nextSlide();
    }, state.autoplay);
    if (state.popupEnabled) {
      enablePopup(sliderItem, state.popupHTMLStartSlider);
    }
  }

  function autoplayOff(sliderItem) {
    clearInterval(state.autoplayInterval);
    if (state.popupEnabled) {
      enablePopup(sliderItem, state.popupHTMLStopSlider);
    }
  }

  function enablePopup(sliderItem, message) {
    if (!state.popupPaused) {
      let popup = createPopup();
      popup.innerHTML = message;
      sliderItem.append(popup);
      setTimeout(function () {
        popup.classList.add("--fade-in");
      }, 1);

      setTimeout(function () {
        popup.classList.remove("--fade-in");
        popup.classList.add("--fade-out");
        setTimeout(function () {
          popup.remove();
        }, 1000);
      }, state.popupShowTimeout);
    }
  }

  function createPopup() {
    let popup = document.createElement("div");
    let selSliderName = state.selSlider.replace(".", "");
    popup.className = "art-slider__info-popup";
    return popup;
  }

  function createStyles() {
    let strStyles = `
      ${state.selSlider} {
        position: relative;
      }
      ${state.selSlider}.--slide-view-1 ${state.selSliderItem} {
        width: 100%;
        flex-shrink: 0;
      }
      
      ${state.selSliderList} {
        /* не устанавливать ширину, а то ширина одного слайда вычислится неверно */
        /* или можно наверно fit-content */
        display: flex;

        position: relative;
      }
      
      ${state.selSliderItem} {
        display: flex; 
      }
      ${state.selSliderItem} img {
        pointer-events: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        cursor: pointer;
      }
      ${state.selSliderItem}.--active {
      }

      .art-slider__info-popup {
        position: absolute;
        left: 50%;
        top: 0%;
        padding: 5px 8px;
        background-color: white;
        transform: translate(-50%, 0);
        opacity: 0;

        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
      }
      .art-slider__info-popup.--fade-in {
        transition: 1000ms;
        transform: translate(-50%, 50%);
        opacity: 1;
      }
      .art-slider__info-popup.--fade-out {
        transition: 750ms;
        transform: translate(-50%, 0%);
        opacity: 0;
      }
    `;

    let head = document.head || document.getElementsByTagName("head")[0];
    let elStyle = document.createElement("style");
    elStyle.appendChild(document.createTextNode(strStyles));
    head.appendChild(elStyle);
  }

  return state;
}
