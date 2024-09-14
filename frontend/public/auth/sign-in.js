document.addEventListener("DOMContentLoaded", function () {
    const signInForm = document.querySelector("form");
    const signInButton = document.getElementById("sign-up-btn");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("toggle-password");

    // Store the original referrer if it's not already stored
    if (!localStorage.getItem('originalReferrer')) {
        const referrer = document.referrer || '/'; // Default to homepage if no referrer
        localStorage.setItem('originalReferrer', referrer);
    }

    signInForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Get form data
        const email = emailInput.value;
        const password = passwordInput.value;

        // Disable the button to prevent multiple submissions
        signInButton.disabled = true;

        // Data to be sent to the backend
        const data = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch("/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('username', result.username);
                
                // Redirect to the original referrer or homepage
                const redirectUrl = localStorage.getItem('originalReferrer') || '/';
                localStorage.removeItem('originalReferrer'); // Clear referrer after redirection
                window.location.href = redirectUrl;
            } else {
                showError(result.message || "Invalid email or password. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            showError("An unexpected error occurred. Please try again.");
        } finally {
            signInButton.disabled = false;
        }
    });

    // Password toggle functionality
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle the eye / eye-slash icon
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    function showError(message) {
        let errorMessage = document.querySelector(".error-message");

        if (!errorMessage) {
            errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            signInButton.insertAdjacentElement('beforebegin', errorMessage);
        }

        errorMessage.textContent = message;
        errorMessage.style.display = 'inline';
        errorMessage.classList.remove('fade-out');

        setTimeout(() => {
            errorMessage.classList.add("fade-out");
        }, 5000);
    }
});
