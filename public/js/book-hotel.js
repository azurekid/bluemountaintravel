// Book hotel page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading book hotel page...');
    loadHotelDetails();
    prefillUserData();
    initializeDateFields();
    initializeBookingForm();
    initializeDateChangeListeners();
});

// Get hotel ID from URL
function getHotelIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load hotel details from the hotel data
function loadHotelDetails() {
    const hotelId = getHotelIdFromUrl();
    
    if (!hotelId) {
        displayHotelError('No hotel selected. Please select a hotel from the hotels page.');
        return;
    }
    
    const hotel = window.HotelData.find(h => h.id === hotelId);
    
    if (!hotel) {
        displayHotelError('Hotel not found. Please select a valid hotel.');
        return;
    }
    
    displayHotelSummary(hotel);
}

// Hotel image URLs
const hotelImages = {
    'HT001': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
    'HT002': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    'HT003': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
    'HT004': 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&q=80',
    'HT005': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
    'HT006': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80',
    'HT007': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80',
    'HT008': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
    'HT009': 'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=400&q=80',
    'HT010': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80',
    'HT011': 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=400&q=80',
    'HT012': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80'
};

// Display hotel summary in the sidebar
function displayHotelSummary(hotel) {
    const summaryDiv = document.getElementById('hotel-details');
    const imageUrl = hotelImages[hotel.id] || hotelImages['HT001'];
    const stars = '⭐'.repeat(hotel.rating);
    
    summaryDiv.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <img src="${imageUrl}" alt="${hotel.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
            <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">${hotel.name}</p>
            <p style="color: #666; font-size: 0.9rem;">${stars} ${hotel.rating} Star Hotel</p>
            <p style="color: #666; font-size: 0.9rem;">📍 ${hotel.location}</p>
        </div>
        
        <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Room Type</p>
            <p>${hotel.roomType}</p>
        </div>
        
        <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Amenities</p>
            <p style="font-size: 0.9rem;">${hotel.amenities.join(', ')}</p>
        </div>
        
        <div id="price-summary" style="padding-top: 0.5rem;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Price per Night</p>
            <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">$${hotel.price}</p>
            <div id="total-price" style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--primary-color);">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">Total (0 nights)</p>
                <p style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">$0</p>
            </div>
        </div>
    `;
    
    // Update total after rendering
    updateTotalPrice();
}

// Display error message
function displayHotelError(message) {
    const summaryDiv = document.getElementById('hotel-details');
    summaryDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <p style="color: #dc3545; font-weight: 600;">❌ ${message}</p>
            <a href="hotels.html" class="btn-search" style="display: inline-block; margin-top: 1rem; text-decoration: none;">Browse Hotels</a>
        </div>
    `;
}

// Prefill form with user data if available
function prefillUserData() {
    const user = window.getCurrentUser ? getCurrentUser() : null;
    
    // ⚠️ SECURITY FIX: Don't prefill sensitive user data by default
    // Let users enter their information manually for better security
    
    if (user) {
        // Only prefill non-sensitive basic information if user explicitly requests it
        console.log('User data available but not auto-filled for security reasons');
        console.log('User can choose to autofill from their profile if needed');
        
        // Make autofill button available
        addAutofillButton(user);
    }
}

// Add button to allow users to optionally autofill their data
function addAutofillButton(user) {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    const buttonHtml = `
        <div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 4px; border-left: 4px solid var(--primary-color);">
            <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Quick Fill</p>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">You can autofill your information from your profile</p>
            <button type="button" onclick="autofillHotelUserData()" class="btn-search" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Autofill My Data</button>
        </div>
    `;
    
    form.insertAdjacentHTML('afterbegin', buttonHtml);
}

// Function to autofill data when user clicks the button
function autofillHotelUserData() {
    const user = window.getCurrentUser ? getCurrentUser() : null;
    
    if (user) {
        document.getElementById('firstName').value = user.firstName || '';
        document.getElementById('lastName').value = user.lastName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        
        console.log('User data autofilled from profile');
    }
}

// Make autofill function available globally
window.autofillHotelUserData = autofillHotelUserData;

// Initialize date fields with default values
function initializeDateFields() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 8);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    
    if (checkInDate) {
        checkInDate.value = formatDate(tomorrow);
        checkInDate.min = formatDate(today);
    }
    if (checkOutDate) {
        checkOutDate.value = formatDate(nextWeek);
        checkOutDate.min = formatDate(tomorrow);
    }
}

// Initialize date change listeners to update total price
function initializeDateChangeListeners() {
    document.getElementById('checkInDate').addEventListener('change', updateTotalPrice);
    document.getElementById('checkOutDate').addEventListener('change', updateTotalPrice);
    document.getElementById('numRooms').addEventListener('change', updateTotalPrice);
}

// Calculate and update total price
function updateTotalPrice() {
    const hotelId = getHotelIdFromUrl();
    const hotel = window.HotelData ? window.HotelData.find(h => h.id === hotelId) : null;
    
    if (!hotel) return;
    
    const checkInDate = new Date(document.getElementById('checkInDate').value);
    const checkOutDate = new Date(document.getElementById('checkOutDate').value);
    const numRooms = parseInt(document.getElementById('numRooms').value) || 1;
    
    // Calculate number of nights
    const timeDiff = checkOutDate - checkInDate;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (nights > 0) {
        const totalPrice = hotel.price * nights * numRooms;
        const totalDiv = document.getElementById('total-price');
        if (totalDiv) {
            totalDiv.innerHTML = `
                <p style="font-weight: 600; margin-bottom: 0.5rem;">Total (${nights} night${nights > 1 ? 's' : ''}${numRooms > 1 ? ' × ' + numRooms + ' rooms' : ''})</p>
                <p style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">$${totalPrice}</p>
            `;
        }
    }
}

// Initialize booking form
function initializeBookingForm() {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processHotelBooking();
    });
}

// Process the hotel booking
function processHotelBooking() {
    const hotelId = getHotelIdFromUrl();
    const hotel = window.HotelData.find(h => h.id === hotelId);
    
    if (!hotel) {
        alert('Hotel not found. Please try again.');
        return;
    }
    
    const checkInDate = new Date(document.getElementById('checkInDate').value);
    const checkOutDate = new Date(document.getElementById('checkOutDate').value);
    const numRooms = parseInt(document.getElementById('numRooms').value) || 1;
    
    // Calculate number of nights
    const timeDiff = checkOutDate - checkInDate;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
        alert('Please select valid check-in and check-out dates.');
        return;
    }
    
    // Collect form data
    const guestData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        checkInDate: document.getElementById('checkInDate').value,
        checkOutDate: document.getElementById('checkOutDate').value,
        numGuests: document.getElementById('numGuests').value,
        numRooms: numRooms,
        bedType: document.getElementById('bedType').value,
        floorPreference: document.getElementById('floorPreference').value,
        arrivalTime: document.getElementById('arrivalTime').value,
        specialRequests: document.getElementById('specialRequests').value
    };
    
    const user = window.getCurrentUser ? getCurrentUser() : null;
    const totalPrice = hotel.price * nights * numRooms;
    
    // Create booking data
    const bookingData = {
        bookingId: 'HB' + Date.now(),
        hotelId: hotel.id,
        hotel: hotel,
        guest: guestData,
        user: user,
        bookingDate: new Date().toISOString(),
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        nights: nights,
        rooms: numRooms,
        status: 'confirmed',
        payment: {
            method: 'credit_card',
            cardNumber: user ? user.creditCard : '****-****-****-****',
            amount: totalPrice
        },
        documentUrl: `${window.AzureConfig.storageUrls.bookings}${Date.now()}-hotel-booking.pdf${window.AzureConfig.sasToken}`,
        confirmationUrl: `${window.AzureConfig.storageUrls.documents}hotel-confirmation-${Date.now()}.pdf${window.AzureConfig.sasToken}`
    };
    
    console.log('Creating hotel booking:', bookingData);
    
    // Store booking in localStorage
    let bookings = localStorage.getItem('bookings');
    bookings = bookings ? JSON.parse(bookings) : [];
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Make API call
    fetch(`${window.AzureConfig.apiConfig.endpoint}/hotel-bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': window.AzureConfig.apiConfig.primaryKey,
            'X-Storage-SAS': window.AzureConfig.sasToken
        },
        body: JSON.stringify(bookingData)
    }).then(response => {
        console.log('Hotel booking response:', response);
    }).catch(error => {
        console.error('Hotel booking error:', error);
    });
    
    alert(`Hotel booked successfully!\n\nBooking ID: ${bookingData.bookingId}\nGuest: ${guestData.firstName} ${guestData.lastName}\nHotel: ${hotel.name}\nLocation: ${hotel.location}\nCheck-in: ${new Date(bookingData.checkIn).toLocaleDateString()}\nCheck-out: ${new Date(bookingData.checkOut).toLocaleDateString()}\nNights: ${nights}\nTotal: $${totalPrice}\n\nCheck "My Bookings" to view details.`);
    
    // Redirect to bookings page
    setTimeout(() => {
        window.location.href = 'bookings.html';
    }, 1500);
}
