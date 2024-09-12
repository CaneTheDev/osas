document.addEventListener('DOMContentLoaded', function () {
    const slideContainer = document.querySelector('.carousel-slide');
    const slides = document.querySelectorAll('.carousel-slide img');
    const indicatorsContainer = document.createElement('div');

    let currentIndex = 0;
    let slideWidth = slides[0].clientWidth;

    // Create Indicators
    indicatorsContainer.classList.add('carousel-indicators');
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(dot);
    });
    document.querySelector('.carousel-container-top').appendChild(indicatorsContainer);

    // Update slideWidth on window resize
    window.addEventListener('resize', () => {
        slideWidth = slides[0].clientWidth;
        updateSlidePosition();
    });

    // Slide Movement
    function updateSlidePosition() {
        slideContainer.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        updateIndicators();
    }

    // Next Slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition();
    }

    // Previous Slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlidePosition();
    }

    // Go to Specific Slide
    function goToSlide(index) {
        currentIndex = index;
        updateSlidePosition();
    }

    // Update Indicators
    function updateIndicators() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Auto-Rotate Carousel
    let autoRotate = setInterval(nextSlide, 10000);

    // Pause on Hover
    document.querySelector('.carousel-container-top').addEventListener('mouseover', () => {
        clearInterval(autoRotate);
    });

    document.querySelector('.carousel-container-top').addEventListener('mouseout', () => {
        autoRotate = setInterval(nextSlide, 10000);
    });

    // Swipe Detection (for mobile)
    let startX;

    slideContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    slideContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX > endX + 50) nextSlide();
        if (startX < endX - 50) prevSlide();
    });
});
