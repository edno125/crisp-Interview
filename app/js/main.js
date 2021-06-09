import sliderCarousel from './libs/sliders'

//Init Fisrt Slider
let sliderFirst = 'products-slider-1';
sliderCarousel(sliderFirst)

//Init Second Slider
let sliderSecond = 'products-slider-2';
sliderCarousel(sliderSecond)


//Mobile Navigation
document.querySelectorAll('.burger-toggle').forEach(item => {
    item.addEventListener('click', event => {
        let overlay = document.querySelector('.mobile-nav')
        if( !overlay.classList.contains('mobile-nav--show') ){
            overlay.classList.add("mobile-nav--show")
        }
        else{
            overlay.classList.remove("mobile-nav--show")
        }
    });
});



