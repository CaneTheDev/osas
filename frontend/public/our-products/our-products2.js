document.addEventListener('DOMContentLoaded', () => {
    // Function to get query parameters from URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    // Retrieve category from query parameters
    const category = getQueryParam('category');
    
    if (category) {
        console.log(`Filtering products for category: ${category}`);
        filterProductsByCategory(category);
    }
    

    // Event delegation for product cards
    document.querySelector('.product-grid').addEventListener('click', (event) => {
        try {
            const productCard = event.target.closest('.product-item');
            if (productCard) {
                const productId = productCard.dataset.itemId; // Corrected to match the data attribute
                if (productId) {
                    // Redirect to the product page with the product ID in the URL
                    window.location.href = `/product-page/product-page.html?id=${productId}`;
                } else {
                    console.error('Product ID not found for the selected item.');
                    alert('Error: Product ID not found.');
                }
            }
        } catch (error) {
            console.error('Error handling product selection:', error);
            alert('An unexpected error occurred while selecting the product.');
        }
    });

    // Event delegation for add-to-cart buttons
    document.querySelector('.product-grid').addEventListener('click', (event) => {
        try {
            if (event.target.classList.contains('add-item-to-cart-button')) {
                const productCard = event.target.closest('.product-item');
                const productName = productCard.querySelector('h2').innerText;
                if (productName) {
                    console.log(`${productName} added to cart.`);
                    alert(`${productName} added to cart.`);
                } else {
                    console.error('Product name not found for the selected item.');
                    alert('Error: Product name not found.');
                }
            }
        } catch (error) {
            console.error('Error handling add to cart:', error);
            alert('An unexpected error occurred while adding the product to the cart.');
        }
    });
});

// Example function to filter products by category (Implement this based on your data structure)
function filterProductsByCategory(category) {
    const products = document.querySelectorAll('.product-item');
    products.forEach(product => {
        if (product.dataset.category !== category) {
            product.style.display = 'none'; // Hide products not matching the category
        } else {
            product.style.display = 'block'; // Show products that match the category
        }
    });
}
