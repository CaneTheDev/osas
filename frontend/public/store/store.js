document.addEventListener('DOMContentLoaded', async () => {
    const productTagSelect = document.getElementById('product-tag-select');
    const productsContainer = document.querySelector('.product-grid');
    const loadingSpinner = document.getElementById('loading-spinner'); // Select the spinner element

    // Function to show notification pop-ups
    function showNotification(message, type = 'info') {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('log-notification');
        notificationElement.textContent = message;
        document.body.appendChild(notificationElement);

        setTimeout(() => {
            notificationElement.remove();
        }, 3000);
    }

    // Function to fetch and display products based on the selected tag
    async function fetchProductsByTag(tag) {
        try {
            loadingSpinner.style.display = 'block'; // Show the spinner before fetching

            const response = await fetch(`/items/tags/${tag}`);
            const products = await response.json();

            // Clear previous products
            productsContainer.innerHTML = '';

            if (products.length > 0) {
                products.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('product-item');
                    itemElement.dataset.itemId = item.id;

                    itemElement.innerHTML = `
                    <div class="product-item-image"> 
                        <img src="${item.imageUrl}" alt="${item.name}">
                    </div>
                    <div class="product-item-info">
                        <h2>${item.name}</h2>
                        <p>${item.description}</p>
                        <p class="product-item-price">₦${item.price.toLocaleString()}</p>
                        <button data-id="${item.id}" class="add-item-to-cart-button">Add to Cart</button>
                    </div>`;

                    productsContainer.appendChild(itemElement);
                });

                // Event delegation for product item clicks (excluding the "Add to Cart" button)
                productsContainer.addEventListener('click', (event) => {
                    const productCard = event.target.closest('.product-item');
                    if (productCard && !event.target.classList.contains('add-item-to-cart-button')) {
                        const productId = productCard.dataset.itemId;
                        if (productId) {
                            window.location.href = `/product-page/product-page.html?id=${productId}`;
                        } else {
                            showNotification('Error: Product ID not found.', 'error');
                        }
                    }
                });

                // Add event listeners to 'Add to Cart' buttons
                document.querySelectorAll('.add-item-to-cart-button').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        event.stopPropagation();
                        const itemId = button.getAttribute('data-id');
                        const quantity = 1;

                        const cartItem = {
                            itemId: itemId,
                            quantity: quantity,
                        };

                        try {
                            const response = await fetch('/cart/add', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(cartItem),
                            });

                            if (response.ok) {
                                showNotification('Item successfully added to the cart!', 'success');
                            } else {
                                showNotification('Kindly sign in to add items to the cart.', 'error');
                            }
                        } catch (error) {
                            showNotification('Error adding item to cart: ' + error.message, 'error');
                            console.error('Error adding item to cart:', error);
                        }
                    });
                });
            } else {
                productsContainer.innerHTML = '<p>No products available for the selected tag.</p>';
            }
        } catch (error) {
            showNotification('Error fetching products: ' + error.message, 'error');
            console.error('Error fetching products:', error);
        } finally {
            loadingSpinner.style.display = 'none'; // Hide the spinner after fetching
        }
    }

    // Function to fetch all available product tags
    async function fetchProductTags() {
        try {
            const response = await fetch('/items/tags');
            const tags = await response.json();

            // Populate the dropdown with tags
            tags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
                productTagSelect.appendChild(option);
            });
        } catch (error) {
            showNotification('Error fetching product tags: ' + error.message, 'error');
            console.error('Error fetching product tags:', error);
        }
    }

    // Function to handle tag selection and store the state
    function handleTagSelection(tag) {
        if (tag) {
            // Update the URL and save the tag in the browser history
            history.pushState({ tag }, '', `?tag=${tag}`);
            fetchProductsByTag(tag);
        }
    }

    // Fetch product tags when the page loads
    fetchProductTags();

    // Add event listener for tag selection change
    productTagSelect.addEventListener('change', (event) => {
        const selectedTag = event.target.value;
        handleTagSelection(selectedTag);
    });

    // Handle browser back/forward navigation
    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.tag) {
            productTagSelect.value = state.tag; // Set the dropdown to the previous tag
            fetchProductsByTag(state.tag); // Fetch the products for the previous tag
        } else {
            productsContainer.innerHTML = ''; // Clear products if no tag is selected
        }
    });

    // Check if a tag is already in the URL on page load
    const urlParams = new URLSearchParams(window.location.search);
    const initialTag = urlParams.get('tag');
    if (initialTag) {
        productTagSelect.value = initialTag; // Set the dropdown to the tag from the URL
        fetchProductsByTag(initialTag); // Fetch products for the tag from the URL
    }
});
