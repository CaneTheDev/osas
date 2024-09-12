document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menu-button');
    const popUpMenu = document.createElement('div');
    popUpMenu.classList.add('pop-up-menu');

    // Create pop-up menu content
    popUpMenu.innerHTML = `
        <div class="logo">
            <h2><span class="big-letter">Ꭷ</span>sas 𝔾lobal</h2>
        </div>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
                <li><a href="/store">Store</a></li>
            <li class="products">
                <a href="/our-products">Products</a>
            </li>
            <li><a href="#deals">Deals</a></li>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/contact-us">Contact</a></li>
        </ul>
        <div class="pop-up-footer">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-youtube"></i></a>
            <a href="#"><i class="fab fa-tiktok"></i></a>
        </div>
    `;

    // Append the pop-up menu to the body
    document.body.appendChild(popUpMenu);

    // Show or hide the pop-up menu when the button is clicked
    menuButton.addEventListener('click', function () {
        popUpMenu.classList.toggle('visible');
    });

    // Redirect to the products page when "Products" is clicked
    document.querySelector('.products a').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '/our-products';
    });

    // Hide the menu when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!popUpMenu.contains(event.target) && !menuButton.contains(event.target)) {
            popUpMenu.classList.remove('visible');
        }
    });

    // Scroll to the appropriate section and close the menu
    document.querySelector('a[href="#deals"]').addEventListener('click', function () {
        document.querySelector('.top-deals-carousel-container').scrollIntoView({ behavior: 'smooth' });
        popUpMenu.classList.remove('visible');
    });

    // Scroll to the footer for About Us and Contact links and close the menu
    document.querySelectorAll('a[href="#footer"]').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
            popUpMenu.classList.remove('visible');
        });
    });
});
