document.addEventListener('DOMContentLoaded', () => {
    const checkoutItemsContainer = document.querySelector('.checkout-items');
    const subtotalPriceElement = document.querySelector('.subtotal-price');
    const shippingPriceElement = document.querySelector('.shipping-price');
    const totalPriceElement = document.querySelector('.total-price');
    const placeOrderBtn = document.querySelector('.place-order-btn');
    let shippingCost = 0.00; // Default to pickup with no shipping cost

    // Elements for the shipping details
    const pickupDetails = document.getElementById('pickup-details');
    const shippingOptionSelect = document.getElementById('shipping-option'); // Selector for shipping options

    // Show only Pickup details by default
    pickupDetails.style.display = 'block';

    // Disable the place order button by default
    placeOrderBtn.disabled = true;

    // Validate input fields for pickup option only
    const validateFields = () => {
        const pickupLocation = document.getElementById('pickup-location').value;
        const pickupPhone = document.getElementById('pickup-phone').value.trim();
        const pickupEmail = document.getElementById('pickup-email').value.trim();
        placeOrderBtn.disabled = !(pickupLocation && pickupPhone && pickupEmail);
    };

    // Attach input event listeners to validate fields in real-time
    const pickupInputs = document.querySelectorAll('#pickup-details input, #pickup-details select');
    pickupInputs.forEach(input => {
        input.addEventListener('input', validateFields);
    });

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

    // Update the checkout page UI
    const updateCheckout = async () => {
        const cartItems = await fetchCartItems();
        let subtotal = 0;

        const createCheckoutItem = (item) => {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('checkout-item');
            itemContainer.innerHTML = `
                <div class="product">
                    <div class="product-main-image">
                        <img src="${item.image}" alt="${item.name}" class="product-image">
                    </div>
                    <div class="product-details">
                        <span class="product-name">${item.name}</span>
                        <span class="product-quantity">Qty: ${item.quantity}</span>
                    </div>
                </div>
                <div class="price">₦${(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            `;
            checkoutItemsContainer.appendChild(itemContainer);
            subtotal += item.price * item.quantity;
        };

        checkoutItemsContainer.innerHTML = ''; // Clear existing items

        cartItems.forEach(item => createCheckoutItem(item)); // Add items to checkout

        subtotalPriceElement.textContent = `₦${subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // Set shipping cost to zero for pickup
        shippingPriceElement.textContent = `₦${shippingCost.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // Calculate total including shipping cost
        const total = subtotal + shippingCost;
        totalPriceElement.textContent = `₦${total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        validateFields(); // Validate fields after updating the checkout
    };

    // Ensure pickup is the default shipping option
    if (shippingOptionSelect) {
        shippingOptionSelect.value = 'pickup'; // Assuming "pickup" is the value for pickup option
        pickupDetails.style.display = 'block'; // Show pickup details
        shippingCost = 0.00; // Ensure shipping cost is set to 0 for pickup
    }

    // Update checkout page on load
    updateCheckout();

    // Handle place order button click
    placeOrderBtn.addEventListener('click', async () => {
        if (placeOrderBtn.disabled) return; // Prevent placing order if button is disabled

        // Capture pickup details
        const pickupLocation = document.getElementById('pickup-location').value;
        const pickupPhone = document.getElementById('pickup-phone').value;
        const pickupEmail = document.getElementById('pickup-email').value;
        const pickUpDate = document.getElementById('pick-up-date').value;

        const response = await fetch('/order/place', {
            method: 'POST',
            body: JSON.stringify({
                shippingOption: 'pickup',
                shippingDetails: { pickupLocation, pickupPhone, pickupEmail },
                pickUpDate,  // Include pick-up date in the request body
                cartItems: await fetchCartItems(),
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert('Order placed successfully!');
            window.location.href = '/complete'; // Redirect to success page
        } else {
            const errorData = await response.json();
            alert(`Failed to place order: ${errorData.message}`);
        }
    });
});
