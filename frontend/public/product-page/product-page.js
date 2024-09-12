document.addEventListener('DOMContentLoaded', () => {
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        // Fetch the product details from the server
        fetch(`/items/get/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(product => {
                // Populate the product details on the page
                document.getElementById('product-name').innerText = product.name;
                document.getElementById('product-model').innerText = `Model: ${product.productModel}`;  // Corrected
                document.getElementById('product-availability').innerText = `Availability: ${product.productAvailability ? 'In Stock' : 'Out of Stock'}`;  // Corrected
                document.getElementById('product-price').innerText = `₦${product.price.toLocaleString()}`;  // Format price with commas
                document.getElementById('product-description').innerText = product.description;
                document.getElementById('product-image').src = product.imageUrl;

                // Display additional product details in the "details" tab
                const detailsTab = document.getElementById('details');
                if (product.productDetails) {
                    detailsTab.innerHTML = `<h3 class="Product-D">Product Details:</h3><p class="Product-p">${product.productDetails}</p>`;
                } else {
                    detailsTab.innerHTML = '<p>No additional details available.</p>';
                }

                 // Ensure the "specifications" tab exists before trying to access it
    const specificationsTab = document.getElementById('specifications');
    if (specificationsTab) {
        if (product.productSpecification) {
            specificationsTab.innerHTML = `<h3 class="Product-S">Specification:</h3><p class="Product-p">${product.productSpecification}</p>`;
        } else {
            specificationsTab.innerHTML = '<p>No specifications available.</p>';
        }
    } else {
        console.error('Specifications tab not found in the DOM.');
    }

                // Fetch and display additional images for the product
                fetch(`/api/extra-images/${productId}`)
                    .then(response => response.json())
                    .then(extraImages => {
                        const thumbnailGallery = document.querySelector('.thumbnail-gallery');

                        // Include the main image as the first thumbnail
                        const mainImageElement = document.createElement('img');
                        mainImageElement.src = product.imageUrl;
                        mainImageElement.alt = 'Main Product Image';
                        mainImageElement.classList.add('thumbnail');
                        mainImageElement.addEventListener('click', () => {
                            document.getElementById('product-image').src = product.imageUrl;
                        });
                        thumbnailGallery.appendChild(mainImageElement);

                        // Add other extra images to the thumbnail gallery
                        extraImages.forEach(image => {
                            const imgElement = document.createElement('img');
                            imgElement.src = image.url;
                            imgElement.alt = `Thumbnail ${image.id}`;
                            imgElement.classList.add('thumbnail');
                            imgElement.addEventListener('click', () => {
                                document.getElementById('product-image').src = image.url;
                            });
                            thumbnailGallery.appendChild(imgElement);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching extra images:', error);
                    });

            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                document.getElementById('error-message').innerText = 'Failed to load product details. Please try again later.';
            });
    } else {
        console.error('No product ID found in the URL.');
        document.getElementById('error-message').innerText = 'No product selected.';
    }

    // Tab functionality
    const tabs = document.querySelectorAll('.tab-button');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPane = document.getElementById(tab.getAttribute('data-tab'));
            
            if (targetPane) {
                // Remove active class from all tabs and panes
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
    
                // Add active class to clicked tab and corresponding pane
                tab.classList.add('active');
                targetPane.classList.add('active');
            } else {
                console.error('Tab pane not found:', tab.getAttribute('data-tab'));
            }
        });
    });
    

    // Quantity Buttons
    const decreaseButton = document.getElementById('decrease-quantity');
    const increaseButton = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('quantity');

    decreaseButton.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseButton.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

});
