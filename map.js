const locationImages = {
    'SC Building': 'NBSC_BUILDING.jpeg', 
    'NBSC Administration': 'particlesjs-examples.gif',
    'BSBA Building': 'BSBA.jpeg',
    'TEP Department': 'tep.jpeg',
    'CSS Building': 'ccs_department.jpeg',
    'GEC Building': 'GEC.jpeg',
    'Covered Court': 'GYM.jpeg',
    'billing': 'billing.jpeg'
};

class MapHandler {
    constructor(mapElementId, initialCoords, initialZoomLevel) {
        this.mapInstance = L.map(mapElementId).setView(initialCoords, initialZoomLevel);
        this.setupTileLayer();
        this.markerList = [];
        this.markerLocations = {}; 
        this.markerPopups = {};  
        this.hasZoomed = false;
    }

    setupTileLayer() {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.mapInstance);
    }

    addMapMarker(latitude, longitude, label) {
        const marker = L.marker([latitude, longitude]).addTo(this.mapInstance);
        this.markerLocations[label] = { latitude, longitude };
        
        const imageUrl = locationImages[label];
        const popupContent = `
            <div style="text-align: center;">
                <h5>${label}</h5>
                <p>Location Area: ${label}</p>
                ${imageUrl ? `<img src="${imageUrl}" alt="${label}" style="width: 250px; height: 200px; border-radius: 8px;"/>` : ''}
            </div>
        `;
        marker.bindPopup(popupContent);
        this.markerPopups[label] = marker.getPopup();
        this.markerList.push(marker);
    }

    moveToMarker(label) {
        const location = this.markerLocations[label];
        if (location) {
            const currentZoom = this.mapInstance.getZoom();
            let newZoom = currentZoom;

            if (!this.hasZoomed) {
                newZoom = Math.min(currentZoom + 1, 20);
                this.hasZoomed = true;
            }

            this.mapInstance.flyTo([location.latitude, location.longitude], newZoom, {
                duration: 1.5
            });

            const popup = this.markerPopups[label];
            if (popup) {
                popup.setLatLng([location.latitude, location.longitude]);
                popup.openOn(this.mapInstance);
            }
        }
    }

    loadMarkers(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(entry => {
                    this.addMapMarker(entry.latitude, entry.longitude, entry.message);
                });
            })
            .catch(error => console.error("Error loading markers:", error));
    }
}

const mapInstance = new MapHandler('map', [8.359735, 124.869206], 17);

document.addEventListener('DOMContentLoaded', () => {
    mapInstance.loadMarkers('map.json');

    const buttons = document.querySelectorAll('.btn-container button');
    buttons.forEach((button, index) => {
        const markerLabel = button.innerText.trim();
        button.addEventListener('click', () => {
            mapInstance.moveToMarker(markerLabel);
        });
    });
});

// Handling Lost and Found Form Submissions
document.getElementById('item-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const itemDescription = document.getElementById('item-description').value;
    const location = document.getElementById('item-location').value;
    const dateTime = document.getElementById('item-date-time').value;
    const itemType = document.querySelector('input[name="item-type"]:checked').value; // Lost or Found

    if (!itemDescription || !location || !dateTime) {
        alert('Please fill in all fields.');
        return;
    }

    // Add item to list and button based on whether it's Lost or Found
    const button = document.getElementById(`${location.toLowerCase().replace(' ', '-')}-btn`);
    const newItemText = document.createElement('div');
    newItemText.textContent = `${itemType}: ${itemDescription} on ${dateTime}`;
    button.appendChild(newItemText);

    const itemList = itemType === 'Lost' ? document.getElementById('lost-items-list') : document.getElementById('found-items-list');
    const newItem = document.createElement('div');
    newItem.classList.add('list-item');
    newItem.innerHTML = `<p><span class="location">${location}</span>: ${itemDescription} on ${dateTime}</p>`;
    itemList.appendChild(newItem);

    // Display confirmation message
    alert(`${itemType} item submitted successfully.`);
    document.getElementById('item-form').reset();
});
