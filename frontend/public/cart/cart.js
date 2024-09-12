document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalPriceElement = document.querySelector('.subtotal-price');
    const cartBadge = document.querySelector('.cart-badge');
    const checkoutButton = document.querySelector('.checkout-btn'); // Reference to checkout button

    // Fetch the cart items from the backend
    const fetchCartItems = async () => {
        const response = await fetch('/cart/mycart');
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch cart items');
            return [];
        }
    };

    // Update the cart badge with the number of items
    const updateCartBadge = (itemCount) => {
        cartBadge.textContent = itemCount > 0 ? itemCount : ''; // Display item count or hide badge if zero
    };

    // Enable or disable checkout button based on cart item count
    const toggleCheckoutButton = (itemCount) => {
        if (itemCount > 0) {
            checkoutButton.removeAttribute('disabled'); // Enable button
        } else {
            checkoutButton.setAttribute('disabled', true); // Disable button
        }
    };

    // Update the cart UI
    const updateCart = async () => {
        const cartItems = await fetchCartItems();
        let subtotal = 0;
        let totalItems = 0;

        const createCartItem = (item) => {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('cart-item');
            itemContainer.innerHTML = `
                <div class="product">
                    <div class="product-main-image">
                        <img src="${item.image}" alt="${item.name}" class="product-image">
                    </div>
                    <div class="product-details">
                        <span class="product-name">${item.name}</span>
                        <a href="#" class="remove-item" data-id="${item.id}">Remove</a>
                    </div>
                </div>
                <div class="price">₦${item.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div class="quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity-number">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="total">₦${(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            `;
            cartItemsContainer.appendChild(itemContainer);
            subtotal += item.price * item.quantity;
            totalItems += item.quantity; // Count total items in cart
        };

        cartItemsContainer.innerHTML = ''; // Clear existing items
        cartItems.sort((a, b) => a.id - b.id); // Sort by item ID, or use another property

        cartItems.forEach(item => createCartItem(item)); // Add new items
        subtotalPriceElement.textContent = `₦${subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        updateCartBadge(totalItems); // Update the cart badge with the total item count
        toggleCheckoutButton(totalItems); // Enable/disable the checkout button based on cart item count
    };

    // Update the cart on page load
    updateCart();

    // Event delegation for increase/decrease quantity buttons and item removal
    cartItemsContainer.addEventListener('click', async (event) => {
        const target = event.target;

        // Handle quantity buttons
        if (target.classList.contains('quantity-btn')) {
            const itemId = parseInt(target.getAttribute('data-id'), 10);
            console.log('Item ID to update:', itemId);

            if (isNaN(itemId)) {
                console.error('Invalid itemId:', target.getAttribute('data-id'));
                return;
            }

            const action = target.classList.contains('decrease') ? 'decrease' : 'increase';

            // Call the backend to update quantity
            const response = await fetch(`/cart/update-quantity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: itemId,
                    action: action,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Failed to update quantity: ${errorData.message}`);
                return;
            }

            // Re-fetch the cart and update UI
            updateCart();
        }

        // Handle item removal
        if (target.classList.contains('remove-item')) {
            const itemId = parseInt(target.getAttribute('data-id'), 10);
            console.log(`Item ID to be removed: ${itemId}`);

            if (isNaN(itemId)) {
                console.error('Invalid itemId:', target.getAttribute('data-id'));
                return;
            }

            const response = await fetch(`/cart/remove/${itemId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Failed to remove item: ${errorData.message}`);
                return;
            }

            // Re-fetch the cart and update UI
            updateCart();
        }
    });

    // Event delegation to navigate to product details on card click
    cartItemsContainer.addEventListener('click', (event) => {
        const productCard = event.target.closest('.cart-item');
        const isQuantityButton = event.target.classList.contains('quantity-btn');
        const isRemoveButton = event.target.classList.contains('remove-item');

        // If the click is not on a quantity or remove button, navigate to product details
        if (productCard && !isQuantityButton && !isRemoveButton) {
            const productId = productCard.querySelector('.remove-item').dataset.id;
            if (productId) {
                window.location.href = `/product-page/product-page.html?id=${productId}`;
            } else {
                console.error('Product ID not found for the selected item.');
                alert('Error: Product ID not found.');
            }
        }
    });

    // Event listener for checkout button
    checkoutButton.addEventListener('click', () => {
        window.location.href = '/checkout'; // Redirect to checkout page
    });
});
