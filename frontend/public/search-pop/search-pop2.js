document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.search-input');
    const suggestedProductsList = document.querySelector('.suggested-products');

    let searchTimeout;

    const showLoading = () => {
        suggestedProductsList.innerHTML = '<div class="loading-spinner"></div>';
    };

    const hideLoading = () => {
        const loadingSpinner = document.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.remove();
        }
    };
// remove -Searching for items matching- from  displayNotification
    const fetchItems = async (query) => {
        try {
            showLoading();
            displayNotification(` "${query}"...`); // Notify user of search action

            const response = await fetch(`/items/search?query=${encodeURIComponent(query.toLowerCase())}`);
            const items = await response.json();

            suggestedProductsList.innerHTML = '';

            if (items.length > 0) {
                items.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('suggested-product-item');
                    listItem.dataset.itemId = item.id; // Store the item ID for later

                    const image = document.createElement('img');
                    image.src = item.imageUrl;
                    image.alt = item.name;
                    image.classList.add('suggested-product-image');

                    const details = document.createElement('div');
                    details.classList.add('suggested-product-details');

                    const name = document.createElement('span');
                    name.textContent = item.name;
                    name.classList.add('suggested-product-name');

                    const description = document.createElement('span');
                    description.textContent = item.description; // Assuming `item.description` exists
                    description.classList.add('suggested-product-description');

                    details.appendChild(name);
                    details.appendChild(description);

                    const priceContainer = document.createElement('div');
                    priceContainer.classList.add('suggested-product-price-container');

                    const price = document.createElement('span');
                    price.textContent = `₦${item.price.toLocaleString()}`;
                    price.classList.add('suggested-product-price');

                    const addToCartButton = document.createElement('button');
                    addToCartButton.textContent = 'Add to cart';
                    addToCartButton.classList.add('suggested-product-add-to-cart');
                    addToCartButton.setAttribute('data-id', item.id);

                    priceContainer.appendChild(price);
                    priceContainer.appendChild(addToCartButton);

                    listItem.appendChild(image);
                    listItem.appendChild(details);
                    listItem.appendChild(priceContainer);
                    suggestedProductsList.appendChild(listItem);
                });

                displayNotification(`${items.length} items found.`); // Notify user of search results

                // Add event listener for navigating to product page on click (except add-to-cart button)
                suggestedProductsList.addEventListener('click', (event) => {
                    const listItem = event.target.closest('.suggested-product-item');
                    if (listItem && !event.target.classList.contains('suggested-product-add-to-cart')) {
                        const itemId = listItem.dataset.itemId;
                        window.location.href = `/product-page/product-page.html?id=${itemId}`;
                    }
                });

                // Add event listeners for 'Add to Cart' buttons
                document.querySelectorAll('.suggested-product-add-to-cart').forEach(button => {
                    button.addEventListener('click', (event) => {
                        event.stopPropagation(); // Prevent triggering the product page redirection
                        const itemId = button.getAttribute('data-id');
                        const quantity = 1;

                        const cartItem = {
                            itemId: itemId,
                            quantity: quantity,
                        };

                        // Create a notification element
                        const notificationElement = document.createElement('div');
                        notificationElement.classList.add('notification');
                        document.body.appendChild(notificationElement);

                        // Send item data to the backend cart endpoint
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

                                displayNotification('Item added to cart.');

                                // Hide the notification after 3 seconds
                                setTimeout(() => {
                                    notificationElement.classList.remove('show');
                                    notificationElement.remove(); // Remove from DOM after hiding
                                }, 3000);
                            } else {
                                displayNotification('Kindly sign in to add items to the cart.');
                            }
                        })
                        .catch(error => {
                            console.error('Error adding item to cart:', error);
                            displayNotification('Error adding item to cart.');
                        });
                    });
                });
            } else {
                suggestedProductsList.innerHTML = '<li>No results found</li>';
                displayNotification('No results found.');
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            suggestedProductsList.innerHTML = '<li>Error fetching results</li>';
            displayNotification('Error fetching results.');
        } finally {
            hideLoading();
        }
    };

    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);

        const query = searchInput.value.trim();

        if (query.length > 0) {
            searchTimeout = setTimeout(() => fetchItems(query), 300);
        } else {
            suggestedProductsList.innerHTML = '';
        }
    });

    function displayNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'log-notification';
        notification.innerText = message;
    
        document.body.appendChild(notification);
    
        // Automatically remove the notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
});
