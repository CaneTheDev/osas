document.addEventListener('DOMContentLoaded', () => {
    const promoTextLinks = document.querySelectorAll('.promo-text a');

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function changeColors() {
        promoTextLinks.forEach(link => {
            link.style.color = getRandomColor();
        });
    }

    // Change color every second (1000 milliseconds)
    setInterval(changeColors, 5000);
});
