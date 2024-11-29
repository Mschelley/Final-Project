// Base class for Lost and Found Items (Encapsulation)
class Item {
    constructor(itemDescription, dateTime) {
        this._itemDescription = itemDescription;  // Private property
        this._dateTime = dateTime;  // Private property
        this._status = ''; // Status (either Lost/Found/Completed/Other)
    }

    // Getter for item description
    get itemDescription() {
        return this._itemDescription;
    }

    // Getter for date and time
    get dateTime() {
        return this._dateTime;
    }

    // Getter for status
    get status() {
        return this._status;
    }

    // Method to display the item (Encapsulation)
    displayItem() {
        return `${this.itemDescription} (Reported at: ${this.dateTime}) - Status: ${this.status}`;
    }
}

// Class for handling Lost Items (Inheritance from Item)
class LostItem extends Item {
    constructor(itemDescription, dateTime) {
        super(itemDescription, dateTime);  // Inheriting from Item
        this._status = 'Lost';  // Default status for Lost Item
    }

    // Method to mark the item as completed
    markAsCompleted() {
        this._status = 'Completed';
    }
}

// Class for handling Found Items (Inheritance from Item)
class FoundItem extends Item {
    constructor(itemDescription, dateTime) {
        super(itemDescription, dateTime);  // Inheriting from Item
        this._status = 'Found';  // Default status for Found Item
    }

    // Method to mark the item as completed
    markAsCompleted() {
        this._status = 'Completed';
    }
}

// UI Handling Class (Encapsulation and Logic for managing items)
class ItemManager {
    constructor() {
        this._lostItems = [];  // Private array to hold lost items
        this._foundItems = []; // Private array to hold found items
    }

    // Add a Lost Item to the list
    addLostItem(item) {
        this._lostItems.push(item);
        this.renderItems('lost');
    }

    // Add a Found Item to the list
    addFoundItem(item) {
        this._foundItems.push(item);
        this.renderItems('found');
    }

    // Render items on the webpage (Encapsulation)
    renderItems(type) {
        const list = type === 'lost' ? document.getElementById('lost-items-list') : document.getElementById('found-items-list');
        list.innerHTML = ''; // Clear the list before re-rendering

        const items = type === 'lost' ? this._lostItems : this._foundItems;
        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item.displayItem() + this.renderItemButtons(item);
            list.appendChild(li);
        });
    }

    // Function to render Done and Edit buttons
    renderItemButtons(item) {
        return `
            <button class="done-icon" onclick="markItemAsCompleted(${JSON.stringify(item)})">✔ Done</button>
            <button class="edit-icon" onclick="editItem(${JSON.stringify(item)})">✏️ Edit</button>
            <button class="delete-icon" onclick="confirmDeleteItem(${JSON.stringify(item)})">❌ Delete</button>
        `;
    }
}

// Functions to handle the icons' actions
function markItemAsCompleted(item) {
    item.markAsCompleted();
    itemManager.renderItems(item instanceof LostItem ? 'lost' : 'found');
}

function editItem(item) {
    const newDescription = prompt("Edit item description:", item.itemDescription);
    if (newDescription !== null && newDescription.trim() !== "") {
        item._itemDescription = newDescription;  // Modify the item's description
        itemManager.renderItems(item instanceof LostItem ? 'lost' : 'found');
    }
}

// Confirmation for deleting an item
function confirmDeleteItem(item) {
    const confirmation = confirm("Are you sure you want to delete this item?");
    if (confirmation) {
        deleteItem(item);
    }
}

// Delete the item from the list
function deleteItem(item) {
    if (item instanceof LostItem) {
        itemManager._lostItems = itemManager._lostItems.filter(i => i !== item);
        itemManager.renderItems('lost');
    } else if (item instanceof FoundItem) {
        itemManager._foundItems = itemManager._foundItems.filter(i => i !== item);
        itemManager.renderItems('found');
    }
}

// Initialize the ItemManager (Encapsulation)
const itemManager = new ItemManager();

// Handle Lost Item form submission
document.getElementById('lost-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const lostItemDescription = document.getElementById('lost-item').value;
    const lostDateTime = document.getElementById('date-time-input-lost').value;

    // Create a new LostItem instance and add to the list
    const lostItem = new LostItem(lostItemDescription, lostDateTime);
    itemManager.addLostItem(lostItem);

    document.getElementById('lost-form').reset();  // Clear the form
});

// Handle Found Item form submission
document.getElementById('found-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const foundItemDescription = document.getElementById('found-item').value;
    const foundDateTime = document.getElementById('date-time-input-found').value;

    // Create a new FoundItem instance and add to the list
    const foundItem = new FoundItem(foundItemDescription, foundDateTime);
    itemManager.addFoundItem(foundItem);

    document.getElementById('found-form').reset();  // Clear the form
});
