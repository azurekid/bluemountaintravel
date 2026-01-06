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
            <div class="hotel-card" data-hotel-id="${hotel.id}">
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
                        <p><strong>Status:</strong> <span style="color: #4CAF50; font-weight: 600;">✓ Available</span></p>
                    </div>
                    <div class="hotel-footer">
                        <div class="hotel-price">
                            <span class="price-amount">$${hotel.price}</span>
                            <span class="price-label">per night</span>
                        </div>
                        <button class="btn-book" onclick="bookHotel('${hotel.id}')">Book Now</button>
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
            const priceText = card.querySelector('.price-amount').textContent.replace('$', '');
            const price = parseInt(priceText);
            show = priceFilters.some(filter => {
                if (filter === '0-300') return price < 300;
                if (filter === '300-500') return price >= 300 && price <= 500;
                if (filter === '500+') return price > 500;
                return true;
            });
        }
        
        card.style.display = show ? 'grid' : 'none';
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
