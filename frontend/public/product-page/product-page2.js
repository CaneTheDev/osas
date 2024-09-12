document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        const addToCartButton = document.querySelector('.add-to-cart');
        const quantityInput = document.getElementById('quantity');
        const notificationElement = document.createElement('div');  // Create a notification element

        notificationElement.classList.add('notification');  // Use the external CSS class
        document.body.appendChild(notificationElement); // Append notification to the body

        if (addToCartButton && quantityInput) {
            addToCartButton.addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value) || 1;

                const cartItem = {
                    itemId: productId,  // Product ID from URL
                    quantity: quantity, // Quantity selected
                };

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
                        // Show success notification
                        notificationElement.textContent = 'Item successfully added to the cart!';
                        notificationElement.classList.add('show');  // Show the notification

                        // Hide the notification after 3 seconds
                        setTimeout(() => {
                            notificationElement.classList.remove('show');
                        }, 3000);
                    } else {
                        console.log('Failed to add the item to the cart. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error adding item to cart:', error);
                });
            });
        } else {
            console.error('Add to Cart button or quantity input not found.');
        }
    } else {
        console.error('No product ID found in the URL.');
        document.getElementById('error-message').innerText = 'No product selected.';
    }
});
