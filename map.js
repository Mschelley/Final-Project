
const locationImages = {
    'SC Building': 'harve.jpg', 
    'NBSC Administration': 'harve.jpg',
    'BSBA Building': 'harve.jpg',
    'TEP Department': 'harve.jpg',
    'CSS Building': 'harve.jpg',
    'GSC Building': 'harve.jpg',
    'Covered Court': 'harve.jpg',
    'billing': 'harve.jpg'
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

  
        document.getElementById('lost-form').addEventListener('submit', function(event) {
            event.preventDefault();
    
            const itemDescription = document.getElementById('lost-item').value;
            const lostLocation = document.getElementById('lost-location').value;
            const lostDateTime = document.getElementById('lost-date-time').value;
    
            if (!itemDescription || !lostLocation || !lostDateTime) {
                alert('Please fill in all fields.');
                return;
            }
    
            const button = document.getElementById(`${lostLocation.toLowerCase().replace(' ', '-')}-btn`);
            const newLostItemText = document.createElement('div');
            newLostItemText.textContent = `Lost: ${itemDescription} on ${lostDateTime}`;
            button.appendChild(newLostItemText);
    
      
            const foundItemSelect = document.getElementById('found-item');
            const option = document.createElement('option');
            option.value = itemDescription;
            option.textContent = `${itemDescription} (Lost at ${lostLocation})`;
            foundItemSelect.appendChild(option);
    

            const lostItemsList = document.getElementById('lost-items-list');
            const lostItem = document.createElement('div');
            lostItem.classList.add('list-item');
            lostItem.innerHTML = `<p><span class="location">${lostLocation}</span>: ${itemDescription} on ${lostDateTime}</p>`;
            lostItemsList.appendChild(lostItem);
    
         
            alert('Lost item submitted successfully.');
            document.getElementById('lost-form').reset();
        });
    
      
        document.getElementById('found-form').addEventListener('submit', function(event) {
            event.preventDefault();
    
            const foundItemDescription = document.getElementById('found-item').value;
            const foundLocation = document.getElementById('found-location').value;
            const foundDateTime = document.getElementById('found-date-time').value;
    
            if (!foundItemDescription || !foundLocation || !foundDateTime) {
                alert('Please fill in all fields.');
                return;
            }
    

            alert(`Found item: ${foundItemDescription} at ${foundLocation} on ${foundDateTime}`);
    
            const foundItemsList = document.getElementById('found-items-list');
            const foundItem = document.createElement('div');
            foundItem.classList.add('list-item');
            foundItem.innerHTML = `<p><span class="location">${foundLocation}</span>: ${foundItemDescription} on ${foundDateTime}</p>`;
            foundItemsList.appendChild(foundItem);
    
           
            const foundItemSelect = document.getElementById('found-item');
            const options = foundItemSelect.querySelectorAll('option');
            options.forEach(option => {
                if (option.value === foundItemDescription) {
                    option.remove();
                }
            });
    
            
            const button = document.getElementById(`${foundLocation.toLowerCase().replace(' ', '-')}-btn`);
            const buttonText = button.querySelector('div');
            if (buttonText) {
                buttonText.remove();
            }
    
        
            alert('Found item submitted successfully.');
            document.getElementById('found-form').reset();
        });