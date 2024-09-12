document.getElementById('signout-button').addEventListener('click', async () => {
    try {
        const res = await fetch('/admin/signout', {
            method: 'POST',
            credentials: 'include' // This ensures that the session cookie is included
        });

        if (res.ok) {
            window.location.href = '/admin/login';
        } else {
            alert('Error signing out');
        }
    } catch (error) {
        alert('Error occurred during sign-out');
    }
});
