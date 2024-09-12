document.addEventListener("DOMContentLoaded", function () {
    const itemId = getItemIdFromURL();
    const mainImageElement = document.getElementById('admin-main-image');

    // Display main image
    fetch(`/api/get/${itemId}`)
        .then(response => response.json())
        .then(item => {
            if (item.imageUrl) {
                mainImageElement.src = item.imageUrl;
            } else {
                mainImageElement.src = '/path/to/default-image.jpg'; // Placeholder if no image is available
            }

            // Fetch and display extra images for the product
            fetch(`/api/extra-images/${itemId}`)
                .then(response => response.json())
                .then(extraImages => {
                    const extraImagesContainer = document.getElementById("extra-images-container");
                    extraImagesContainer.innerHTML = ''; // Clear any previous content

                    // Include the main image as the first thumbnail
                    const mainImageThumbnail = document.createElement('img');
                    mainImageThumbnail.src = item.imageUrl;
                    mainImageThumbnail.alt = 'Main Item Image';
                    mainImageThumbnail.classList.add('thumbnail');
                    mainImageThumbnail.addEventListener('click', () => {
                        mainImageElement.src = item.imageUrl;
                    });
                    extraImagesContainer.appendChild(mainImageThumbnail);

                    // Add other extra images to the thumbnail gallery
                    if (extraImages.length > 0) {
                        extraImages.forEach(image => {
                            const imgElement = document.createElement('img');
                            imgElement.src = image.url;
                            imgElement.alt = `Thumbnail ${image.id}`;
                            imgElement.classList.add('thumbnail');
                            imgElement.addEventListener('click', () => {
                                mainImageElement.src = image.url;
                            });
                            extraImagesContainer.appendChild(imgElement);
                        });
                    } else {
                        const noImagesMessage = document.createElement('p');
                        noImagesMessage.innerText = 'No extra images available.';
                        extraImagesContainer.appendChild(noImagesMessage);
                    }
                })
                .catch(error => console.error('Error fetching extra images:', error));
        })
        .catch(error => console.error('Error fetching item:', error));
});

function getItemIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
