document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/admin/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // This ensures that cookies (like the session cookie) are included
        });

        const data = await res.json();
        if (res.ok) {
            window.location.href = '/admin/dashboard';
        } else {
            document.getElementById('message').textContent = data.message;
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Error occurred during sign-in';
    }
});
