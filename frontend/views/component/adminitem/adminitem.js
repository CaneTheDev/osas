document.addEventListener("DOMContentLoaded", function () {
    const itemId = getItemIdFromURL();

    // Fetch available tags and populate the tags select input
    fetch('/api/tags')
        .then(response => response.json())
        .then(tags => {
            const tagsSelect = document.getElementById("tags-select");
            tags.forEach(tag => {
                const option = document.createElement("option");
                option.value = tag;
                option.textContent = tag;
                tagsSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching tags:', error));

    // Fetch the item details and populate form fields
    fetch(`/api/get/${itemId}`)
        .then(response => response.json())
        .then(item => {
            document.getElementById("name").value = item.name;
            document.getElementById("description").value = item.description;
            document.getElementById("price").value = item.price;
            document.getElementById("availability").value = item.productAvailability ? "true" : "false";
            document.getElementById("category").value = item.category;
            document.getElementById("productDescription").value = item.productDetails;
            document.getElementById("productModel").value = item.productModel;
            document.getElementById("productSpecification").value = item.productSpecification;

            // Populate tags in the select input
            const tagsSelect = document.getElementById("tags-select");
            if (item.tags) {
                item.tags.forEach(tag => {
                    const option = Array.from(tagsSelect.options).find(opt => opt.value === tag);
                    if (option) {
                        option.selected = true;
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching item:', error));

    // Handle commit, cancel, and delete buttons
    document.getElementById("commit-btn").addEventListener("click", function () {
        const itemId = getItemIdFromURL();
        const formData = {
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            price: document.getElementById("price").value,
            productAvailability: document.getElementById("availability").value === "true",
            tags: Array.from(document.getElementById("tags-select").selectedOptions)
                      .map(option => option.value).join(','),
            category: document.getElementById("category").value,
            productDetails: document.getElementById("productDescription").value,
            productModel: document.getElementById("productModel").value,
            productSpecification: document.getElementById("productSpecification").value
        };
    
        fetch(`/api/edit/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                alert('Item updated successfully!');
            }
        })
        .catch(error => console.error('Error updating item:', error));
    });
    
    document.getElementById("cancel-btn").addEventListener("click", function () {
        window.location.href = '/adminproduct'; // Redirect to product page
    });

    document.getElementById("delete-btn").addEventListener("click", function () {
        if (confirm('Are you sure you want to delete this item?')) {
            fetch(`/api/delete/${itemId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert('Item deleted successfully!');
                window.location.href = '/adminproduct';
            })
            .catch(error => console.error('Error deleting item:', error));
        }
    });
});

function getItemIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
