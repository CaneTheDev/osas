document.addEventListener("DOMContentLoaded", function () {
    const queryParams = new URLSearchParams(window.location.search);
    const orderId = queryParams.get('id');

    if (!orderId) {
        alert("No order ID provided.");
        return;
    }

    // Fetch order details using the order ID
    fetch(`/order/${orderId}`)
    .then(response => response.json())
    .then(order => {
        // Populate order info
        document.getElementById("order-id").textContent = order.orderId;
        document.getElementById("user-name").textContent = order.user.fullname;
        document.getElementById("user-email").textContent = order.user.email;
        document.getElementById("total-price").textContent = order.totalPrice.toLocaleString();
        document.getElementById("order-status").textContent = order.status;

        // Display shipping option
        document.getElementById("shipping-option").textContent = order.shippingOption === 'standard' ? 'Standard Shipping' : 'Pickup';

         // Populate the new pick-up date field
    const pickUpDate = order.pickUpDate ? new Date(order.pickUpDate) : null;  // Convert to a Date object for formatting if needed
    if (pickUpDate && !isNaN(pickUpDate)) {
        document.getElementById("pickup-date").textContent = pickUpDate.toLocaleDateString();  // Format date as a readable string
    } else {
        document.getElementById("pickup-date").textContent = "Not provided";  // Handle invalid or missing date
    }

        // Check shipping option and handle shipping details correctly
        const shippingDetailsContainer = document.getElementById('shipping-details');
        shippingDetailsContainer.innerHTML = '';

        if (order.shippingOption === 'standard') {
            shippingDetailsContainer.innerHTML = `
                <p><strong>Delivery Location:</strong> ${order.shippingDetails.location || 'Not provided'}</p>
                <p><strong>Recipient Name:</strong> ${order.shippingDetails.recipientName || 'Not provided'}</p>
                <p><strong>Recipient Phone:</strong> ${order.shippingDetails.recipientPhone || 'Not provided'}</p>
            `;
        } else {
            shippingDetailsContainer.innerHTML = `
                <p><strong>Pickup Location:</strong> ${order.shippingDetails.pickupLocation || 'Not provided'}</p>
                <p><strong>Pickup Phone:</strong> ${order.shippingDetails.pickupPhone || 'Not provided'}</p>
                <p><strong>Pickup Email:</strong> ${order.shippingDetails.pickupEmail || 'Not provided'}</p>
            `;
        }

        // Populate items ordered
        const itemsTableBody = document.querySelector("#items-table tbody");
        itemsTableBody.innerHTML = '';
        order.items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₦${item.price.toLocaleString()}</td>
                <td>₦${(item.price * item.quantity).toLocaleString()}</td>
            `;
            itemsTableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error fetching order details:", error);
        alert("Failed to load order details.");
    });

    // Confirm order button functionality
    const confirmButton = document.getElementById("confirm-order-button");
    confirmButton.addEventListener("click", function () {
        fetch(`/order/${orderId}/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Order confirmed successfully.");
                document.getElementById("order-status").textContent = "Confirmed"; // Update the status to "Confirmed"
            } else {
                alert("Failed to confirm the order.");
            }
        })
        .catch(error => {
            console.error("Error confirming order:", error);
            alert("An error occurred while confirming the order.");
        });
    });
    // Cancel order button functionality
const cancelButton = document.getElementById("cancel-order-button");
cancelButton.addEventListener("click", function () {
    fetch(`/order/${orderId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert("Order cancelled successfully.");
            document.getElementById("order-status").textContent = "Cancelled"; // Update the status to "Cancelled"
        } else {
            alert("Failed to cancel the order.");
        }
    })
    .catch(error => {
        console.error("Error cancelling order:", error);
        alert("An error occurred while cancelling the order.");
    });
});

});
//working