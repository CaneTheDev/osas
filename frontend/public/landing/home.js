document.addEventListener("DOMContentLoaded", async function () {
    const userDisplayElement = document.querySelector(".user-actions h4");
    let isUserSignedIn = false;

    try {
        const response = await fetch("/auth/get-username", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const result = await response.json();
            const username = result.username;

            if (username) {
                userDisplayElement.innerHTML = `<i class="fas fa-user user-icon"></i>${username}`;
                isUserSignedIn = true;
            } else {
                userDisplayElement.innerHTML = `<i class="fas fa-user user-icon"></i>sign in`;
            }
        } else {
            userDisplayElement.innerHTML = `<i class="fas fa-user user-icon"></i>sign in`;
        }
    } catch (error) {
        console.error("Error fetching username:", error);
        userDisplayElement.innerHTML = `<i class="fas fa-user user-icon"></i>sign in`;
    }

    // Notify join-up.js of the user's sign-in status
    window.isUserSignedIn = isUserSignedIn;
      // Add event listeners to promo items
      document.querySelectorAll('.promo-item').forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            if (category) {
                // Navigate to our-products page with the specific category
                window.location.href = `/our-products?category=${encodeURIComponent(category)}`;
            } else {
                // Default action for 'See All'
                window.location.href = '/our-products';
            }
        });
    });

    // Add event listeners to shop collection items
    document.querySelectorAll('.collection-item').forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            if (category) {
                // Navigate to our-products page with the specific category
                window.location.href = `/our-products?category=${encodeURIComponent(category)}`;
            } else {
                // Default action for 'See All'
                window.location.href = '/our-products';
            }
        });
    });

});
