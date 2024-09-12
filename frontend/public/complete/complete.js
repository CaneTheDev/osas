document.addEventListener('DOMContentLoaded', async () => {
    const orderIdElement = document.getElementById('order-id');
    const orderItemsElement = document.getElementById('order-items');
    const totalPriceElement = document.getElementById('total-price');

    // Fetch the most recent order placed by the user
    const fetchOrderDetails = async () => {
        const response = await fetch('/order/last-order');
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch order details');
            return null;
        }
    };

    // Update the order summary UI with fetched details
    const updateOrderSummary = (order) => {
        // Set Order ID
        orderIdElement.textContent = order.id;

        // Calculate total price
        totalPriceElement.textContent = `₦${order.totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

        // Add items ordered
        order.OrderItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.Item.name} (₦${item.price.toLocaleString('en-NG')} x ${item.quantity})`;
            orderItemsElement.appendChild(listItem);
        });
    };

    // Fetch and display the order details
    const order = await fetchOrderDetails();
    if (order) {
        updateOrderSummary(order);
    }
});
