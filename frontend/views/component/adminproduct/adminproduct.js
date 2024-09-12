document.addEventListener("DOMContentLoaded", function () {
    const manageProductsLink = document.querySelector('a[href="#manage-products"]');

    manageProductsLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default anchor behavior
        displayProducts();
    });

    function displayProducts() {
        fetch('/api/list') // Correct API endpoint to fetch items
            .then(response => response.json())
            .then(products => {
                const mainContent = document.querySelector("main.content");
                mainContent.innerHTML = ''; // Clear any existing content

                if (products.length === 0) {
                    mainContent.innerHTML = '<p>No products found</p>';
                    return;
                }

                // Create search bar
                const searchBar = document.createElement('input');
                searchBar.type = 'text';
                searchBar.placeholder = 'Search for products...';
                searchBar.classList.add('search-bar');
                mainContent.appendChild(searchBar);

                // Create table structure
                const table = document.createElement('table');
                table.classList.add('product-table');

                // Create table header
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Availability</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                
                const tableBody = table.querySelector('tbody');
                mainContent.appendChild(table);

                // Function to display filtered products
                function filterProducts(query) {
                    const filteredProducts = products.filter(product => 
                        product.name.toLowerCase().includes(query.toLowerCase()) ||
                        product.description.toLowerCase().includes(query.toLowerCase())
                    );
                    populateTable(filteredProducts);
                }

                // Populate table with product data
                function populateTable(productList) {
                    tableBody.innerHTML = ''; // Clear table body
                    if (productList.length === 0) {
                        tableBody.innerHTML = '<tr><td colspan="5">No products match your search</td></tr>';
                    } else {
                        productList.forEach(product => {
                            const productRow = document.createElement('tr');
                            productRow.innerHTML = `
                                <td><img src="${product.imageUrl}" alt="${product.name}" class="product-image"></td>
                                <td>${product.name}</td>
                                <td>${product.description}</td>
                                <td>₦${product.price.toLocaleString()}</td>
                                <td>${product.productAvailability ? 'In Stock' : 'Out of Stock'}</td>
                            `;
                            // Add click event to redirect to adminitem page
                            productRow.addEventListener("click", function () {
                                window.location.href = `../adminitem.html?id=${product.id}`;


                            });
                            tableBody.appendChild(productRow);
                        });
                    }
                }

                // Initial display of all products
                populateTable(products);

                // Filter products when typing in the search bar
                searchBar.addEventListener('input', function () {
                    filterProducts(searchBar.value);
                });
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                const mainContent = document.querySelector("main.content");
                mainContent.innerHTML = '<p>Failed to load products.</p>';
            });
    }
});
