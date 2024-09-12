document.addEventListener("DOMContentLoaded", () => {
    const phoneCardsContainer = document.querySelector('.phones-card');

    const phones = [
        { name: 'iPhone', logo: '../site-image/category/iphones-logo/iPhone-logo.webp', dataCategory: 'iPhone' },
        { name: 'Itel', logo: '../site-image/category/iphones-logo/itel-logo.webp', dataCategory: 'Itel' },
        { name: 'Nokia', logo: '../site-image/category/iphones-logo/nokia-logo.webp', dataCategory: 'Nokia' },
        { name: 'Samsung', logo: '../site-image/category/iphones-logo/samsung-logo.webp', dataCategory: 'Samsung' },
        { name: 'Tecno', logo: '../site-image/category/iphones-logo/tecno-logo.webp', dataCategory: 'Tecno' },
        { name: 'Infinix', logo: '../site-image/category/iphones-logo/infinix-logo.webp', dataCategory: 'Infinix' },
    ];

    // Function to render the phone cards
    function renderCards() {
        phoneCardsContainer.innerHTML = '';
        phones.forEach(phone => {
            const cardHTML = `
                <div class="phone-card" data-category="${phone.dataCategory}">
                    <a href="/our-products/?category=Phones">
                        <img src="${phone.logo}" alt="${phone.name} Logo">
                    </a>
                </div>
            `;
            phoneCardsContainer.innerHTML += cardHTML;
        });
    }

    // Initial render
    renderCards();
});
