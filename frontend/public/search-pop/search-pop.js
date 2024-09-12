document.addEventListener('DOMContentLoaded', function () {
    const searchIcon = document.querySelector('.search-icon');
    const searchPopUp = document.createElement('div');
    searchPopUp.classList.add('search-pop-up');

    // List of navigation links
    const navigationLinks = [
        { name: 'Home', url: '/' },
        { name: 'Shop', url: '/shop' },
        { name: 'Products', url: '/our-products' },
        { name: 'About Us', url: '/about-us' },
        { name: 'Contact', url: '/contact-us' }
    ];

    // Generate navigation list
    let navLinks = navigationLinks.map(link => `<li><a href="${link.url}">${link.name}</a></li>`).join('');

    // Create the search bar content with navigation links
    searchPopUp.innerHTML = `
        <div class="search-container">
            <input type="text" class="search-input" placeholder="Search...">
            <button class="search-close">&times;</button>
        </div>
        <ul class="suggested-products">
            ${navLinks}
        </ul>
    `;

    // Append the search pop-up to the body
    document.body.appendChild(searchPopUp);

    // Show the search pop-up when the search icon is clicked
    searchIcon.addEventListener('click', function () {
        searchPopUp.classList.add('visible');
    });

    // Hide the search pop-up when the close button is clicked
    document.querySelector('.search-close').addEventListener('click', function () {
        searchPopUp.classList.remove('visible');
    });

    // Hide the search pop-up when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!searchPopUp.contains(event.target) && !searchIcon.contains(event.target)) {
            searchPopUp.classList.remove('visible');
        }
    });

    // Listen for the custom event to open the pop-up when a card is clicked
    document.addEventListener('openSearchPopup', function () {
        searchPopUp.classList.add('visible');
    });
});
