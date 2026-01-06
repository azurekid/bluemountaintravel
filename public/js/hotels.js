// Hotels page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading hotels page...');
    initializeDateFields();
    initializeHotelSearch();
    displayHotels();
    initializeFilters();
});

// Initialize date fields with minimum dates
function initializeDateFields() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    const checkInField = document.getElementById('search-checkin');
    const checkOutField = document.getElementById('search-checkout');
    
    if (checkInField) {
        checkInField.min = formatDate(today);
        checkInField.value = formatDate(tomorrow);
    }
    if (checkOutField) {
        checkOutField.min = formatDate(tomorrow);
        checkOutField.value = formatDate(nextWeek);
    }
    
    // Update check-out date minimum when check-in date changes
    if (checkInField && checkOutField) {
        checkInField.addEventListener('change', function() {
            const checkInDate = new Date(this.value);
            const minCheckOut = new Date(checkInDate);
            minCheckOut.setDate(minCheckOut.getDate() + 1);
            checkOutField.min = formatDate(minCheckOut);
            
            // If check-out date is before new check-in date, update it
            if (checkOutField.value && new Date(checkOutField.value) <= checkInDate) {
                checkOutField.value = formatDate(minCheckOut);
            }
        });
    }
}

// Initialize hotel search form with SQL injection vulnerability
function initializeHotelSearch() {
    const searchForm = document.getElementById('hotel-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchHotels();
        });
    }
}

// ⚠️ VULNERABILITY: Search hotels with SQL injection
function searchHotels() {
    const location = document.getElementById('search-location')?.value || '';
    const checkIn = document.getElementById('search-checkin')?.value || '';
    const checkOut = document.getElementById('search-checkout')?.value || '';
    
    console.log('Searching hotels:', { location, checkIn, checkOut });
    
    // ⚠️ VULNERABILITY: Constructing SQL query with user input (simulated)
    const sqlQuery = buildVulnerableHotelSQLQuery(location, checkIn, checkOut);
    console.log('⚠️ VULNERABLE SQL QUERY:', sqlQuery);
    console.log('⚠️ This query is vulnerable to SQL injection!');
    console.log('FLAG{sql_injection_in_hotel_search}');
    
    // Simulate executing the vulnerable query
    let filteredHotels = executeVulnerableHotelQuery(sqlQuery);
    
    console.log(`Found ${filteredHotels.length} hotels matching criteria`);
    displayHotels(filteredHotels);
}

// ⚠️ VULNERABILITY: Building SQL query without parameterization
function buildVulnerableHotelSQLQuery(location, checkIn, checkOut) {
    // This simulates a vulnerable backend SQL query construction
    let query = "SELECT * FROM Hotels WHERE available = 1";
    
    if (location) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND (city LIKE '%${location}%' OR name LIKE '%${location}%')`;
    }
    if (checkIn) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND check_in_date >= '${checkIn}'`;
    }
    if (checkOut) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND check_out_date <= '${checkOut}'`;
    }
    
    query += " ORDER BY rating DESC";
    
    return query;
}

// ⚠️ VULNERABILITY: Simulated vulnerable query execution
function executeVulnerableHotelQuery(sqlQuery) {
    console.log('Executing vulnerable query against database...');
    console.log('Connection string:', window.AzureConfig?.databaseConfig?.connectionString || 'bluemountaintravel.database.windows.net');
    
    let filteredHotels = window.HotelData || [];
    
    // Extract search parameters from the SQL query (simulation)
    const locationMatch = sqlQuery.match(/LIKE '%([^%]*)%'/);
    
    if (locationMatch && locationMatch[1]) {
        const searchTerm = locationMatch[1].toLowerCase();
        filteredHotels = filteredHotels.filter(h => 
            h.location.toLowerCase().includes(searchTerm) || 
            h.name.toLowerCase().includes(searchTerm)
        );
    }
    
    return filteredHotels;
}

function displayHotels(hotelsToDisplay) {
    const hotelResults = document.getElementById('hotel-results');
    
    if (!hotelResults) return;
    
    const hotels = hotelsToDisplay || window.HotelData || [];
    
    if (hotels.length === 0) {
        hotelResults.innerHTML = '<p>No hotels available at this time.</p>';
        return;
    }
    
    // Hotel image URLs from Unsplash - realistic hotel photos
    const hotelImages = {
        'HT001': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', // Grand Hyatt New York
        'HT002': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', // The Ritz-Carlton London
        'HT003': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', // Park Hyatt Tokyo
        'HT004': 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80', // Four Seasons George V Paris
        'HT005': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', // Burj Al Arab Jumeirah
        'HT006': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'  // Marina Bay Sands
    };
    
    let html = '<h2 class="text-primary mb-2">Available Hotels</h2>';
    
    hotels.forEach(hotel => {
        const stars = '⭐'.repeat(hotel.rating);
        const imageUrl = hotelImages[hotel.id] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
        
        // Create amenity badges
        const amenitiesBadges = hotel.amenities.map(amenity => 
            `<span class="amenity-badge">${amenity}</span>`
        ).join('');
        
        html += `
            <div class="hotel-card" data-hotel-id="${hotel.id}" style="cursor: pointer;" onclick="window.location.href='hotel-detail.html?id=${hotel.id}'">
                <div class="hotel-image">
                    <img src="${imageUrl}" alt="${hotel.name}" loading="lazy" />
                    <div class="hotel-rating">${stars} ${hotel.rating} Star</div>
                </div>
                <div class="hotel-content">
                    <div class="hotel-header">
                        <h3 class="hotel-name">${hotel.name}</h3>
                        <p class="hotel-location">📍 ${hotel.location}</p>
                    </div>
                    <div class="hotel-details">
                        <p><strong>Room Type:</strong> ${hotel.roomType}</p>
                        <p><strong>Amenities:</strong></p>
                        <div class="hotel-amenities">
                            ${amenitiesBadges}
                        </div>
                        <p><strong>Status:</strong> <span class="status-available">✓ Available</span></p>
                    </div>
                    <div class="hotel-footer">
                        <div class="hotel-price">
                            <span class="price-amount">$${hotel.price}</span>
                            <span class="price-label">per night</span>
                        </div>
                        <button class="btn-book" onclick="event.stopPropagation(); bookHotel('${hotel.id}')">Book Now</button>
                        <button class="btn-search" onclick="event.stopPropagation(); window.location.href='hotel-detail.html?id=${hotel.id}'" style="margin-left: 0.5rem;">View Details</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    hotelResults.innerHTML = html;
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
    const ratingFilters = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(input => input.value);
    const amenityFilters = Array.from(document.querySelectorAll('input[name="amenity"]:checked')).map(input => input.value);
    const locationFilters = Array.from(document.querySelectorAll('input[name="location"]:checked')).map(input => input.value);
    
    console.log('Active filters:', { priceFilters, ratingFilters, amenityFilters, locationFilters });
    
    const hotelCards = document.querySelectorAll('.hotel-card');
    
    hotelCards.forEach(card => {
        let show = true;
        
        // Apply price filter
        if (priceFilters.length > 0) {
            const priceElement = card.querySelector('.price-amount');
            if (priceElement) {
                const priceText = priceElement.textContent.replace('$', '').trim();
                const price = parseInt(priceText, 10);
                if (!isNaN(price)) {
                    show = priceFilters.some(filter => {
                        if (filter === '0-300') return price < 300;
                        if (filter === '300-500') return price >= 300 && price <= 500;
                        if (filter === '500+') return price > 500;
                        return true;
                    });
                }
            }
        }
        
        if (show) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Redirect to booking page to fill in user details
function bookHotel(hotelId) {
    const hotel = window.HotelData.find(h => h.id === hotelId);
    
    if (!hotel) {
        alert('Hotel not found');
        return;
    }
    
    // Redirect to the booking page with hotel ID
    window.location.href = `book-hotel.html?id=${hotelId}`;
}

// Make bookHotel available globally
window.bookHotel = bookHotel;
