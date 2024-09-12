document.querySelector('.back-home').addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.container').classList.add('fade-out');
    setTimeout(() => {
      window.location.href = "/";
    }, 1000); // Delay redirect for smooth animation
  });
  