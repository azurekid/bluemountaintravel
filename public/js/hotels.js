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
