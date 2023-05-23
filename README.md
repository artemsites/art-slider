#### Слайдер ArtSlider
##### Слайдер задумывался как универсальный чтобы можно было подключить в любую систему. 
##### Слайдер пока на стадии доработки и тестирования.
##### Простой слайдер, вёрстку надо настравивать вручную, стандартизированной вёрстки пока нет.
Author web.master-artem.ru   
Version 1.3 - 02.04.2023   
Source (cacher) https://snippets.cacher.io/snippet/876ca231e95e4f8239a6   
Source (github) https://github.com/artemijeka/art-slider   



##### Пример:
```
  <div class="info__slider --wp-raw">
    <!-- Во Vue например вывод группы картинок через WP Rest API -->
    <div class="info__slider-list --wp-raw" v-html="content">
      <!-- Тут внтури примерно такая структура приходит с WP по Rest API -->
      <figure><img></figure>
      <figure><img></figure>
      <figure><img></figure>
    </div>

    <button class="art-slider__prev">prev</button>
    <button class="art-slider__next">next</button>
  </div>

  <script src="art-slider.js"></script>

  <script>
    new ArtSlider({
      // Default .art-slider
      selSlider: `#info-${props.id} .info__slider.--wp-raw`,

      // Default .art-slider__list
      selSliderList: '.info__slider-list.--wp-raw',

      // Default null и проставляется на все слайды автоматом .art-slider__item
      // Если самому указать то этот селектор проставится на слайды 
      selSliderItem: '.info__slider-item.--wp-raw',

      // Default true
      loop: false,

      // Default: 'auto' 
      curSlideView: 1,

      // Default: true 
      stopOnHover: false,

      swipe: true,
      speed: 500,

      autoplay: 3 * 1000,//default: false

      popupEnabled: true,//default: false
      popupHTMLStopSlider: '<b>Слайдер на паузе</b>',//default: ""
      popupHTMLStartSlider: '<b>Слайдер включен</b>',//default: ""
      popupShowTimeout: 750,//default: 300

      // btnPrev: '.art-slider__prev',
      // btnNext: '.art-slider__next',
    });
  </script>
```
