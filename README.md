#### Слайдер ArtSlider
Author web.master-artem.ru
Version 1.1.1 - 14.12.2022
Source (cacher) https://snippets.cacher.io/snippet/876ca231e95e4f8239a6
Source (github) https://github.com/artemijeka/art-slider

@param {Object} params
@returns {Object} state

##### Пример (версия 1.1.1):
```
new ArtSlider({
  loop: true,
  slideView: 1,//default: 'auto'
  stopOnHover: true,//default: true 
  swipe: true,
  speed: 500,
  // autoplay: 2 * 1000,//default: false
  // slider: '.block-text__wrapper',//default: '.art-slider'
  btnPrev: '.block-text__prev',
  btnNext: '.block-text__next',
});
```