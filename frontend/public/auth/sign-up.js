document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById("sign-up-form");
    const signUpButton = document.getElementById("sign-up-btn");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const togglePassword = document.getElementById("toggle-password");
    const toggleConfirmPassword = document.getElementById("toggle-confirm-password");

    // Store the original referrer if it's not already stored
    if (!localStorage.getItem('originalReferrer')) {
        const referrer = document.referrer || '/'; // Default to homepage if no referrer
        localStorage.setItem('originalReferrer', referrer);
    }

    signUpForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Clear previous errors
        clearErrors();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            displayError("confirm-password-error", "Passwords do not match!");
            return;
        }

        signUpButton.disabled = true;

        const data = {
            fullname: name,
            email: email,
            password: password,
        };

        try {
            const signUpResponse = await fetch("/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const signUpResult = await signUpResponse.json();

            if (signUpResponse.ok) {
                await signInUser(email, password);
            } else {
                handleErrors(signUpResponse.status, signUpResult.message);
            }
        } catch (error) {
            console.error("Error:", error);
            displayError("form-error", "A network error occurred. Please check your connection and try again.");
        } finally {
            signUpButton.disabled = false;
        }
    });

    // Password toggle functionality
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    toggleConfirmPassword.addEventListener('click', function () {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    async function signInUser(email, password) {
        const data = { email, password };

        try {
            const signInResponse = await fetch("/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const signInResult = await signInResponse.json();

            if (signInResponse.ok) {
                localStorage.setItem('username', signInResult.username);
                
                // Redirect to the original referrer or homepage
                const redirectUrl = localStorage.getItem('originalReferrer') || '/';
                localStorage.removeItem('originalReferrer'); // Clear referrer after redirection
                window.location.href = redirectUrl;
            } else {
                displayError("form-error", signInResult.message || "Error during automatic sign-in after sign-up.");
            }
        } catch (error) {
            console.error("Error:", error);
            displayError("form-error", "An error occurred during sign-in. Please try manually.");
        }
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach((element) => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    function handleErrors(statusCode, message) {
        switch (statusCode) {
            case 400:
                displayError("form-error", message || "Bad Request. Please ensure all fields are filled out correctly.");
                break;
            case 401:
                displayError("form-error", message || "Unauthorized. Please check your credentials.");
                break;
            case 409:
                displayError("email-error", message || "An account with this email already exists. Try signing in or use a different email.");
                break;
            case 500:
                displayError("form-error", message || "Server error. Please try again later.");
                break;
            default:
                displayError("form-error", message || "An unexpected error occurred. Please try again.");
                break;
        }
    }

    function displayError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = "block";
        errorElement.classList.remove("fade-out");

        setTimeout(() => {
            errorElement.classList.add("fade-out");
            setTimeout(() => {
                errorElement.style.display = "none";
            }, 500);
        }, 5000);
    }
});
