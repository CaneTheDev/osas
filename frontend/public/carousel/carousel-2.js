document.addEventListener('DOMContentLoaded', function () {
    const slideContainer2 = document.querySelector('.carousel-2-slide');
    const slides2 = document.querySelectorAll('.carousel-2-slide img');
    const indicatorsContainer2 = document.createElement('div');

    let currentIndex2 = 0;
    let slideWidth2 = slides2[0].clientWidth;

    // Create Indicators
    indicatorsContainer2.classList.add('carousel-2-indicators');
    slides2.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide2(i));
        indicatorsContainer2.appendChild(dot);
    });
    document.querySelector('.carousel-2-container').appendChild(indicatorsContainer2);

    // Update slideWidth on window resize
    window.addEventListener('resize', () => {
        slideWidth2 = slides2[0].clientWidth;
        updateSlidePosition2();
    });

    // Slide Movement
    function updateSlidePosition2() {
        slideContainer2.style.transform = `translateX(${-currentIndex2 * slideWidth2}px)`;
        updateIndicators2();
    }

    // Next Slide
    function nextSlide2() {
        currentIndex2 = (currentIndex2 + 1) % slides2.length;
        updateSlidePosition2();
    }

    // Previous Slide
    function prevSlide2() {
        currentIndex2 = (currentIndex2 - 1 + slides2.length) % slides2.length;
        updateSlidePosition2();
    }

    // Go to Specific Slide
    function goToSlide2(index) {
        currentIndex2 = index;
        updateSlidePosition2();
    }

    // Update Indicators
    function updateIndicators2() {
        const dots2 = document.querySelectorAll('.carousel-2-indicators .dot');
        dots2.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex2);
        });
    }

    // Auto-Rotate Carousel
    let autoRotate2 = setInterval(nextSlide2, 10000);

    // Pause on Hover
    document.querySelector('.carousel-2-container').addEventListener('mouseover', () => {
        clearInterval(autoRotate2);
    });

    document.querySelector('.carousel-2-container').addEventListener('mouseout', () => {
        autoRotate2 = setInterval(nextSlide2, 10000);
    });

    // Swipe Detection (for mobile)
    let startX2;

    slideContainer2.addEventListener('touchstart', (e) => {
        startX2 = e.touches[0].clientX;
    });

    slideContainer2.addEventListener('touchend', (e) => {
        const endX2 = e.changedTouches[0].clientX;
        if (startX2 > endX2 + 50) nextSlide2();
        if (startX2 < endX2 - 50) prevSlide2();
    });
});
