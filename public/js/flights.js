// Flights page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading flights page...');
    displayFlights();
    initializeFilters();
});

function displayFlights() {
    const flightResults = document.getElementById('flight-results');
    
    if (!flightResults) return;
    
    const flights = window.FlightData || [];
    
    if (flights.length === 0) {
        flightResults.innerHTML = '<p>No flights available at this time.</p>';
        return;
    }
    
    let html = '<h2 class="text-primary mb-2">Available Flights</h2>';
    
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

// ⚠️ VULNERABILITY: Booking function that exposes sensitive data
function bookFlight(flightId) {
    const flight = window.FlightData.find(f => f.id === flightId);
    
    if (!flight) {
        alert('Flight not found');
        return;
    }
    
    const user = window.getCurrentUser ? getCurrentUser() : null;
    
    // ⚠️ VULNERABILITY: Creating booking with exposed SAS token
    const bookingData = {
        bookingId: 'BK' + Date.now(),
        flightId: flight.id,
        flight: flight,
        user: user, // ⚠️ Contains sensitive user data
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        // ⚠️ VULNERABILITY: Payment info in booking object
        payment: {
            method: 'credit_card',
            cardNumber: user ? user.creditCard : '****-****-****-****',
            amount: flight.price
        },
        // ⚠️ VULNERABILITY: Direct blob storage URL with SAS token
        documentUrl: `${window.AzureConfig.storageUrls.bookings}/${Date.now()}-booking.pdf`,
        confirmationUrl: `${window.AzureConfig.storageUrls.documents}/confirmation-${Date.now()}.pdf`
    };
    
    console.log('Creating booking:', bookingData);
    
    // ⚠️ VULNERABILITY: Storing booking data in localStorage with sensitive info
    let bookings = localStorage.getItem('bookings');
    bookings = bookings ? JSON.parse(bookings) : [];
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // ⚠️ VULNERABILITY: Making API call with exposed credentials
    fetch(`${window.AzureConfig.apiConfig.endpoint}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // ⚠️ VULNERABILITY: API key in header
            'X-API-Key': window.AzureConfig.apiConfig.primaryKey,
            // ⚠️ VULNERABILITY: Database credentials in custom header
            'X-Database-Connection': window.AzureConfig.databaseConfig.connectionString
        },
        body: JSON.stringify(bookingData)
    }).then(response => {
        console.log('Booking response:', response);
    }).catch(error => {
        console.error('Booking error:', error);
    });
    
    alert(`Flight booked successfully!\n\nBooking ID: ${bookingData.bookingId}\nFlight: ${flight.airline} ${flight.flightNumber}\nRoute: ${flight.from} → ${flight.to}\nPrice: $${flight.price}\n\nCheck "My Bookings" to view details.`);
    
    // Redirect to bookings page
    setTimeout(() => {
        window.location.href = 'bookings.html';
    }, 2000);
}

// Make bookFlight available globally
window.bookFlight = bookFlight;
