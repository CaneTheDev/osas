document.addEventListener("DOMContentLoaded", function () {
    const ordersLink = document.querySelector('a[href="#orders"]');

    ordersLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default anchor behavior
        console.log('Orders link clicked'); // Add this line for debugging
        displayOrders();
    });

    function displayOrders() {
        fetch('/order/all') // Updated API endpoint to fetch all orders
            .then(response => response.json())
            .then(orders => {
                const mainContent = document.querySelector("main.content");
                mainContent.innerHTML = ''; // Clear any existing content

                if (orders.length === 0) {
                    mainContent.innerHTML = '<p>No orders found</p>';
                    return;
                }

                // Create search bar
                const searchBar = document.createElement('input');
                searchBar.type = 'text';
                searchBar.placeholder = 'Search for orders...';
                searchBar.classList.add('search-bar');
                mainContent.appendChild(searchBar);

                // Create table structure
                const table = document.createElement('table');
                table.classList.add('order-table');

                // Create table header
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Order Date</th>
                            <th>View Details</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;

                const tableBody = table.querySelector('tbody');
                mainContent.appendChild(table);

                // Function to display filtered orders
                function filterOrders(query) {
                    const filteredOrders = orders.filter(order =>
                        order.id.toString().includes(query) ||
                        order.User.fullname.toLowerCase().includes(query.toLowerCase()) || // Changed to fullname
                        order.User.email.toLowerCase().includes(query.toLowerCase()) ||
                        order.status.toLowerCase().includes(query.toLowerCase())
                    );
                    populateTable(filteredOrders);
                }

                // Populate table with order data
                function populateTable(orderList) {
                    tableBody.innerHTML = ''; // Clear table body
                    if (orderList.length === 0) {
                        tableBody.innerHTML = '<tr><td colspan="7">No orders match your search</td></tr>';
                    } else {
                        orderList.forEach(order => {
                            const orderRow = document.createElement('tr');
                            orderRow.innerHTML = `
                                <td>${order.id}</td>
                                <td>${order.User.fullname}</td>
                                <td>${order.User.email}</td>
                                <td>₦${order.totalPrice.toLocaleString()}</td>
                                <td>${order.status}</td>
                                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                                <td><button class="view-details-button" data-order-id="${order.id}">View Details</button></td>
                            `;
                            tableBody.appendChild(orderRow);
                        });

                        // Add click events for each "View Details" button
                        const viewDetailsButtons = document.querySelectorAll(".view-details-button");
                        viewDetailsButtons.forEach(button => {
                            button.addEventListener("click", function () {
                                const orderId = button.getAttribute('data-order-id');
                                window.location.href = `/admin/userorders?id=${orderId}`; // Updated to redirect to user order details page
                            });
                        });
                    }
                }

                // Initial display of all orders
                populateTable(orders);

                // Filter orders when typing in the search bar
                searchBar.addEventListener('input', function () {
                    filterOrders(searchBar.value);
                });
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
                const mainContent = document.querySelector("main.content");
                mainContent.innerHTML = '<p>Failed to load orders.</p>';
            });
    }
});
