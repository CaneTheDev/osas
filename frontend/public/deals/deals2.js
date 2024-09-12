document.addEventListener('DOMContentLoaded', async () => {
    const latestDealsContainer = document.querySelector('.latest-deals-carousel-container');
    const limitedOffersContainer = document.querySelector('.limited-offers-carousel-container');

    // Create and append the loading spinner for both containers
    const latestDealsLoadingSpinner = document.createElement('div');
    latestDealsLoadingSpinner.classList.add('loading-spinner');
    latestDealsContainer.appendChild(latestDealsLoadingSpinner);

    const limitedOffersLoadingSpinner = document.createElement('div');
    limitedOffersLoadingSpinner.classList.add('loading-spinner');
    limitedOffersContainer.appendChild(limitedOffersLoadingSpinner);

    // Function to show notification pop-ups
    function showNotification(message, type = 'info') {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification', type);
        notificationElement.textContent = message;
        document.body.appendChild(notificationElement);

        notificationElement.classList.add('show');
        setTimeout(() => {
            notificationElement.classList.remove('show');
            notificationElement.remove();
        }, 3000);
    }

    try {
        // Fetch latest deals
        const latestDealsResponse = await fetch('/items/tags/latest-deals');
        const latestDealsItems = await latestDealsResponse.json();

        // Remove the loading spinner for latest deals
        latestDealsLoadingSpinner.remove();

        if (latestDealsItems.length > 0) {
            const latestDealsCarousel = document.createElement('div');
            latestDealsCarousel.classList.add('deals-carousel');

            latestDealsItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('deal-item');
                itemElement.dataset.itemId = item.id; // Store the item ID for later

                itemElement.innerHTML = `
                <div class="item-card">
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <h5>${item.description}</h5>
                     <p class="item-price">₦${item.price.toLocaleString()}</p>
                    <button data-id="${item.id}" class="add-to-cart">Add to Cart</button>
                </div>`;

                latestDealsCarousel.appendChild(itemElement);
            });

            latestDealsContainer.appendChild(latestDealsCarousel);

            // Event delegation for product cards
            latestDealsCarousel.addEventListener('click', (event) => {
                const itemCard = event.target.closest('.deal-item');
                if (itemCard && !event.target.classList.contains('add-to-cart')) {
                    const itemId = itemCard.dataset.itemId;
                    window.location.href = `/product-page/product-page.html?id=${itemId}`;
                }
            });

            // Add event listeners to 'Add to Cart' buttons
            document.querySelectorAll('.latest-deals-carousel-container .add-to-cart').forEach(button => {
                button.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent triggering the product page redirection
                    const itemId = button.getAttribute('data-id');
                    const quantity = 1;

                    const cartItem = {
                        itemId: itemId,
                        quantity: quantity,
                    };

                    fetch('/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(cartItem),
                    })
                    .then(response => {
                        if (response.ok) {
                            showNotification('Item successfully added to the cart!', 'success');
                        } else {
                            showNotification('Kindly sign in to add items to the cart.', 'error');
                        }
                    })
                    .catch(error => {
                        showNotification('Error adding item to cart: ' + error.message, 'error');
                        console.error('Error adding item to cart:', error);
                    });
                });
            });
        } else {
            latestDealsContainer.innerHTML = '<p>No latest deals available at the moment.</p>';
            showNotification('No latest deals available at the moment.', 'info');
        }

        // Fetch limited offers
        const limitedOffersResponse = await fetch('/items/tags/limited-offers');
        const limitedOffersItems = await limitedOffersResponse.json();

        // Remove the loading spinner for limited offers
        limitedOffersLoadingSpinner.remove();

        if (limitedOffersItems.length > 0) {
            const limitedOffersCarousel = document.createElement('div');
            limitedOffersCarousel.classList.add('deals-carousel');

            limitedOffersItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('deal-item');
                itemElement.dataset.itemId = item.id; // Store the item ID for later

                itemElement.innerHTML = `
                <div class="item-card">
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <h5>${item.description}</h5>
                     <p class="item-price">₦${item.price.toLocaleString()}</p>
                    <button data-id="${item.id}" class="add-to-cart">Add to Cart</button>
                </div>`;

                limitedOffersCarousel.appendChild(itemElement);
            });

            limitedOffersContainer.appendChild(limitedOffersCarousel);

            // Event delegation for product cards
            limitedOffersCarousel.addEventListener('click', (event) => {
                const itemCard = event.target.closest('.deal-item');
                if (itemCard && !event.target.classList.contains('add-to-cart')) {
                    const itemId = itemCard.dataset.itemId;
                    window.location.href = `/product-page/product-page.html?id=${itemId}`;
                }
            });

            // Add event listeners to 'Add to Cart' buttons
            document.querySelectorAll('.limited-offers-carousel-container .add-to-cart').forEach(button => {
                button.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent triggering the product page redirection
                    const itemId = button.getAttribute('data-id');
                    const quantity = 1;

                    const cartItem = {
                        itemId: itemId,
                        quantity: quantity,
                    };

                    fetch('/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(cartItem),
                    })
                    .then(response => {
                        if (response.ok) {
                            showNotification('Item successfully added to the cart!', 'success');
                        } else {
                            showNotification('Kindly sign in to add items to the cart.', 'error');
                        }
                    })
                    .catch(error => {
                        showNotification('Error adding item to cart: ' + error.message, 'error');
                        console.error('Error adding item to cart:', error);
                    });
                });
            });
        } else {
            limitedOffersContainer.innerHTML = '<p>No limited offers available at the moment.</p>';
            showNotification('No limited offers available at the moment.', 'info');
        }

    } catch (error) {
        showNotification('Error fetching items: ' + error.message, 'error');
        console.error('Error fetching items:', error);
        // Remove the spinners in case of error
        latestDealsLoadingSpinner.remove();
        limitedOffersLoadingSpinner.remove();
    }
});
