let pickUpDate = null;

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('pick-up-date');
    
    // Set the minimum selectable date to today's date
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    dateInput.setAttribute('min', today);

    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value); // Convert selected value to Date object
        const dayOfWeek = selectedDate.getUTCDay(); // Get the day of the week (0 = Sunday)
        const errorElement = document.getElementById('date-error');

        if (dayOfWeek === 0) { // 0 represents Sunday
            errorElement.style.display = 'inline'; // Show the error message
            this.value = ''; // Reset the input
            pickUpDate = null; // Clear the stored pick-up date
        } else {
            errorElement.style.display = 'none'; // Hide the error message if the date is valid
            pickUpDate = this.value; // Store the valid selected date
        }
    });
});
