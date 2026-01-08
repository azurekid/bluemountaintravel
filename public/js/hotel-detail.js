// Hotel detail page functionality
// ⚠️ VULNERABILITY: Insecure Direct Object Reference (IDOR)
// ctf_b64: RkxBR3tpZG9yX3Z1bG5lcmFiaWxpdHlfaW5faG90ZWxfZGV0YWlsc30=

document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading hotel detail page...');
    loadHotelDetails();
});

// ⚠️ VULNERABILITY: No authorization check for viewing hotel details
function loadHotelDetails() {
    // Get hotel ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');
    
    console.log('Loading details for hotel ID:', hotelId);
    
    if (!hotelId) {
        displayError('No hotel ID provided');
        return;
    }
    
    // ⚠️ VULNERABILITY: Direct access to data without authentication
    const hotel = window.HotelData.find(h => h.id === hotelId);
    
    if (!hotel) {
        displayError('Hotel not found');
        console.error('Hotel ID not found:', hotelId);
        return;
    }
    
    // ⚠️ VULNERABILITY: Logging all hotel data including internal details
    console.log('Hotel data loaded:', hotel);
    console.log('Full hotel object with all details:', JSON.stringify(hotel, null, 2));
    
    displayHotelDetails(hotel);
}

function displayHotelDetails(hotel) {
    // Update page title and header
    document.getElementById('hotel-name').textContent = hotel.name;
    document.getElementById('hotel-location').textContent = hotel.location;
    document.title = `${hotel.name} - Blue Mountain Travel`;
    
    // Hotel image URLs
    const hotelImages = {
        'HT001': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
        'HT002': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
        'HT003': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
        'HT004': 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&q=80',
        'HT005': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
        'HT006': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
        'HT007': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
        'HT008': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
        'HT009': 'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=1200&q=80',
        'HT010': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80',
        'HT011': 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1200&q=80',
        'HT012': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80'
    };
    
    const imageUrl = hotel.photoUrl || hotel.imageUrl || hotelImages[hotel.id] || hotelImages['HT001'];
    const stars = '⭐'.repeat(hotel.rating);
    
    // Create amenity badges
    const amenitiesBadges = (hotel.amenities || []).map(amenity => 
        `<span class="amenity-badge" style="display: inline-block; background: var(--primary-color); color: white; padding: 0.5rem 1rem; border-radius: 20px; margin: 0.25rem;">${amenity}</span>`
    ).join('');
    
    // Create room facilities list
    const roomFacilitiesList = hotel.roomFacilities ? hotel.roomFacilities.map(facility =>
        `<li>${facility}</li>`
    ).join('') : '<li>Information not available</li>';
    
    // Create hotel facilities list
    const hotelFacilitiesList = hotel.hotelFacilities ? hotel.hotelFacilities.map(facility =>
        `<li>${facility}</li>`
    ).join('') : '<li>Information not available</li>';
    
    const detailsHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <img src="${imageUrl}" alt="${hotel.name}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" />
                
                <div style="margin-bottom: 2rem;">
                    <h2 style="color: var(--primary-color); margin-bottom: 0.5rem;">${hotel.name}</h2>
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">${stars} ${hotel.rating} Star Hotel</p>
                    <p style="color: #666; margin-bottom: 1rem;">📍 ${hotel.location}</p>
                    <p style="line-height: 1.6;">${hotel.description}</p>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Contact Information</h3>
                    <p><strong>Address:</strong> ${hotel.address || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${hotel.phone || 'N/A'}</p>
                    <p><strong>Check-in:</strong> ${hotel.checkIn || '3:00 PM'}</p>
                    <p><strong>Check-out:</strong> ${hotel.checkOut || '12:00 PM'}</p>
                </div>
            </div>
            
            <div>
                <div style="background: #f8f9fa; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Room Type & Pricing</h3>
                    <p><strong>Room Type:</strong> ${hotel.roomType}</p>
                    <p style="font-size: 2rem; color: var(--primary-color); margin: 1rem 0;">
                        <strong>$${hotel.price}</strong>
                        <span style="font-size: 1rem; color: #666;">/night</span>
                    </p>
                    <p style="color: ${hotel.available ? 'green' : 'red'};">
                        ${hotel.available ? '✓ Available' : '✗ Not Available'}
                    </p>
                    <button onclick="bookHotel('${hotel.id}')" class="btn-search" style="width: 100%; margin-top: 1rem; padding: 1rem; font-size: 1.1rem;">
                        Book Now
                    </button>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Amenities</h3>
                    <div style="margin-bottom: 1rem;">
                        ${amenitiesBadges}
                    </div>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Room Facilities</h3>
                    <ul style="margin-left: 1.5rem; line-height: 1.8;">
                        ${roomFacilitiesList}
                    </ul>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Hotel Facilities</h3>
                    <ul style="margin-left: 1.5rem; line-height: 1.8;">
                        ${hotelFacilitiesList}
                    </ul>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Cancellation Policy</h3>
                    <p>${hotel.cancellationPolicy || 'Standard cancellation policy applies'}</p>
                </div>
            </div>
        </div>
        
        <!-- ⚠️ VULNERABILITY: Exposing internal data -->
        <div style="margin-top: 2rem; padding: 1rem; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
            <h4 style="margin-bottom: 0.5rem;">Debug Information (should not be visible in production)</h4>
            <p style="font-size: 0.9rem;"><strong>Hotel ID:</strong> ${hotel.id}</p>
            <p style="font-size: 0.9rem;"><strong>City Code:</strong> ${hotel.city || 'N/A'}</p>
            <p style="font-size: 0.9rem;"><strong>Country Code:</strong> ${hotel.country || 'N/A'}</p>
            <p style="font-size: 0.9rem;"><strong>Database Record:</strong> hotels/${hotel.id}</p>
            <p style="font-size: 0.9rem;"><strong>Storage URL:</strong> ${window.AzureConfig.storageUrls.documents}/hotels/${hotel.id}.json</p>
            <!-- ctf_b64: RkxBR3tpbnRlcm5hbF9ob3RlbF9kYXRhX2V4cG9zZWRfaW5fdWl9 -->
        </div>
    `;
    
    document.getElementById('hotel-details').innerHTML = detailsHtml;
}

function displayError(message) {
    document.getElementById('hotel-name').textContent = 'Error';
    document.getElementById('hotel-location').textContent = message;
    document.getElementById('hotel-details').innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h3 style="color: #dc3545;">❌ ${message}</h3>
            <p>Please try again or <a href="hotels.html">browse all hotels</a>.</p>
        </div>
    `;
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

window.bookHotel = bookHotel;

console.log('=== Hotel Detail Page Vulnerabilities ===');
console.log('1. IDOR - Access any hotel by changing ID parameter');
console.log('2. No authentication required');
console.log('3. Internal data exposed in debug section');
console.log('4. All hotel details logged to console');
console.log('=========================================');
