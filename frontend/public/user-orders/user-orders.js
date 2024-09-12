document.addEventListener('DOMContentLoaded', () => {
    const ordersListContainer = document.querySelector('.orders-list');

    // Fetch user-specific orders from the backend
    const fetchUserOrders = async () => {
        try {
            const response = await fetch('/order/my-orders');

            if (response.status === 401) {
                ordersListContainer.innerHTML = '<p>Please <a href="/signin">sign in</a> to view your orders.</p>';
                return null;
            }

            if (response.ok) {
                const orders = await response.json();
                return orders;
            } else {
                console.error(`Failed to fetch user orders: ${response.status} ${response.statusText}`);
                return [];
            }
        } catch (error) {
            console.error('Error occurred while fetching user orders:', error);
            return [];
        }
    };

    // Create and display order items
    const displayOrders = async () => {
        const orders = await fetchUserOrders();

        if (orders === null) return;

        if (orders.length === 0) {
            ordersListContainer.innerHTML = '<p>You currently have no orders. <a href="/shop">Start shopping now!</a></p>';
            return;
        }

        // Sort orders by most recent
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // If there are orders, display them
        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');

            const pickupDate = order.pickUpDate ? new Date(order.pickUpDate) : null;
            const formattedPickupDate = pickupDate && !isNaN(pickupDate) 
                ? pickupDate.toLocaleDateString() 
                : 'Not specified';

            // Set the status color based on the order's status
            let statusColorClass = '';
            switch (order.status.toLowerCase()) {
                case 'pending':
                    statusColorClass = 'status-pending';
                    break;
                case 'confirmed':
                    statusColorClass = 'status-confirmed';
                    break;
                case 'cancelled':  // Fixed to lowercase 'cancelled'
                    statusColorClass = 'status-cancelled';  // Also ensure the class matches in the CSS
                    break;
                default:
                    statusColorClass = '';
            }

            orderItem.innerHTML = `
                <div class="order-header">
                    <span>Order ID: ${order.id}</span>
                    <span>Date: ${new Date(order.createdAt).toLocaleDateString()}</span>
                    <span class="order-status ${statusColorClass}">Status: ${order.status}</span>
                    <span>Pickup Date: ${formattedPickupDate}</span>
                </div>
            `;

            // Display order details (items)
            const orderDetails = document.createElement('div');
            orderDetails.classList.add('order-details');

            order.OrderItems.forEach(item => {
                const orderItemDetail = document.createElement('div');
                orderItemDetail.classList.add('order-info');

                orderItemDetail.innerHTML = `
                    <img src="${item.Item.imageUrl}" alt="${item.Item.name}" class="order-item-image">
                    <span class="product-name">${item.Item.name}</span>
                    <span class="product-quantity">Qty: ${item.quantity}</span>
                    <span class="product-price">₦${(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                `;

                orderItemDetail.addEventListener('click', () => {
                    window.location.href = `/product-page/product-page.html?id=${item.Item.id}`;
                });

                orderDetails.appendChild(orderItemDetail);
            });

            const orderTotal = document.createElement('div');
            orderTotal.classList.add('order-total');
            orderTotal.textContent = `Total: ₦${order.totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            orderItem.appendChild(orderDetails);
            orderItem.appendChild(orderTotal);
            
            ordersListContainer.appendChild(orderItem);
        });
    };

    displayOrders();
});
