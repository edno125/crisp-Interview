//const carousels = document.querySelectorAll('[data-carousel]');
//carousels.forEach(setUpCarousel);

const sliderCarousel = id => {

    // Initializing all variables
    let slider,
        sliderPrev,
        sliderNext,
        sliderList,
        sliderElements;

    //Slider options
    let count,
        scrollCount,
        elemWidth,
        leftPos,
        sliderAbsWidth,
        elCount,
        elemArr;

    initOptions();


    //Init Options base on Media
    function initOptions(){
        // Initializing all variables
        slider = document.getElementById(id); //Main slider
        sliderPrev = slider.querySelector('.products-slider__arrow--left');
        sliderNext = slider.querySelector('.products-slider__arrow--right');
        sliderList = slider.querySelector('.products-slider__items');
        sliderElements = slider.querySelectorAll('.product-card');

        count = 4;
        scrollCount = 1;
        if (window.matchMedia("(max-width: 1200px)").matches) {
            count = 3;
            scrollCount = 1;
        }
        if (window.matchMedia("(max-width: 768px)").matches) {
            count = 2;
            scrollCount = 1;
        }
        if (window.matchMedia("(max-width: 576px)").matches) {
            count = 1;
            scrollCount = 1;
        }
        elemWidth = Math.floor(sliderList.offsetWidth / count);

        //Slider Preset
        leftPos = 0;
        sliderAbsWidth = 0;
        elCount = 0;
        elemArr = Array.prototype.slice.call(sliderElements); /*Little trik fot making an array*/
    
    }


    // Calculate Width For Slides
    function baseInit(){
        elemArr.forEach(function(c,i,arr){
            c.style.minWidth = elemWidth + 'px';

            //Add data-index
            c.setAttribute("data-index", i+1);

            //Add data-active
            if(i < 4){
                c.setAttribute("data-active", "true");
            }
            else{
                c.setAttribute("data-active", "false");
            }

            elCount++;
        });
        //Set Abs Width
        sliderAbsWidth = (elemArr.length + 1) * elemWidth;
    }

    // Handle Prev button
    function handlePrevious(){
        //Move Slider
        moveSlider('Prev')
    }

    // Handle Next button
    function handleNext(){
        //Move Slider
        moveSlider('Next')
    }

    // Move slider
    function moveSlider(dir){
        if(dir === 'Prev'){
            //Check if start scroll to end
            if(leftPos===0){
                leftPos = -1 * ( sliderAbsWidth - elemWidth * count);
            }
            sliderList.style.left = (leftPos + scrollCount * elemWidth) + 'px';
            leftPos = parseInt(sliderList.style.left, 10);
        }
        if(dir === 'Next'){
            //Check if end scroll to start
            if( leftPos <= -(elCount - count) * elemWidth ){
                leftPos = 0;
                sliderList.style.left = leftPos + 'px';
            }
            else{
                sliderList.style.left = (leftPos - scrollCount * elemWidth) + 'px';
                leftPos = parseInt(sliderList.style.left, 10);
            }
        }
    }

    //Slider Initialization
    const sliderInit = () => {

        initOptions();

        // 1. Run Calculation and baseInit
        baseInit();

        // 2. Run Listener for Left
        sliderPrev.addEventListener('click', handlePrevious);

        // 3. Run Listener for right
        sliderNext.addEventListener('click', handleNext);

    }

    window.addEventListener('resize', ()=>{
        //initOptions();
        sliderInit();
    });

    sliderInit();

};

export default sliderCarousel;