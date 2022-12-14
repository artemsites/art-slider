/**
 * Слайдер
 * @author web.master-artem.ru
 * @version 1.1 - 14.12.2022
 * @source (cacher) https://snippets.cacher.io/snippet/876ca231e95e4f8239a6
 * @source (github) https://github.com/artemijeka/art-slider
 * 
 * @param {Object} params
 * @returns
 */
 export function ArtSlider(params) {
  let state = {
    slideView: params.slideView || 'auto',
    autoplay: params.autoplay || false,
    stopOnHover: params.stopOnHover || true,
    speed: params.speed || 500,
    // TODO loop: false не сделано
    loop: params.loop || true,
    btnNext: params.btnNext || null,
    btnPrev: params.btnPrev || null,
    slider: params.slider || ".art-slider",
    sliders: null,
    list: null,
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
      next();
      return this.slides.active;
    },
    prev: function () {
      prev();
      return this.slides.active;
    },
    autoplayInterval: null,
  };

  initSlider();
  // Клики по кнопкам навигации
  initNavBtns();

  ////////////////////////////////////////////////////////////////////
  /* Далее идут функции которые взаимодействуют вызывая друг друга: */
  ////////////////////////////////////////////////////////////////////

  function initSlider() {
    if (state.slider && typeof state.slider === "string") {
      state.sliders = document.querySelectorAll(state.slider);
    }

    state.sliders.forEach(function (sliderItem) {
      sliderItem.classList.add('--slide-view-'+state.slideView)

      state.list = sliderItem.querySelector(".art-slider__list");
      state.list.style.transition = state.speed + "ms";
      state.listWidth = state.list.getBoundingClientRect().width;

      if (state.btnNext && typeof state.btnNext === "string") {
        state.btnNext = document.querySelector(state.btnNext);
      }
      if (state.btnPrev && typeof state.btnPrev === "string") {
        state.btnPrev = document.querySelector(state.btnPrev);
      }

      state.slides.nodes = sliderItem.querySelectorAll(".art-slider__item");
      // state.slideWidth =
      //   state.slides.nodes[0].getBoundingClientRect().width + state.margin;
      state.slides.nodes[0].classList.add("art-slider__item--active");
      state.slides.active = state.slides.nodes[0];
      state.slides.activeIndex = 0;
      state.slides.count = state.slides.nodes.length;

      if (state.autoplay) {
        autoplayOn();
      }

      if (state.stopOnHover) {
        sliderItem.addEventListener('mouseover', function(){
          autoplayOff();
        });
        sliderItem.addEventListener('mouseleave', function(){
          autoplayOn();
        });
      }

      // !Важно ширина обёртки list должна быть равна сумме ширин слайдов
      state.slideWidth = state.listWidth / state.slides.count;

      // Инициация свайпов
      state.slides.nodes.forEach(function (slide, i) {
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
      });

      ["touchend", "mouseup"].forEach(function (eventName) {
        document.addEventListener(eventName, (e) => {
          onSwipeEnd(e);
        });
      });
    });
  }

  function initNavBtns() {
    if (state.btnNext) {
      state.btnNext.addEventListener("click", function () {
        next();
      });
    }
    if (state.btnPrev) {
      state.btnPrev.addEventListener("click", function () {
        prev();
      });
    }
  }

  function next() {
    translateNext();
    setActiveSlideNext();
    if (state.loop) {
      moveSlideToEnd();
    }
    createEventSlideChange();
  }

  function prev() {
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
    state.list.style.transform = `translateX(${state.curTranslateX}px)`;
  }

  function moveSlideToStart() {
    state.slides.nodes = state.list.querySelectorAll(".art-slider__item");

    state.slides.nodes.forEach(function (slide) {
      slide.style.transform = `translateX(${-state.curTranslateX}px)`;
    });

    let curSlideLast = state.slides.nodes[state.slides.nodes.length - 1];
    state.list.prepend(curSlideLast);
  }

  function moveSlideToEnd() {
    state.slides.nodes = state.list.querySelectorAll(".art-slider__item");

    state.slides.nodes.forEach(function (slide) {
      slide.style.transform = `translateX(${-state.curTranslateX}px)`;
    });

    let curSlideFirst = state.slides.nodes[0];
    state.list.append(curSlideFirst);
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
    state.slides.active.classList.remove("art-slider__item--active");
    state.slides.active = state.slides.items[state.slides.activeIndex];
    state.slides.active.classList.add("art-slider__item--active");
  }

  function onSwipeStart(e) {
    // TODO autoplay('stop')
    // #autoplay('stop');

    const event = e.type.search("touch") === 0 ? e.touches[0] : e;
    state.swipeX = event.clientX;
    state.isSwiping = true;
  }

  function onSwipeEnd(e) {
    if (!state.isSwiping) {
      return;
    }
    const event = e.type.search("touch") === 0 ? e.changedTouches[0] : e;
    const diffPos = state.swipeX - event.clientX;
    if (diffPos > 50) {
      next();
    } else if (diffPos < -50) {
      prev();
    }
    state.isSwiping = false;
    if (state.loop) {
      // TODO autoplay:
      // autoplay();
    }
  }

  function autoplayOn() {
    state.autoplayInterval = setInterval(function() {
      next();
    }, state.autoplay);
  }

  function autoplayOff() {
    clearInterval(state.autoplayInterval);
  }

  return state;
}
