// Flights page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading flights page...');
    populateSearchDropdowns();
    displayFlights();
    initializeFilters();
    initializeSearchForm();
});

// Populate search dropdowns with unique cities and airlines
function populateSearchDropdowns() {
    const flights = window.FlightData || [];
    
    // Get unique cities
    const fromCities = new Set();
    const toCities = new Set();
    const airlines = new Set();
    
    flights.forEach(flight => {
        fromCities.add(flight.from);
        toCities.add(flight.to);
        airlines.add(flight.airline);
    });
    
    // Populate "From" dropdown
    const fromSelect = document.getElementById('search-from');
    Array.from(fromCities).sort().forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        fromSelect.appendChild(option);
    });
    
    // Populate "To" dropdown
    const toSelect = document.getElementById('search-to');
    Array.from(toCities).sort().forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        toSelect.appendChild(option);
    });
    
    // Populate "Airline" dropdown
    const airlineSelect = document.getElementById('search-airline');
    Array.from(airlines).sort().forEach(airline => {
        const option = document.createElement('option');
        option.value = airline;
        option.textContent = airline;
        airlineSelect.appendChild(option);
    });
    
    console.log(`Loaded ${fromCities.size} departure cities, ${toCities.size} destination cities, and ${airlines.size} airlines`);
}

// Initialize search form
function initializeSearchForm() {
    const searchForm = document.getElementById('flight-search-form');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        searchFlights();
    });
}

// Search flights based on criteria
function searchFlights() {
    const from = document.getElementById('search-from').value;
    const to = document.getElementById('search-to').value;
    const airline = document.getElementById('search-airline').value;
    
    console.log('Searching flights:', { from, to, airline });
    
    // Filter flights
    let filteredFlights = window.FlightData || [];
    
    if (from) {
        filteredFlights = filteredFlights.filter(f => f.from === from);
    }
    if (to) {
        filteredFlights = filteredFlights.filter(f => f.to === to);
    }
    if (airline) {
        filteredFlights = filteredFlights.filter(f => f.airline === airline);
    }
    
    console.log(`Found ${filteredFlights.length} flights matching criteria`);
    displayFlights(filteredFlights);
}

function displayFlights(flightsToDisplay) {
    const flightResults = document.getElementById('flight-results');
    
    if (!flightResults) return;
    
    const flights = flightsToDisplay || window.FlightData || [];
    
    if (flights.length === 0) {
        flightResults.innerHTML = '<p>No flights available matching your criteria.</p>';
        return;
    }
    
    let html = `<h2 class="text-primary mb-2">Available Flights (${flights.length} results)</h2>`;
    
    flights.forEach(flight => {
        html += `
            <div class="flight-card" data-flight-id="${flight.id}">
                <div class="flight-header">
                    <div>
                        <h3 class="airline-name">${flight.airline}</h3>
                        <p class="text-muted">Flight ${flight.flightNumber}</p>
                    </div>
                    <div class="price-section">
                        <div class="price">$${flight.price}</div>
                        <div class="price-label">per person</div>
                        <button class="btn-book" onclick="bookFlight('${flight.id}')">Book Now</button>
                    </div>
                </div>
                <div class="flight-details">
                    <div class="flight-info">
                        <p><strong>Route:</strong> ${flight.from} → ${flight.to}</p>
                        <p><strong>Departure:</strong> ${flight.departure}</p>
                        <p><strong>Arrival:</strong> ${flight.arrival}</p>
                    </div>
                    <div class="flight-info">
                        <p><strong>Duration:</strong> ${flight.duration}</p>
                        <p><strong>Class:</strong> ${flight.class}</p>
                        <p><strong>Available Seats:</strong> ${flight.availableSeats}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    flightResults.innerHTML = html;
}

function initializeFilters() {
    const filterInputs = document.querySelectorAll('.checkbox-group input');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            console.log('Filter changed:', this.name, this.value, this.checked);
            applyFilters();
        });
    });
}

function applyFilters() {
    const priceFilters = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(input => input.value);
    const airlineFilters = Array.from(document.querySelectorAll('input[name="airline"]:checked')).map(input => input.value);
    const timeFilters = Array.from(document.querySelectorAll('input[name="time"]:checked')).map(input => input.value);
    const stopsFilters = Array.from(document.querySelectorAll('input[name="stops"]:checked')).map(input => input.value);
    
    console.log('Active filters:', { priceFilters, airlineFilters, timeFilters, stopsFilters });
    
    // For now, just log filters. In a real app, this would filter the displayed flights
    const flightCards = document.querySelectorAll('.flight-card');
    
    flightCards.forEach(card => {
        let show = true;
        
        // Apply airline filter
        if (airlineFilters.length > 0) {
            const airlineName = card.querySelector('.airline-name').textContent.toLowerCase();
            show = airlineFilters.some(filter => airlineName.includes(filter));
        }
        
        // Apply price filter
        if (show && priceFilters.length > 0) {
            const price = parseInt(card.querySelector('.price').textContent.replace('$', ''));
            show = priceFilters.some(filter => {
                if (filter === '0-500') return price < 500;
                if (filter === '500-1000') return price >= 500 && price <= 1000;
                if (filter === '1000+') return price > 1000;
                return true;
            });
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Redirect to booking page to fill in user details
function bookFlight(flightId) {
    const flight = window.FlightData.find(f => f.id === flightId);
    
    if (!flight) {
        alert('Flight not found');
        return;
    }
    
    // Redirect to the booking page with flight ID
    window.location.href = `book-flight.html?id=${flightId}`;
}

// Make bookFlight available globally
window.bookFlight = bookFlight;
