<template>
  <div ref="slider" class="art-slider">
    <div class="art-slider__wrapper">
      <div class="art-slider__list">

        <div class="art-slider__item" v-for="slide in slides">
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/scss/libs/art-slider.scss';
</style>

<script setup>
import { ArtSlider } from '~/assets/js/libs/art-slider.js';

let props = defineProps(['slides']);
let slider = ref(null);

onMounted(() => {
  new ArtSlider({
    slider: slider.value,//default: '.art-slider'
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
})
</script>