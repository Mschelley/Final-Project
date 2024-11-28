// Function to retrieve manually entered date and time for Lost Item
function getManualDateTimeLost() {
    const dateTimeInputLost = document.getElementById('date-time-input-lost').value;
    return dateTimeInputLost;
}

// Function to retrieve manually entered date and time for Found Item
function getManualDateTimeFound() {
    const dateTimeInputFound = document.getElementById('date-time-input-found').value;
    return dateTimeInputFound;
}

// Handle submission for Lost Item form
document.getElementById('lost-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const lostItem = document.getElementById('lost-item').value;
    const dateTime = getManualDateTimeLost();  // Get manually entered date/time for Lost Item

    const li = document.createElement('li');
    li.textContent = `${lostItem} - Lost on: ${dateTime}`;
    document.getElementById('lost-items-list').appendChild(li);

    // Clear the input fields
    document.getElementById('lost-item').value = '';
    document.getElementById('date-time-input-lost').value = '';
});

// Handle submission for Found Item form
document.getElementById('found-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const foundItem = document.getElementById('found-item').value;
    const dateTime = getManualDateTimeFound();  // Get manually entered date/time for Found Item

    const li = document.createElement('li');
    li.textContent = `${foundItem} - Found on: ${dateTime}`;
    document.getElementById('found-items-list').appendChild(li);

    // Clear the input fields
    document.getElementById('found-item').value = '';
    document.getElementById('date-time-input-found').value = '';
});
