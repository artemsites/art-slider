#### Слайдер ArtSlider
##### Простой слайдер, вёрстку надо настравивать вручную, стандартизированной вёрстки пока нет.
Author web.master-artem.ru   
Version 1.3 - 02.04.2023   
Source (cacher) https://snippets.cacher.io/snippet/876ca231e95e4f8239a6   
Source (github) https://github.com/artemijeka/art-slider   



##### Пример (версия 1.2):
```
  new ArtSlider({
    slider: slider.value,//default: '.art-slider'
    selectorWrapper: '.art-slider__wrapper',
    selectorList: '.art-slider__list',
    selectorItem: '.art-slider__item',
    loop: true,
    slideView: 1,//default: 'auto'
    stopOnHover: false,//default: true 
    swipe: true,
    speed: 500,

    autoplay: 5 * 1000,//default: false
    autoplayInfoPopup: true,//default: false
    autoplayOffInfoPopupHTML: '<b>Слайдер на паузе...</b>',//default: ""
    autoplayOnInfoPopupHTML: '<b>Слайдер включен...</b>',//default: ""
    autoplayInfoPopupTimeout: 750,//default: 300

    // btnPrev: '.block-text__prev',
    // btnNext: '.block-text__next',
  });
```

```
<div class="art-slider">
  <div class="art-slider__wrapper">
    <div class="art-slider__list">

      <div class="art-slider__item"></div>
      <div class="art-slider__item"></div>
      <div class="art-slider__item"></div>

    </div>
  </div>
</div>
```