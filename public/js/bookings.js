// Bookings page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading bookings page...');
    
    // Check authentication
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html?redirect=bookings.html';
        return;
    }
    
    displayBookings();
});

function displayBookings() {
    const bookingsList = document.getElementById('bookings-list');
    
    if (!bookingsList) return;
    
    // ⚠️ VULNERABILITY: Reading sensitive booking data from localStorage
    // TODO: In production, fetch from database using dbadmin credentials
    const dbConfig = window.AzureConfig?.databaseConfig || {
        server: "bluemountaintravel.database.windows.net",
        database: "TravelDB",
        username: "dbadmin",  // Using dbadmin as SQL admin account
        password: "P@ssw0rd123!"
    };
    
    console.log('Database connection would use:', dbConfig.username + '@' + dbConfig.server);
    
    let bookings = localStorage.getItem('bookings');
    bookings = bookings ? JSON.parse(bookings) : [];
    
    // ⚠️ VULNERABILITY: Logging sensitive booking information
    console.log('User bookings:', bookings);
    console.log('Storage URLs:', window.AzureConfig.storageUrls);
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="profile-card text-center">
                <h2>No Bookings Yet</h2>
                <p class="text-muted">You haven't made any bookings. Start planning your next business trip!</p>
                <div style="margin-top: 2rem;">
                    <a href="flights.html" class="btn-search" style="display: inline-block; text-decoration: none; margin-right: 1rem;">Browse Flights</a>
                    <a href="hotels.html" class="btn-search" style="display: inline-block; text-decoration: none;">Browse Hotels</a>
                </div>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    bookings.forEach(booking => {
        const isFlightBooking = booking.bookingId.startsWith('BK');
        const bookingDate = new Date(booking.bookingDate);
        
        if (isFlightBooking) {
            html += `
                <div class="booking-card">
                    <div class="booking-header">
                        <div>
                            <span class="booking-id">✈️ ${booking.bookingId}</span>
                            <p class="text-muted">Booked on ${bookingDate.toLocaleDateString()}</p>
                        </div>
                        <span class="status-badge status-confirmed">${booking.status}</span>
                    </div>
                    <div class="booking-details">
                        <div>
                            <p><strong>Airline:</strong> ${booking.flight.airline}</p>
                            <p><strong>Flight:</strong> ${booking.flight.flightNumber}</p>
                            <p><strong>Route:</strong> ${booking.flight.from} → ${booking.flight.to}</p>
                        </div>
                        <div>
                            <p><strong>Departure:</strong> ${booking.flight.departure}</p>
                            <p><strong>Class:</strong> ${booking.flight.class}</p>
                            <p><strong>Price:</strong> $${booking.payment.amount}</p>
                        </div>
                        <div>
                            <p><strong>Payment Method:</strong> ${booking.payment.method}</p>
                            <p><strong>Card:</strong> ${booking.payment.cardNumber}</p>
                            <p><strong>Document:</strong> <a href="${booking.documentUrl}" target="_blank">View Ticket</a></p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            
            html += `
                <div class="booking-card">
                    <div class="booking-header">
                        <div>
                            <span class="booking-id">🏨 ${booking.bookingId}</span>
                            <p class="text-muted">Booked on ${bookingDate.toLocaleDateString()}</p>
                        </div>
                        <span class="status-badge status-confirmed">${booking.status}</span>
                    </div>
                    <div class="booking-details">
                        <div>
                            <p><strong>Hotel:</strong> ${booking.hotel.name}</p>
                            <p><strong>Location:</strong> ${booking.hotel.location}</p>
                            <p><strong>Room:</strong> ${booking.hotel.roomType}</p>
                        </div>
                        <div>
                            <p><strong>Check-in:</strong> ${checkIn.toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> ${checkOut.toLocaleDateString()}</p>
                            <p><strong>Nights:</strong> ${booking.nights}</p>
                        </div>
                        <div>
                            <p><strong>Total Price:</strong> $${booking.payment.amount}</p>
                            <p><strong>Card:</strong> ${booking.payment.cardNumber}</p>
                            <p><strong>Confirmation:</strong> <a href="${booking.confirmationUrl}" target="_blank">View Document</a></p>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    bookingsList.innerHTML = html;
    
    // ⚠️ VULNERABILITY: Expose booking data to global scope
    window.userBookings = bookings;
    
    // ⚠️ VULNERABILITY: Log sensitive information to console
    console.log('All booking details including payment info:', bookings);
    console.log('Direct document URLs with SAS tokens:', bookings.map(b => b.documentUrl));
}

// ⚠️ VULNERABILITY: Function to export bookings data
function exportBookingsData() {
    const bookings = localStorage.getItem('bookings');
    const user = localStorage.getItem('currentUser');
    
    const exportData = {
        user: JSON.parse(user),
        bookings: JSON.parse(bookings),
        azureConfig: window.AzureConfig,
        exportDate: new Date().toISOString()
    };
    
    console.log('Exporting user data:', exportData);
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bookings-export-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Make function available globally
window.exportBookingsData = exportBookingsData;
