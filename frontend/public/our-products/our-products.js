document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
    const header = document.querySelector('h1');
    const container = document.querySelector('.container');
    const breadcrumb = document.querySelector('.breadcrumb');

    // Initial breadcrumb setup
    updateBreadcrumb('Our Products');

    // Parse URL parameters and trigger filtering if a category is specified
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        updateHeaderAndLoadItems(categoryParam);
    }

    // Add event listeners to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (event) => {
            if (!event.target.classList.contains('add-item-to-cart-button')) {
                const category = card.querySelector('h2').innerText;
                updateHeaderAndLoadItems(category);
                // Update URL without reloading the page
                window.history.pushState({}, '', `?category=${encodeURIComponent(category)}`);
            }
        });
    });

    function updateHeaderAndLoadItems(category) {
        // Update the header
        header.innerText = category;

        // Update breadcrumb navigation
        updateBreadcrumb(category);

        // Hide the product grid and show loading animation
        productGrid.style.display = 'none';
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'loading-container';
        loadingContainer.innerHTML = '<div class="loading-spinner"></div>';
        container.appendChild(loadingContainer);

        // Fetch items from backend
        fetchItemsFromBackend(category, loadingContainer);
    }

    function updateBreadcrumb(currentCategory) {
        // Clear existing breadcrumb
        breadcrumb.innerHTML = `
            <a href="#" class="breadcrumb-link" id="home-link">Home > </a>
        `;
    
        // Get the 'Home' link and add event listener to navigate to the home route
        const homeLink = document.querySelector('#home-link');
        homeLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '/'; // Navigate to home route
        });
    
        // Add 'Our Products' link as clickable to navigate to the '/our-products' route
        const ourProductsLink = document.createElement('a');
        ourProductsLink.href = "/our-products"; // Updated to use the correct route
        ourProductsLink.className = 'breadcrumb-link';
        ourProductsLink.innerText = 'Our Products > ';
        ourProductsLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '/our-products'; // Redirect to '/our-products' page
        });
        breadcrumb.appendChild(ourProductsLink);
    
        // Add separator
        breadcrumb.appendChild(document.createTextNode('  '));
    
        // Add the current category as non-clickable text
        if (currentCategory !== 'Our Products') {
            const currentCategorySpan = document.createElement('span');
            currentCategorySpan.className = 'breadcrumb-current';
            currentCategorySpan.innerText = currentCategory;
            breadcrumb.appendChild(currentCategorySpan);
        }
    }
    

    function fetchItemsFromBackend(category, loadingContainer) {
        displayNotification(`${category}...`); // Notify user of action

        fetch(`/api/items/category/${encodeURIComponent(category)}`)
            .then(response => response.json())
            .then(items => {
                loadingContainer.remove();
                productGrid.style.display = 'grid';
                productGrid.innerHTML = '';

                if (items.length === 0) {
                    productGrid.innerHTML = '<p>No items available in this category.</p>';
                    displayNotification('No items found for this category.');
                } else {
                    items.forEach(item => {
                        const productCard = createProductCard(item);
                        productGrid.appendChild(productCard);
                    });
                    displayNotification(`${items.length} items loaded.`);
                }
            })
            .catch(error => {
                console.error('Error fetching items:', error);
                loadingContainer.innerHTML = '<p>Error loading items. Please try again.</p>';
                displayNotification('Error loading items. Please try again.');
            });
    }

    function createProductCard(item) {
        const card = document.createElement('div');
        card.className = 'product-item';
        card.dataset.itemId = item.id;

        const imageDiv = document.createElement('div');
        imageDiv.className = 'product-item-image';
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = `${item.name} Image`;
        imageDiv.appendChild(img);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'product-item-info';

        const title = document.createElement('h2');
        title.innerText = item.name;

        const description = document.createElement('p');
        description.innerText = item.description;

        const price = document.createElement('p');
        price.className = 'product-item-price';
        price.innerText = `₦${item.price.toLocaleString()}`;

        const addToCartButton = document.createElement('button');
        addToCartButton.className = 'add-item-to-cart-button';
        addToCartButton.innerText = 'Add to Cart';
        addToCartButton.addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart(item.id);
        });

        infoDiv.appendChild(title);
        infoDiv.appendChild(description);
        infoDiv.appendChild(price);
        infoDiv.appendChild(addToCartButton);

        card.appendChild(imageDiv);
        card.appendChild(infoDiv);

        return card;
    }

    function addToCart(itemId) {
        const quantity = 1;

        const cartItem = {
            itemId: itemId,
            quantity: quantity,
        };

        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');
        document.body.appendChild(notificationElement);

        fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartItem),
        })
        .then(response => {
            if (response.ok) {
                notificationElement.textContent = 'Item successfully added to the cart!';
                notificationElement.classList.add('show');

                setTimeout(() => {
                    notificationElement.classList.remove('show');
                    notificationElement.remove();
                }, 3000);
            } else {
                console.error('Failed to add the item to the cart. Please try again.');
                displayNotification('Kindly sign in to add items to the cart.');
            }
        })
        .catch(error => {
            console.error('Error adding item to cart:', error);
            displayNotification('Error adding item to cart.');
        });
    }

    function displayNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'log-notification';
        notification.innerText = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});
