// Bookings page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading bookings page...');
    
    // Update auth button
    updateAuthButton();
    
    // Check authentication using database backend
    if (!verifyDatabaseAuthentication()) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html?redirect=bookings.html';
        return;
    }
    
    // Load and display bookings
    loadBookings();
});

// Update auth button based on login state
function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser && authBtn) {
        authBtn.textContent = 'Logout';
        authBtn.href = '#';
        authBtn.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('loginTimestamp');
            window.location.href = 'index.html';
        };
    }
}

// Verify authentication against database backend
function verifyDatabaseAuthentication() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        console.log('No user session found');
        return false;
    }
    
    try {
        const user = JSON.parse(currentUser);
        
        // User from SQL DB has Email (capital E) and UserID fields
        // Accept user if they have these fields from the Function API response
        if (!user.Email && !user.email) {
            console.error('Invalid user object - missing email field');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionToken');
            return false;
        }
        
        // Verify session token exists
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            console.error('No valid session token');
            return false;
        }
        
        console.log('Database authentication verified for user:', user.Email || user.email);
        return true;
    } catch (error) {
        console.error('Authentication verification failed:', error);
        return false;
    }
}

// Load bookings from multiple sources
async function loadBookings() {
    const bookingsList = document.getElementById('bookings-list');
    
    if (!bookingsList) return;
    
    // Show loading state
    bookingsList.innerHTML = `
        <div class="profile-card" style="text-align: center; padding: 3rem;">
            <div class="loading-spinner" style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #1a365d; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p>Loading your bookings...</p>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        </div>
    `;
    
    const currentUser = localStorage.getItem('currentUser');
    const user = currentUser ? JSON.parse(currentUser) : null;
    
    if (!user) {
        showNoUserState(bookingsList);
        return;
    }
    
    const userId = user.UserID || user.userId || user.id;
    const userEmail = user.Email || user.email;
    
    console.log('Loading bookings for user:', userId, userEmail);
    
    // Collect bookings from multiple sources
    let allBookings = [];
    
    // 1. Try to fetch from database API
    try {
        const dbBookings = await fetchBookingsFromDatabase(userId);
        if (dbBookings && dbBookings.length > 0) {
            console.log('Loaded bookings from database:', dbBookings.length);
            allBookings = allBookings.concat(dbBookings.map(b => ({ ...b, source: 'database' })));
        }
    } catch (error) {
        console.warn('Could not fetch from database:', error);
    }
    
    // 2. Try to fetch from Azure Storage documents container
    try {
        const storageBookings = await fetchBookingsFromStorage(userId, userEmail);
        if (storageBookings && storageBookings.length > 0) {
            console.log('Loaded bookings from storage:', storageBookings.length);
            // Only add if not already in list (avoid duplicates)
            storageBookings.forEach(sb => {
                if (!allBookings.find(b => b.BookingID === sb.bookingId || b.bookingId === sb.bookingId)) {
                    allBookings.push({ ...sb, source: 'storage' });
                }
            });
        }
    } catch (error) {
        console.warn('Could not fetch from storage:', error);
    }
    
    // 3. Add localStorage bookings (for offline/demo purposes)
    const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localBookings.forEach(lb => {
        if (!allBookings.find(b => b.BookingID === lb.bookingId || b.bookingId === lb.bookingId)) {
            allBookings.push({ ...lb, source: 'local' });
        }
    });
    
    console.log('Total bookings loaded:', allBookings.length);
    
    // Display bookings
    displayBookings(allBookings, bookingsList, user);
}

// Fetch bookings from database API
async function fetchBookingsFromDatabase(userId) {
    const apiBaseUrl = window.BMT_API_BASE_URL || 
        (window.location.hostname === 'localhost' ? 'http://localhost:7071/api' : 'https://bluemountaintravel-func.azurewebsites.net/api');
    const functionsKey = window.BMT_FUNCTION_KEY || window.AzureConfig?.apiConfig?.functionKey || window.AzureConfig?.apiConfig?.primaryKey;
    
    const response = await fetch(`${apiBaseUrl}/bookings?userId=${encodeURIComponent(userId)}`, {
        headers: functionsKey ? { 'x-functions-key': functionsKey } : {}
    });
    
    if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
    }
    
    return await response.json();
}

// Fetch booking documents from Azure Storage
async function fetchBookingsFromStorage(userId, userEmail) {
    const storageAccount = window.AzureConfig?.storageAccount || STORAGE_ACCOUNT_NAME || 'bluemountaintravel';
    const sasToken = window.AzureConfig?.sasToken || AZURE_STORAGE_SAS_TOKEN;
    
    // List blobs in documents container
    const listUrl = `https://${storageAccount}.blob.core.windows.net/documents?restype=container&comp=list${sasToken}`;
    
    try {
        const response = await fetch(listUrl);
        if (!response.ok) {
            throw new Error(`Storage list returned ${response.status}`);
        }
        
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const blobs = xml.querySelectorAll('Blob');
        
        const bookings = [];
        
        for (const blob of blobs) {
            const name = blob.querySelector('Name')?.textContent;
            if (name && name.includes('-confirmation.json')) {
                // Fetch the booking document
                const blobUrl = `https://${storageAccount}.blob.core.windows.net/documents/${name}${sasToken}`;
                try {
                    const docResponse = await fetch(blobUrl);
                    if (docResponse.ok) {
                        const bookingData = await docResponse.json();
                        // Check if this booking belongs to the user
                        const passengerEmail = bookingData.passengerDetails?.email || bookingData.guestDetails?.email;
                        if (passengerEmail && passengerEmail.toLowerCase() === userEmail.toLowerCase()) {
                            bookingData.documentUrl = blobUrl;
                            bookings.push(bookingData);
                        }
                    }
                } catch (e) {
                    console.warn('Could not fetch booking document:', name, e);
                }
            }
        }
        
        return bookings;
    } catch (error) {
        console.warn('Could not list storage blobs:', error);
        return [];
    }
}

// Display bookings in the UI
function displayBookings(bookings, container, user) {
    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="profile-card" style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📋</div>
                <h2 style="color: var(--primary-color); margin-bottom: 1rem;">No Bookings Yet</h2>
                <p style="color: #666; margin-bottom: 2rem;">You haven't made any bookings. Start planning your next business trip!</p>
                <div>
                    <a href="flights.html" class="btn-search" style="display: inline-block; text-decoration: none; margin-right: 1rem;">✈️ Browse Flights</a>
                    <a href="hotels.html" class="btn-search" style="display: inline-block; text-decoration: none;">🏨 Browse Hotels</a>
                </div>
            </div>
        `;
        return;
    }
    
    // Sort by booking date (newest first)
    bookings.sort((a, b) => {
        const dateA = new Date(a.BookingDate || a.bookingDate || a.generatedAt);
        const dateB = new Date(b.BookingDate || b.bookingDate || b.generatedAt);
        return dateB - dateA;
    });
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 style="color: var(--primary-color); margin: 0;">Your Bookings (${bookings.length})</h2>
            <div>
                <button onclick="refreshBookings()" class="btn-search" style="padding: 0.5rem 1rem; font-size: 0.9rem;">🔄 Refresh</button>
            </div>
        </div>
    `;
    
    bookings.forEach(booking => {
        html += renderBookingCard(booking);
    });
    
    container.innerHTML = html;
    
    // Store for global access
    window.userBookings = bookings;
}

// Render a single booking card
function renderBookingCard(booking) {
    // Determine if flight or hotel booking
    const isFlightBooking = booking.BookingType === 'Flight' || 
                            booking.bookingType === 'Flight' || 
                            booking.documentType === 'FLIGHT_BOOKING_CONFIRMATION' ||
                            booking.flightDetails || 
                            booking.flight;
    
    const bookingId = booking.BookingID || booking.bookingId;
    const bookingDate = new Date(booking.BookingDate || booking.bookingDate || booking.generatedAt);
    const status = booking.Status || booking.status || 'confirmed';
    const documentUrl = booking.BlobStorageURL || booking.documentUrl || booking.confirmationUrl;
    
    // Build the view ticket URL
    let viewUrl;
    if (documentUrl) {
        viewUrl = `ticket.html?url=${encodeURIComponent(documentUrl)}`;
    } else {
        viewUrl = `ticket.html?id=${encodeURIComponent(bookingId)}`;
    }
    
    if (isFlightBooking) {
        const flight = booking.flightDetails || booking.flight || {};
        const passenger = booking.passengerDetails || booking.passenger || {};
        const payment = booking.payment || {};
        
        return `
            <div class="profile-card" style="margin-bottom: 1.5rem; overflow: hidden;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #f0f0f0;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.5rem;">✈️</span>
                            <span style="font-weight: 700; font-size: 1.1rem; color: var(--primary-color);">${bookingId}</span>
                            <span style="background: ${status === 'confirmed' || status === 'Confirmed' ? '#48bb78' : '#ed8936'}; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">${status}</span>
                        </div>
                        <p style="color: #666; font-size: 0.9rem; margin: 0;">Booked on ${bookingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">$${payment.amount || booking.TotalAmount || flight.price || 'N/A'}</div>
                        <div style="font-size: 0.8rem; color: #666;">${flight.class || 'Economy'} Class</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: #1a365d;">${extractCode(flight.from)}</div>
                        <div style="color: #666; font-size: 0.9rem;">${flight.from?.replace(/\\s*\\([^)]*\\)/, '') || 'N/A'}</div>
                        <div style="color: var(--primary-color); font-weight: 600; margin-top: 0.25rem;">${flight.departure || 'N/A'}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #666; font-size: 0.8rem; margin-bottom: 0.25rem;">${flight.duration || 'N/A'}</div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="flex: 1; height: 2px; background: linear-gradient(90deg, var(--primary-color), #d69e2e);"></div>
                            <span>✈️</span>
                            <div style="flex: 1; height: 2px; background: linear-gradient(90deg, #d69e2e, var(--primary-color));"></div>
                        </div>
                        <div style="color: #666; font-size: 0.8rem; margin-top: 0.25rem;">${flight.airline || 'N/A'} ${flight.flightNumber || ''}</div>
                        ${flight.aircraft ? `<div style="color: #888; font-size: 0.75rem; margin-top: 0.25rem;">🛩️ ${flight.aircraft}</div>` : ''}
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #1a365d;">${extractCode(flight.to)}</div>
                        <div style="color: #666; font-size: 0.9rem;">${flight.to?.replace(/\\s*\\([^)]*\\)/, '') || 'N/A'}</div>
                        <div style="color: var(--primary-color); font-weight: 600; margin-top: 0.25rem;">${flight.arrival || 'N/A'}</div>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #f0f0f0;">
                    <div style="color: #666; font-size: 0.9rem;">
                        <span style="font-weight: 600;">Passenger:</span> ${passenger.name || `${passenger.firstName || ''} ${passenger.lastName || ''}`.trim() || 'N/A'}
                    </div>
                    <div style="display: flex; gap: 0.75rem;">
                        <a href="${viewUrl}" class="btn-search" style="padding: 0.5rem 1.25rem; font-size: 0.9rem; text-decoration: none;">🎫 View Ticket</a>
                        <button onclick="removeBooking('${bookingId}')" style="padding: 0.5rem 1.25rem; font-size: 0.9rem; background: #fff; border: 2px solid #e53e3e; color: #e53e3e; border-radius: 4px; cursor: pointer; font-weight: 600;">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Hotel booking
        const hotel = booking.hotelDetails || booking.hotel || {};
        const stay = booking.stayDetails || {};
        const guest = booking.guestDetails || booking.guest || {};
        const payment = booking.payment || {};
        
        const checkIn = booking.checkIn || stay.checkIn;
        const checkOut = booking.checkOut || stay.checkOut;
        const nights = booking.nights || stay.nights || 1;
        
        const checkInDate = checkIn ? new Date(checkIn) : null;
        const checkOutDate = checkOut ? new Date(checkOut) : null;
        
        return `
            <div class="profile-card" style="margin-bottom: 1.5rem; overflow: hidden;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #f0f0f0;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.5rem;">🏨</span>
                            <span style="font-weight: 700; font-size: 1.1rem; color: var(--primary-color);">${bookingId}</span>
                            <span style="background: ${status === 'confirmed' || status === 'Confirmed' ? '#48bb78' : '#ed8936'}; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">${status}</span>
                        </div>
                        <p style="color: #666; font-size: 0.9rem; margin: 0;">Booked on ${bookingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">$${payment.amount || booking.TotalAmount || stay.totalPrice || 'N/A'}</div>
                        <div style="font-size: 0.8rem; color: #666;">${nights} night${nights > 1 ? 's' : ''}</div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 2rem; margin-bottom: 1.5rem;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 0.5rem 0; color: #1a365d; font-size: 1.2rem;">${hotel.name || 'Hotel'}</h3>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">📍 ${hotel.location || 'N/A'}</p>
                        <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.9rem;">🛏️ ${hotel.roomType || 'Standard Room'}</p>
                        ${hotel.rating ? `<p style="margin: 0.25rem 0 0 0;">${'⭐'.repeat(hotel.rating)}</p>` : ''}
                    </div>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">${checkInDate ? checkInDate.getDate() : 'N/A'}</div>
                            <div style="font-size: 0.75rem; color: #666;">${checkInDate ? checkInDate.toLocaleDateString('en-US', { month: 'short' }) : ''}</div>
                            <div style="font-size: 0.7rem; color: #999; margin-top: 0.25rem;">CHECK-IN</div>
                        </div>
                        <div style="color: #666;">→</div>
                        <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">${checkOutDate ? checkOutDate.getDate() : 'N/A'}</div>
                            <div style="font-size: 0.75rem; color: #666;">${checkOutDate ? checkOutDate.toLocaleDateString('en-US', { month: 'short' }) : ''}</div>
                            <div style="font-size: 0.7rem; color: #999; margin-top: 0.25rem;">CHECK-OUT</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #f0f0f0;">
                    <div style="color: #666; font-size: 0.9rem;">
                        <span style="font-weight: 600;">Guest:</span> ${guest.name || `${guest.firstName || ''} ${guest.lastName || ''}`.trim() || 'N/A'}
                    </div>
                    <div style="display: flex; gap: 0.75rem;">
                        <a href="${viewUrl}" class="btn-search" style="padding: 0.5rem 1.25rem; font-size: 0.9rem; text-decoration: none;">📄 View Details</a>
                        <button onclick="removeBooking('${bookingId}')" style="padding: 0.5rem 1.25rem; font-size: 0.9rem; background: #fff; border: 2px solid #e53e3e; color: #e53e3e; border-radius: 4px; cursor: pointer; font-weight: 600;">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Extract airport code from location string
function extractCode(locationString) {
    if (!locationString) return 'N/A';
    const match = locationString.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : locationString.substring(0, 3).toUpperCase();
}

// Show no user state
function showNoUserState(container) {
    container.innerHTML = `
        <div class="profile-card" style="text-align: center; padding: 3rem;">
            <h2>No User Session</h2>
            <p style="color: #666;">Please log in to view your bookings.</p>
            <a href="login.html" class="btn-search" style="display: inline-block; text-decoration: none; margin-top: 1rem;">Sign In</a>
        </div>
    `;
}

// Refresh bookings
function refreshBookings() {
    loadBookings();
}
window.refreshBookings = refreshBookings;

// Remove a booking by its ID
function removeBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        return;
    }
    
    let bookings = localStorage.getItem('bookings');
    bookings = bookings ? JSON.parse(bookings) : [];
    
    const initialLength = bookings.length;
    bookings = bookings.filter(booking => booking.bookingId !== bookingId);
    
    if (bookings.length < initialLength) {
        localStorage.setItem('bookings', JSON.stringify(bookings));
        console.log('Booking removed from localStorage:', bookingId);
    }
    
    // TODO: Also delete from database API
    // For now, just refresh the display
    loadBookings();
    
    alert('Booking has been cancelled successfully.');
}
window.removeBooking = removeBooking;

// Export bookings data (for debugging/demo)
function exportBookingsData() {
    const bookings = localStorage.getItem('bookings');
    const user = localStorage.getItem('currentUser');
    
    const exportData = {
        user: JSON.parse(user || '{}'),
        bookings: JSON.parse(bookings || '[]'),
        exportDate: new Date().toISOString()
    };
    
    console.log('Exporting user data:', exportData);
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bookings-export-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
window.exportBookingsData = exportBookingsData;
