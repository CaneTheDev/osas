document.addEventListener('DOMContentLoaded', () => {
    const cartBadge = document.querySelector('.cart-badge'); // Select the cart badge element

    // Fetch the cart items from the backend
    const fetchCartItems = async () => {
        try {
            const response = await fetch('/cart/mycart');
            if (response.ok) {
                return await response.json();
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    };

    // Update the cart badge with the number of items
    const updateCartBadge = (itemCount) => {
        cartBadge.textContent = itemCount >= 0 ? itemCount : ''; // Display item count or hide badge if zero
    };

    // Update the cart badge with the total items
    const updateCart = async () => {
        const cartItems = await fetchCartItems();
        let totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0); // Count total items in cart
        updateCartBadge(totalItems); // Update the cart badge with the total item count
    };

    // Trigger cart refresh 1 second after any click on the page
    document.addEventListener('click', () => {
        setTimeout(async () => {
            await updateCart(); // Update the cart badge after a 1-second delay
        }, 1000); // 1-second delay
    }, true); // Ensure capturing clicks in the capturing phase

    // Update the cart badge on page load
    updateCart();
});
