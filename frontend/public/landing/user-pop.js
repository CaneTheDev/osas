document.addEventListener("DOMContentLoaded", function () {
    const userDisplayElement = document.querySelector(".user-actions h4");
    const popUpMenu = document.createElement("div");
    popUpMenu.classList.add("user-popup-menu");
    document.body.appendChild(popUpMenu);

    // Menu HTML structure
    popUpMenu.innerHTML = `
        <ul>
            <li class="user-signin-signout"></li>
         
            <li><a href="/user-orders">Orders</a></li>
        </ul>
    `;

    popUpMenu.style.display = "none"; // Initially hide the menu

    // Toggle menu visibility on click
    userDisplayElement.addEventListener("click", function () {
        if (popUpMenu.style.display === "none") {
            popUpMenu.style.display = "block";
        } else {
            popUpMenu.style.display = "none";
        }
    });

    // Close the menu if clicked outside
    document.addEventListener("click", function (event) {
        if (!userDisplayElement.contains(event.target) && !popUpMenu.contains(event.target)) {
            popUpMenu.style.display = "none";
        }
    });

    // Fetch user status and update menu options
    async function updateMenu() {
        try {
            const response = await fetch("/auth/get-username", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const result = await response.json();
            const signinSignoutElement = document.querySelector(".user-signin-signout");

            if (response.ok && result.username) {
                signinSignoutElement.innerHTML = `<a href="#" id="signout">Sign Out</a>`;
            } else {
                signinSignoutElement.innerHTML = `<a href="/signin">Sign In</a>`;
            }
        } catch (error) {
            console.error("Error updating menu:", error);
        }
    }

    updateMenu();

    // Handle sign-out logic
    document.addEventListener("click", async function (event) {
        if (event.target.id === "signout") {
            event.preventDefault();
            try {
                // Call server-side signout
                const response = await fetch("/auth/signout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (response.ok) {
                    // Clear the frontend user details
                    userDisplayElement.innerHTML = `<i class="fas fa-user user-icon"></i>Guest`;

                    // Hide the pop-up menu
                    popUpMenu.style.display = "none";

                    // Redirect to the homepage
                    window.location.href = "/";
                } else {
                    console.error("Error signing out: Failed to sign out on the server.");
                }
            } catch (error) {
                console.error("Error signing out:", error);
            }
        }
    });
});
