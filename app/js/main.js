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


//Animate

setTimeout(()=>{
    const scrollOffset = 200;
 
    const scrollElement = document.querySelectorAll(".js-scroll");
    
    scrollElement.forEach(item => {
        const elementInView = (el, offset = 0) => {
            const elementTop = el.getBoundingClientRect().top;
           
            return (
              elementTop <= 
              ((window.innerHeight || document.documentElement.clientHeight) - offset)
            );
          };
           
          const displayScrollElement = () => {
              item.classList.add('scrolled');
          }
           
          const hideScrollElement = () => {
              item.classList.remove('scrolled');
          }
           
          const handleScrollAnimation = () => {
            if (elementInView(item, scrollOffset)) {
                displayScrollElement();
            } else {
              hideScrollElement();
            }
          }
          
          handleScrollAnimation();
          window.addEventListener('scroll', () => {
            handleScrollAnimation();
          });
    });

    
}, 1500)