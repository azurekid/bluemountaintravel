// Hotels page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading hotels page...');
    displayHotels();
    initializeFilters();
});

function displayHotels() {
    const hotelResults = document.getElementById('hotel-results');
    
    if (!hotelResults) return;
    
    const hotels = window.HotelData || [];
    
    if (hotels.length === 0) {
        hotelResults.innerHTML = '<p>No hotels available at this time.</p>';
        return;
    }
    
    let html = '<h2 class="text-primary mb-2">Available Hotels</h2>';
    
    hotels.forEach(hotel => {
        const stars = '⭐'.repeat(hotel.rating);
        const amenitiesList = hotel.amenities.join(', ');
        
        html += `
            <div class="hotel-card" data-hotel-id="${hotel.id}">
                <div class="hotel-header">
                    <div>
                        <h3 class="hotel-name">${hotel.name}</h3>
                        <p class="text-muted">${stars} | ${hotel.location}</p>
                    </div>
                    <div class="price-section">
                        <div class="price">$${hotel.price}</div>
                        <div class="price-label">per night</div>
                        <button class="btn-book" onclick="bookHotel('${hotel.id}')">Book Now</button>
                    </div>
                </div>
                <div class="hotel-details">
                    <div class="hotel-info">
                        <p><strong>Room Type:</strong> ${hotel.roomType}</p>
                        <p><strong>Amenities:</strong> ${amenitiesList}</p>
                        <p><strong>Status:</strong> <span style="color: var(--success-color);">Available</span></p>
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
            const price = parseInt(card.querySelector('.price').textContent.replace('$', ''));
            show = priceFilters.some(filter => {
                if (filter === '0-300') return price < 300;
                if (filter === '300-500') return price >= 300 && price <= 500;
                if (filter === '500+') return price > 500;
                return true;
            });
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// ⚠️ VULNERABILITY: Booking function that exposes sensitive data
function bookHotel(hotelId) {
    const hotel = window.HotelData.find(h => h.id === hotelId);
    
    if (!hotel) {
        alert('Hotel not found');
        return;
    }
    
    const user = window.getCurrentUser ? getCurrentUser() : null;
    
    // ⚠️ VULNERABILITY: Creating booking with exposed SAS token
    const bookingData = {
        bookingId: 'HB' + Date.now(),
        hotelId: hotel.id,
        hotel: hotel,
        user: user, // ⚠️ Contains sensitive user data
        bookingDate: new Date().toISOString(),
        checkIn: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        checkOut: new Date(Date.now() + 7 * 86400000).toISOString(), // Next week
        nights: 7,
        status: 'confirmed',
        // ⚠️ VULNERABILITY: Payment info in booking object
        payment: {
            method: 'credit_card',
            cardNumber: user ? user.creditCard : '****-****-****-****',
            amount: hotel.price * 7
        },
        // ⚠️ VULNERABILITY: Direct blob storage URL with SAS token
        documentUrl: `${window.AzureConfig.storageUrls.bookings}/${Date.now()}-hotel-booking.pdf`,
        confirmationUrl: `${window.AzureConfig.storageUrls.documents}/hotel-confirmation-${Date.now()}.pdf`
    };
    
    console.log('Creating hotel booking:', bookingData);
    
    // ⚠️ VULNERABILITY: Storing booking data in localStorage with sensitive info
    let bookings = localStorage.getItem('bookings');
    bookings = bookings ? JSON.parse(bookings) : [];
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // ⚠️ VULNERABILITY: Making API call with exposed credentials
    fetch(`${window.AzureConfig.apiConfig.endpoint}/hotel-bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // ⚠️ VULNERABILITY: API key in header
            'X-API-Key': window.AzureConfig.apiConfig.primaryKey,
            // ⚠️ VULNERABILITY: SAS token in header
            'X-Storage-SAS': window.AzureConfig.sasToken
        },
        body: JSON.stringify(bookingData)
    }).then(response => {
        console.log('Hotel booking response:', response);
    }).catch(error => {
        console.error('Hotel booking error:', error);
    });
    
    alert(`Hotel booked successfully!\n\nBooking ID: ${bookingData.bookingId}\nHotel: ${hotel.name}\nLocation: ${hotel.location}\nCheck-in: ${new Date(bookingData.checkIn).toLocaleDateString()}\nCheck-out: ${new Date(bookingData.checkOut).toLocaleDateString()}\nTotal: $${hotel.price * 7}\n\nCheck "My Bookings" to view details.`);
    
    // Redirect to bookings page
    setTimeout(() => {
        window.location.href = 'bookings.html';
    }, 2000);
}

// Make bookHotel available globally
window.bookHotel = bookHotel;
