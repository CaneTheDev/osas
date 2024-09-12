document.addEventListener('DOMContentLoaded', async () => {
    const topDealsContainer = document.querySelector('.top-deals-carousel-container');

    // Create and append the loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('loading-spinner');
    topDealsContainer.appendChild(loadingSpinner);

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
        // Fetch top-deals items from the backend
        const topDealsResponse = await fetch('/items/tags/top-deals');
        const topDealsItems = await topDealsResponse.json();

        // Remove the loading spinner
        loadingSpinner.remove();

        if (topDealsItems.length > 0) {
            const topDealsCarousel = document.createElement('div');
            topDealsCarousel.classList.add('deals-carousel');

            topDealsItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('deal-item');
                itemElement.dataset.itemId = item.id; // Store the item ID for later

                itemElement.innerHTML =  
                `<div class="item-card">
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <h5>${item.description}</h5>
                    <p class="item-price">₦${item.price.toLocaleString()}</p>
                    <button data-id="${item.id}" class="add-to-cart">Add to Cart</button>
                </div>`;
                

                topDealsCarousel.appendChild(itemElement);
            });

            topDealsContainer.appendChild(topDealsCarousel);

            // Event delegation for product cards
            topDealsCarousel.addEventListener('click', (event) => {
                const itemCard = event.target.closest('.deal-item');
                if (itemCard && !event.target.classList.contains('add-to-cart')) {
                    const itemId = itemCard.dataset.itemId;
                    window.location.href = `/product-page/product-page.html?id=${itemId}`;
                }
            });

            // Add event listeners to 'Add to Cart' buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
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
            topDealsContainer.innerHTML = '<p>No top deals available at the moment.</p>';
            showNotification('No top deals available at the moment.', 'info');
        }
    } catch (error) {
        showNotification('Error fetching items: ' + error.message, 'error');
        console.error('Error fetching items:', error);
        loadingSpinner.remove();
    }
});
