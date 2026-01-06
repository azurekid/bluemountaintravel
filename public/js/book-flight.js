// Book flight page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading book flight page...');
    loadFlightDetails();
    prefillUserData();
    initializeBookingForm();
});

// Get flight ID from URL
function getFlightIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load flight details from the flight data
function loadFlightDetails() {
    const flightId = getFlightIdFromUrl();
    
    if (!flightId) {
        displayFlightError('No flight selected. Please select a flight from the flights page.');
        return;
    }
    
    const flight = window.FlightData.find(f => f.id === flightId);
    
    if (!flight) {
        displayFlightError('Flight not found. Please select a valid flight.');
        return;
    }
    
    displayFlightSummary(flight);
}

// Display flight summary in the sidebar
function displayFlightSummary(flight) {
    const summaryDiv = document.getElementById('flight-details');
    
    summaryDiv.innerHTML = `
        <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
            <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">${flight.airline}</p>
            <p style="color: #666;">Flight ${flight.flightNumber}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Route</p>
            <p style="font-size: 1.1rem;">${flight.from} → ${flight.to}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Schedule</p>
            <p>Departure: ${flight.departure}</p>
            <p>Arrival: ${flight.arrival}</p>
            <p>Duration: ${flight.duration}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Class</p>
            <p>${flight.class}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Available Seats</p>
            <p>${flight.availableSeats} seats remaining</p>
        </div>
        
        <div style="padding-top: 1rem; border-top: 2px solid var(--primary-color);">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Total Price</p>
            <p style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">$${flight.price}</p>
            <p style="color: #666; font-size: 0.9rem;">per person</p>
        </div>
    `;
}

// Display error message
function displayFlightError(message) {
    const summaryDiv = document.getElementById('flight-details');
    summaryDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <p style="color: #dc3545; font-weight: 600;">❌ ${message}</p>
            <a href="flights.html" class="btn-search" style="display: inline-block; margin-top: 1rem; text-decoration: none;">Browse Flights</a>
        </div>
    `;
}

// Prefill form with user data if available
function prefillUserData() {
    const user = window.getCurrentUser ? getCurrentUser() : null;
    
    if (user) {
        document.getElementById('firstName').value = user.firstName || '';
        document.getElementById('lastName').value = user.lastName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('dateOfBirth').value = user.dateOfBirth || '';
    }
}

// Initialize booking form
function initializeBookingForm() {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processFlightBooking();
    });
}

// Process the flight booking
function processFlightBooking() {
    const flightId = getFlightIdFromUrl();
    const flight = window.FlightData.find(f => f.id === flightId);
    
    if (!flight) {
        alert('Flight not found. Please try again.');
        return;
    }
    
    // Collect form data
    const passengerData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        passportNumber: document.getElementById('passportNumber').value,
        nationality: document.getElementById('nationality').value,
        passportExpiry: document.getElementById('passportExpiry').value,
        seatPreference: document.getElementById('seatPreference').value,
        mealPreference: document.getElementById('mealPreference').value,
        specialRequests: document.getElementById('specialRequests').value
    };
    
    const user = window.getCurrentUser ? getCurrentUser() : null;
    
    // Create booking data
    const bookingData = {
        bookingId: 'BK' + Date.now(),
        flightId: flight.id,
        flight: flight,
        passenger: passengerData,
        user: user,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        payment: {
            method: 'credit_card',
            cardNumber: user ? user.creditCard : '****-****-****-****',
            amount: flight.price
        },
        documentUrl: `${window.AzureConfig.storageUrls.bookings}/${Date.now()}-booking.pdf`,
        confirmationUrl: `${window.AzureConfig.storageUrls.documents}/confirmation-${Date.now()}.pdf`
    };
    
    console.log('Creating booking:', bookingData);
    
    // Store booking in localStorage
    let bookings = localStorage.getItem('bookings');
    bookings = bookings ? JSON.parse(bookings) : [];
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Make API call
    fetch(`${window.AzureConfig.apiConfig.endpoint}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': window.AzureConfig.apiConfig.primaryKey,
            'X-Database-Connection': window.AzureConfig.databaseConfig.connectionString
        },
        body: JSON.stringify(bookingData)
    }).then(response => {
        console.log('Booking response:', response);
    }).catch(error => {
        console.error('Booking error:', error);
    });
    
    alert(`Flight booked successfully!\n\nBooking ID: ${bookingData.bookingId}\nPassenger: ${passengerData.firstName} ${passengerData.lastName}\nFlight: ${flight.airline} ${flight.flightNumber}\nRoute: ${flight.from} → ${flight.to}\nPrice: $${flight.price}\n\nCheck "My Bookings" to view details.`);
    
    // Redirect to bookings page
    setTimeout(() => {
        window.location.href = 'bookings.html';
    }, 1500);
}
