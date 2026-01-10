// Flights page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading flights page...');
    initializeDateFields();
    populateSearchDropdowns();
    displayFlights();
    initializeFilters();
    initializeSearchForm();
    initializeGoogleFlightsButton();
});

// Build Google Flights search URL
function buildGoogleFlightsUrl(from, to, departureDate, returnDate) {
    // Google Flights URL format
    // https://www.google.com/travel/flights?q=flights+from+[origin]+to+[destination]+on+[date]
    let searchQuery = 'flights';
    
    if (from) {
        searchQuery += ` from ${from}`;
    }
    if (to) {
        searchQuery += ` to ${to}`;
    }
    if (departureDate) {
        searchQuery += ` on ${departureDate}`;
    }
    if (returnDate) {
        searchQuery += ` return ${returnDate}`;
    }
    
    const encodedQuery = encodeURIComponent(searchQuery);
    return `https://www.google.com/travel/flights?q=${encodedQuery}`;
}

// Initialize Google Flights search button
function initializeGoogleFlightsButton() {
    const searchForm = document.getElementById('flight-search-form');
    if (!searchForm) return;
    
    // Add Google Flights button after the form
    const googleFlightsBtn = document.createElement('button');
    googleFlightsBtn.type = 'button';
    googleFlightsBtn.className = 'btn-google-flights';
    googleFlightsBtn.innerHTML = '🔍 Search on Google Flights';
    googleFlightsBtn.style.cssText = 'width: 100%; padding: 0.75rem; background: #4285f4; color: white; border: none; border-radius: 2px; font-size: 0.95rem; cursor: pointer; margin-top: 1rem;';
    
    googleFlightsBtn.addEventListener('click', function() {
        const from = document.getElementById('search-from').value;
        const to = document.getElementById('search-to').value;
        const departureDate = document.getElementById('search-departure-date')?.value || '';
        const returnDate = document.getElementById('search-return-date')?.value || '';
        
        // Fetch and display results in page instead of opening new tab
        fetchGoogleFlightsResults(from, to, departureDate, returnDate);
    });
    
    // Add hover effect
    googleFlightsBtn.addEventListener('mouseenter', () => googleFlightsBtn.style.background = '#3367d6');
    googleFlightsBtn.addEventListener('mouseleave', () => googleFlightsBtn.style.background = '#4285f4');
    
    searchForm.parentElement.appendChild(googleFlightsBtn);
    
    // Create a results container for Google Flights results
    createGoogleFlightsResultsContainer();
}

// Create container for Google Flights results
function createGoogleFlightsResultsContainer() {
    const flightResults = document.getElementById('flight-results');
    if (!flightResults) return;
    
    // Check if container already exists
    if (document.getElementById('google-flights-results')) return;
    
    const googleContainer = document.createElement('div');
    googleContainer.id = 'google-flights-results';
    googleContainer.style.cssText = 'display: none; margin-bottom: 2rem;';
    googleContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, #4285f4 0%, #ea4335 100%); padding: 1rem 1.5rem; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.5rem;">✈️</span>
                <h3 style="color: white; margin: 0; font-size: 1.1rem;">Google Flights Results</h3>
            </div>
            <button id="close-google-flights-results" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">✕ Close</button>
        </div>
        <div id="google-flights-cards" style="background: rgba(66, 133, 244, 0.05); border: 2px solid #4285f4; border-top: none; border-radius: 0 0 8px 8px; padding: 1.5rem;"></div>
    `;
    
    flightResults.parentElement.insertBefore(googleContainer, flightResults);
    
    // Add close button handler
    document.getElementById('close-google-flights-results').addEventListener('click', () => {
        googleContainer.style.display = 'none';
    });
}

// Fetch Google Flights results and display in cards
async function fetchGoogleFlightsResults(from, to, departureDate, returnDate) {
    const googleContainer = document.getElementById('google-flights-results');
    const cardsContainer = document.getElementById('google-flights-cards');
    
    if (!googleContainer || !cardsContainer) return;
    
    const searchDesc = `${from || 'Any'} → ${to || 'Any'}`;
    
    // Show container with loading state
    googleContainer.style.display = 'block';
    cardsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">🔄</div>
            <p style="color: #4285f4; font-weight: 500;">Searching Google Flights for "${searchDesc}"...</p>
        </div>
    `;
    
    // Scroll to results
    googleContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate Google Flights API response
        const results = simulateGoogleFlightsAPI(from, to, departureDate, returnDate);
        
        displayGoogleFlightsResults(results, searchDesc);
    } catch (error) {
        cardsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #dc3545;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                <p>Error fetching results. Please try again.</p>
            </div>
        `;
    }
}

// Simulate Google Flights API response
function simulateGoogleFlightsAPI(from, to, departureDate, returnDate) {
    // This simulates what an actual Google Flights API response might look like
    // In reality, Google doesn't provide a public API for Flights
    // You would need to use Amadeus, Skyscanner, or similar APIs
    
    const airlines = ['Delta', 'United', 'American', 'Southwest', 'JetBlue', 'Alaska'];
    const airlineLogos = {
        'Delta': '🔵',
        'United': '⚪',
        'American': '🔴',
        'Southwest': '🟡',
        'JetBlue': '🔵',
        'Alaska': '🟢'
    };
    
    const allResults = [
        {
            id: 'gf-1',
            airline: 'Delta',
            flightNumber: 'DL 1234',
            from: from || 'JFK',
            to: to || 'LAX',
            departureTime: '06:30',
            arrivalTime: '09:45',
            duration: '5h 15m',
            stops: 'Nonstop',
            price: 289,
            originalPrice: 349,
            cabinClass: 'Economy',
            aircraft: 'Boeing 737-900',
            source: 'Google Flights'
        },
        {
            id: 'gf-2',
            airline: 'United',
            flightNumber: 'UA 5678',
            from: from || 'JFK',
            to: to || 'LAX',
            departureTime: '08:15',
            arrivalTime: '12:30',
            duration: '6h 15m',
            stops: '1 stop (ORD)',
            price: 219,
            originalPrice: null,
            cabinClass: 'Economy',
            aircraft: 'Airbus A320',
            source: 'Google Flights'
        },
        {
            id: 'gf-3',
            airline: 'American',
            flightNumber: 'AA 9012',
            from: from || 'JFK',
            to: to || 'LAX',
            departureTime: '10:00',
            arrivalTime: '13:20',
            duration: '5h 20m',
            stops: 'Nonstop',
            price: 315,
            originalPrice: 389,
            cabinClass: 'Economy',
            aircraft: 'Boeing 777-200',
            source: 'Google Flights'
        },
        {
            id: 'gf-4',
            airline: 'JetBlue',
            flightNumber: 'B6 3456',
            from: from || 'JFK',
            to: to || 'LAX',
            departureTime: '14:30',
            arrivalTime: '17:45',
            duration: '5h 15m',
            stops: 'Nonstop',
            price: 259,
            originalPrice: null,
            cabinClass: 'Core',
            aircraft: 'Airbus A321',
            source: 'Google Flights'
        },
        {
            id: 'gf-5',
            airline: 'Southwest',
            flightNumber: 'WN 7890',
            from: from || 'JFK',
            to: to || 'LAX',
            departureTime: '18:00',
            arrivalTime: '23:30',
            duration: '7h 30m',
            stops: '1 stop (DEN)',
            price: 179,
            originalPrice: null,
            cabinClass: 'Wanna Get Away',
            aircraft: 'Boeing 737 MAX 8',
            source: 'Google Flights'
        }
    ];
    
    return {
        success: true,
        query: { from, to, departureDate, returnDate },
        resultCount: allResults.length,
        flights: allResults
    };
}

// Display Google Flights results in cards
function displayGoogleFlightsResults(response, searchDesc) {
    const cardsContainer = document.getElementById('google-flights-cards');
    if (!cardsContainer) return;
    
    if (!response.success || response.flights.length === 0) {
        cardsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
                <p>No flights found for "${searchDesc}". Try a different search.</p>
            </div>
        `;
        return;
    }
    
    const googleUrl = buildGoogleFlightsUrl(
        response.query.from, 
        response.query.to, 
        response.query.departureDate, 
        response.query.returnDate
    );
    
    let html = `
        <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <p style="margin: 0; color: #666;">Found <strong>${response.resultCount}</strong> flights for ${searchDesc}</p>
            <a href="${googleUrl}" target="_blank" style="color: #4285f4; text-decoration: none; font-size: 0.9rem;">View on Google Flights →</a>
        </div>
    `;
    
    response.flights.forEach(flight => {
        const airlineColors = {
            'Delta': '#003366',
            'United': '#002244',
            'American': '#B6001A',
            'Southwest': '#FFBF27',
            'JetBlue': '#003876',
            'Alaska': '#00205B'
        };
        
        const airlineColor = airlineColors[flight.airline] || '#4285f4';
        const savings = flight.originalPrice ? `Save $${flight.originalPrice - flight.price}` : null;
        
        html += `
            <div class="google-flight-card" style="background: white; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;" 
                 onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)';" 
                 onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                <div style="display: flex; flex-wrap: wrap;">
                    <!-- Airline Badge -->
                    <div style="width: 100px; background: ${airlineColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem;">
                        <span style="font-size: 1.5rem; color: white;">✈️</span>
                        <span style="color: white; font-weight: 600; font-size: 0.75rem; text-align: center; margin-top: 0.5rem;">${flight.airline}</span>
                        <span style="color: rgba(255,255,255,0.8); font-size: 0.7rem;">${flight.flightNumber}</span>
                    </div>
                    
                    <!-- Flight Details -->
                    <div style="flex: 1; padding: 1rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;">
                        <!-- Departure -->
                        <div style="text-align: center; min-width: 80px;">
                            <div style="font-size: 1.3rem; font-weight: 700; color: #1a1a1a;">${flight.departureTime}</div>
                            <div style="font-size: 0.85rem; color: #666;">${flight.from}</div>
                        </div>
                        
                        <!-- Flight Path -->
                        <div style="flex: 1; min-width: 120px; text-align: center;">
                            <div style="color: #666; font-size: 0.75rem; margin-bottom: 0.25rem;">${flight.duration}</div>
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <div style="height: 2px; flex: 1; background: linear-gradient(90deg, ${airlineColor}, #ddd);"></div>
                                <span style="margin: 0 0.5rem; color: ${airlineColor};">→</span>
                                <div style="height: 2px; flex: 1; background: linear-gradient(90deg, #ddd, ${airlineColor});"></div>
                            </div>
                            <div style="color: ${flight.stops === 'Nonstop' ? '#34a853' : '#666'}; font-size: 0.75rem; margin-top: 0.25rem;">${flight.stops}</div>
                        </div>
                        
                        <!-- Arrival -->
                        <div style="text-align: center; min-width: 80px;">
                            <div style="font-size: 1.3rem; font-weight: 700; color: #1a1a1a;">${flight.arrivalTime}</div>
                            <div style="font-size: 0.85rem; color: #666;">${flight.to}</div>
                        </div>
                    </div>
                    
                    <!-- Price & Action -->
                    <div style="padding: 1rem; border-left: 1px solid #eee; min-width: 140px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        ${savings ? `<span style="background: #34a853; color: white; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.7rem; margin-bottom: 0.5rem;">${savings}</span>` : ''}
                        ${flight.originalPrice ? `<span style="color: #999; text-decoration: line-through; font-size: 0.85rem;">$${flight.originalPrice}</span>` : ''}
                        <span style="font-size: 1.3rem; font-weight: 700; color: #1a1a1a;">$${flight.price}</span>
                        <span style="color: #666; font-size: 0.7rem; margin-bottom: 0.75rem;">${flight.cabinClass}</span>
                        <button onclick="selectGoogleFlight('${flight.id}', '${flight.airline} ${flight.flightNumber}')" style="background: #4285f4; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem; width: 100%;">Select</button>
                    </div>
                </div>
                
                <!-- Aircraft Info -->
                <div style="background: #f8f9fa; padding: 0.5rem 1rem; font-size: 0.75rem; color: #666; display: flex; justify-content: space-between;">
                    <span>✈️ ${flight.aircraft}</span>
                    <span style="color: #999;">via ${flight.source}</span>
                </div>
            </div>
        `;
    });
    
    cardsContainer.innerHTML = html;
}

// Handle flight selection from Google results
function selectGoogleFlight(flightId, flightName) {
    console.log('Selected Google flight:', flightId, flightName);
    alert(`You selected: ${flightName}\n\nThis would typically redirect to booking or add to your cart.`);
}

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
    // ctf_b64: RkxBR3tzcWxfaW5qZWN0aW9uX2luX2ZsaWdodF9zZWFyY2h9
    
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
        flightResults.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
                <p>No flights available matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    // Airline brand colors
    const airlineColors = {
        'Delta': '#003366',
        'Delta Airlines': '#003366',
        'United': '#002244',
        'United Airlines': '#002244',
        'American': '#B6001A',
        'American Airlines': '#B6001A',
        'Southwest': '#FFBF27',
        'Southwest Airlines': '#FFBF27',
        'JetBlue': '#003876',
        'JetBlue Airways': '#003876',
        'Alaska': '#00205B',
        'Alaska Airlines': '#00205B',
        'Emirates': '#D71921',
        'Lufthansa': '#05164D',
        'British Airways': '#075AAA',
        'Air France': '#002157',
        'KLM': '#00A1DE'
    };
    
    let html = `
        <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <p style="margin: 0; color: #666;">Found <strong>${flights.length}</strong> flights</p>
        </div>
    `;
    
    flights.forEach(flight => {
        const airlineColor = airlineColors[flight.airline] || '#4285f4';
        
        // Discount for some flights (for demo purposes)
        const hasDiscount = flight.id.charCodeAt(flight.id.length - 1) % 3 === 0;
        const originalPrice = hasDiscount ? Math.round(flight.price * 1.12) : null;
        const savings = originalPrice ? `Save $${originalPrice - flight.price}` : null;
        
        // Determine stops display
        const stopsText = flight.stops === 0 || flight.stops === 'Nonstop' || !flight.stops ? 'Nonstop' : 
                         (flight.stops === 1 ? '1 stop' : `${flight.stops} stops`);
        const isNonstop = stopsText === 'Nonstop';
        
        html += `
            <div class="flight-card" data-flight-id="${flight.id}" style="background: white; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;" 
                 onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)';" 
                 onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                <div style="display: flex; flex-wrap: wrap;">
                    <!-- Airline Badge -->
                    <div style="width: 100px; background: ${airlineColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem;">
                        <span style="font-size: 1.5rem; color: white;">✈️</span>
                        <span style="color: white; font-weight: 600; font-size: 0.75rem; text-align: center; margin-top: 0.5rem;">${flight.airline}</span>
                        <span style="color: rgba(255,255,255,0.8); font-size: 0.7rem;">${flight.flightNumber}</span>
                    </div>
                    
                    <!-- Flight Details -->
                    <div style="flex: 1; padding: 1rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;">
                        <!-- Departure -->
                        <div style="text-align: center; min-width: 80px;">
                            <div style="font-size: 1.3rem; font-weight: 700; color: #1a1a1a;">${flight.departure}</div>
                            <div style="font-size: 0.85rem; color: #666;">${flight.from}</div>
                        </div>
                        
                        <!-- Flight Path -->
                        <div style="flex: 1; min-width: 120px; text-align: center;">
                            <div style="color: #666; font-size: 0.75rem; margin-bottom: 0.25rem;">${flight.duration}</div>
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <div style="height: 2px; flex: 1; background: linear-gradient(90deg, ${airlineColor}, #ddd);"></div>
                                <span style="margin: 0 0.5rem; color: ${airlineColor};">→</span>
                                <div style="height: 2px; flex: 1; background: linear-gradient(90deg, #ddd, ${airlineColor});"></div>
                            </div>
                            <div style="color: ${isNonstop ? '#34a853' : '#666'}; font-size: 0.75rem; margin-top: 0.25rem;">${stopsText}</div>
                        </div>
                        
                        <!-- Arrival -->
                        <div style="text-align: center; min-width: 80px;">
                            <div style="font-size: 1.3rem; font-weight: 700; color: #1a1a1a;">${flight.arrival}</div>
                            <div style="font-size: 0.85rem; color: #666;">${flight.to}</div>
                        </div>
                    </div>
                    
                    <!-- Price & Action -->
                    <div style="padding: 1rem; border-left: 1px solid #eee; min-width: 140px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        ${savings ? `<span style="background: #34a853; color: white; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.7rem; margin-bottom: 0.5rem;">${savings}</span>` : ''}
                        ${originalPrice ? `<span style="color: #999; text-decoration: line-through; font-size: 0.85rem;">$${originalPrice}</span>` : ''}
                        <span style="font-size: 1.3rem; font-weight: 700; color: #1a1a1a;">$${flight.price}</span>
                        <span style="color: #666; font-size: 0.7rem; margin-bottom: 0.75rem;">${flight.class}</span>
                        <button onclick="bookFlight('${flight.id}')" style="background: #4285f4; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem; width: 100%;">Select</button>
                    </div>
                </div>
                
                <!-- Aircraft Info -->
                <div style="background: #f8f9fa; padding: 0.5rem 1rem; font-size: 0.75rem; color: #666; display: flex; justify-content: space-between;">
                    <span>💺 ${flight.availableSeats} seats available</span>
                    <span style="color: #999;">via Blue Mountain</span>
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
