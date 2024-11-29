
class Item {
    constructor(itemDescription, dateTime) {
        this._itemDescription = itemDescription; 
        this._dateTime = dateTime; 
        this._status = ""; 
    }
    get itemDescription() {
        return this._itemDescription;
    }

    get dateTime() {
        return this._dateTime;
    }

    get status() {
        return this._status;
    }

    displayItem() {
        return `${this.itemDescription} (Reported at: ${this.dateTime}) - Status: ${this.status}`;
    }
}

class LostItem extends Item {
    constructor(itemDescription, dateTime) {
        super(itemDescription, dateTime); 
        this._status = "Lost"; 
    }

    markAsCompleted() {
        this._status = "Completed";
    }

    markAsFound() {
        this._status = "Found";
    }
}
class FoundItem extends Item {
    constructor(itemDescription, dateTime) {
        super(itemDescription, dateTime); // Inheriting from Item
        this._status = "Found"; 
    }
    // abstraction//
    markAsCompleted() {
        this._status = "Completed";
    }

    markAsLost() {
        this._status = "Lost";
    }
}

document.getElementById("lost-form").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const lostItemDescription = document.getElementById("lost-item").value;
    const lostItemDateTime = document.getElementById("date-time-input-lost").value;

    const lostItem = new LostItem(lostItemDescription, lostItemDateTime);

    const lostItemsList = document.getElementById("lost-items-list");
    const li = document.createElement("li");
    li.innerHTML = `${lostItem.displayItem()} <button onclick="markItemAsCompleted('lost')">Mark as Completed</button>`;
    lostItemsList.appendChild(li);

    document.getElementById("lost-form").reset();
});

document.getElementById("found-form").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const foundItemDescription = document.getElementById("found-item").value;
    const foundItemDateTime = document.getElementById("date-time-input-found").value;

    const foundItem = new FoundItem(foundItemDescription, foundItemDateTime);

    const foundItemsList = document.getElementById("found-items-list");
    const li = document.createElement("li");
    li.innerHTML = `${foundItem.displayItem()} <button onclick="markItemAsCompleted('found')">Mark as Completed</button>`;
    foundItemsList.appendChild(li);

    document.getElementById("found-form").reset();
});

function markItemAsCompleted(itemType) {
   
    const item = itemType === 'lost' ? lostItem : foundItem;
    item.markAsCompleted();
}
