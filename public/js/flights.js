// Flights page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading flights page...');
    initializeDateFields();
    populateSearchDropdowns();
    displayFlights();
    initializeFilters();
    initializeSearchForm();
});

// Initialize date fields with minimum dates
function initializeDateFields() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    const departureDateField = document.getElementById('search-departure-date');
    const returnDateField = document.getElementById('search-return-date');
    
    if (departureDateField) {
        departureDateField.min = formatDate(today);
        departureDateField.value = formatDate(tomorrow);
    }
    if (returnDateField) {
        returnDateField.min = formatDate(today);
    }
    
    // Update return date minimum when departure date changes
    if (departureDateField && returnDateField) {
        departureDateField.addEventListener('change', function() {
            const departureDate = new Date(this.value);
            returnDateField.min = this.value;
            
            // If return date is before new departure date, clear it
            if (returnDateField.value && new Date(returnDateField.value) <= departureDate) {
                returnDateField.value = '';
            }
        });
    }
}

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
// ⚠️ VULNERABILITY: SQL Injection in search function
function searchFlights() {
    const from = document.getElementById('search-from').value;
    const to = document.getElementById('search-to').value;
    const airline = document.getElementById('search-airline').value;
    const departureDate = document.getElementById('search-departure-date')?.value || '';
    const returnDate = document.getElementById('search-return-date')?.value || '';
    
    console.log('Searching flights:', { from, to, airline, departureDate, returnDate });
    
    // ⚠️ VULNERABILITY: Constructing SQL query with user input (simulated)
    // In a real backend, this would lead to SQL injection
    const sqlQuery = buildVulnerableSQLQuery(from, to, airline, departureDate, returnDate);
    console.log('⚠️ VULNERABLE SQL QUERY:', sqlQuery);
    console.log('⚠️ This query is vulnerable to SQL injection!');
    console.log('FLAG{sql_injection_in_flight_search}');
    
    // Simulate executing the vulnerable query
    let filteredFlights = executeVulnerableQuery(sqlQuery);
    
    console.log(`Found ${filteredFlights.length} flights matching criteria`);
    displayFlights(filteredFlights);
}

// ⚠️ VULNERABILITY: Building SQL query without parameterization
function buildVulnerableSQLQuery(from, to, airline, departureDate, returnDate) {
    // This simulates a vulnerable backend SQL query construction
    let query = "SELECT * FROM Flights WHERE 1=1";
    
    if (from) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND departure_city = '${from}'`;
    }
    if (to) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND arrival_city = '${to}'`;
    }
    if (airline) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND airline_name = '${airline}'`;
    }
    if (departureDate) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND departure_date >= '${departureDate}'`;
    }
    if (returnDate) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND return_date <= '${returnDate}'`;
    }
    
    query += " ORDER BY price ASC";
    
    return query;
}

// ⚠️ VULNERABILITY: Simulated vulnerable query execution
function executeVulnerableQuery(sqlQuery) {
    // In a real application, this would execute against a database
    // For this demo, we'll parse the query and filter client-side data
    console.log('Executing vulnerable query against database...');
    console.log('Connection string:', window.AzureConfig?.databaseConfig?.connectionString || 'bluemountaintravel.database.windows.net');
    
    let filteredFlights = window.FlightData || [];
    
    // Extract search parameters from the SQL query (simulation)
    const fromMatch = sqlQuery.match(/departure_city = '([^']*)'/);
    const toMatch = sqlQuery.match(/arrival_city = '([^']*)'/);
    const airlineMatch = sqlQuery.match(/airline_name = '([^']*)'/);
    const departureDateMatch = sqlQuery.match(/departure_date >= '([^']*)'/);
    
    if (fromMatch && fromMatch[1]) {
        filteredFlights = filteredFlights.filter(f => f.from.includes(fromMatch[1]));
    }
    if (toMatch && toMatch[1]) {
        filteredFlights = filteredFlights.filter(f => f.to.includes(toMatch[1]));
    }
    if (airlineMatch && airlineMatch[1]) {
        filteredFlights = filteredFlights.filter(f => f.airline.includes(airlineMatch[1]));
    }
    if (departureDateMatch && departureDateMatch[1]) {
        // Filter flights based on date (for demo, all flights are available)
        console.log(`Filtering flights for date: ${departureDateMatch[1]}`);
    }
    
    return filteredFlights;
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
