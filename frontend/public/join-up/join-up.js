document.addEventListener("DOMContentLoaded", function () {
    // Add event listeners to the "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            if (!window.isUserSignedIn) {
                // Show the pop-up if the user is not signed in
                showSignInPopup();
            } else {
                // Proceed with adding to cart
                addToCart();
            }
        });
    });
});

function showSignInPopup() {
    // Create the modal HTML structure
    const modalHtml = `
        <div class="modal-overlay">
            <div class="modal-content">
                <h2>Sign In Required</h2>
                <p>To continue and add this item to your cart, you need to sign in.</p>
                <button id="signInBtn">Sign In</button>
                <button id="cancelBtn">Cancel</button>
            </div>
        </div>
    `;

    // Insert the modal into the DOM
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Add event listeners to the buttons inside the modal
    document.getElementById("signInBtn").addEventListener("click", function () {
        // Redirect to the sign-in page
        window.location.href = "/signin";
    });

    document.getElementById("cancelBtn").addEventListener("click", function () {
        // Remove the modal from the DOM
        document.querySelector(".modal-overlay").remove();
    });

    // Close modal when clicking outside the modal content
    document.querySelector(".modal-overlay").addEventListener("click", function (event) {
        if (event.target === document.querySelector(".modal-overlay")) {
            document.querySelector(".modal-overlay").remove();
        }
    });
}

function addToCart() {
    // Logic to add the item to the cart
    console.log("Item added to cart!");
}
