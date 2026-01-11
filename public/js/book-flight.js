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
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Aircraft</p>
            <p>${flight.aircraft || 'Boeing 787 Dreamliner'}</p>
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
    const user = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // ⚠️ SECURITY FIX: Don't prefill sensitive user data by default
    // Let users enter their information manually for better security
    
    // Only show autofill button if user is actually logged in with valid email
    // Check both lowercase and uppercase property names for compatibility with API responses
    if (user && (user.email || user.Email)) {
        // Only prefill non-sensitive basic information if user explicitly requests it
        console.log('User data available but not auto-filled for security reasons');
        console.log('User can choose to autofill from their profile if needed');
        
        // Make autofill button available
        addAutofillButton(user);
    }
}

// Add button to allow users to optionally autofill their data
function addAutofillButton(user) {
    // Wait a bit to ensure the form is fully loaded
    setTimeout(() => {
        const form = document.getElementById('booking-form');
        if (!form) {
            console.warn('Booking form not found, cannot add autofill button');
            return;
        }
        
        // Check if button already exists
        if (form.querySelector('.autofill-button-container')) {
            console.log('Autofill button already added');
            return;
        }
        
        const buttonHtml = `
            <div class="autofill-button-container" style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 4px; border-left: 4px solid var(--primary-color);">
                <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Quick Fill</p>
                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666;">You can autofill your information from your profile</p>
                <button type="button" onclick="autofillUserData()" class="btn-search" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Autofill My Data</button>
            </div>
        `;
        
        form.insertAdjacentHTML('afterbegin', buttonHtml);
        console.log('Autofill button added successfully');
    }, 100);
}

// Function to autofill data when user clicks the button
async function autofillUserData() {
    const user = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // Check if user is actually logged in (has valid session)
    // Check both lowercase and uppercase property names for compatibility with API responses
    const userEmail = user?.email || user?.Email;
    if (user && userEmail) {
        console.log('Autofilling form with user data, fetching profile for passport details...');
        
        // Fetch full profile data including passport from API
        let profileData = user;
        try {
            const apiBaseUrl = window.BMT_API_BASE_URL || 
                (window.location.hostname === 'localhost' ? 'http://localhost:7071/api' : 'https://bluemountaintravel-func.azurewebsites.net/api');
            const functionsKey = window.BMT_FUNCTION_KEY || window.AzureConfig?.apiConfig?.functionKey || window.AzureConfig?.apiConfig?.primaryKey;
            
            const response = await fetch(`${apiBaseUrl}/profile?email=${encodeURIComponent(userEmail)}`,
                functionsKey ? { headers: { 'x-functions-key': functionsKey } } : undefined
            );
            
            if (response.ok) {
                profileData = await response.json();
                console.log('Profile data fetched with passport:', profileData);
            } else {
                console.warn('Could not fetch profile, using localStorage data');
            }
        } catch (error) {
            console.warn('Error fetching profile, using localStorage data:', error);
        }
        
        // Handle both database format (FirstName/LastName/Email/Phone) and sample format (firstName/lastName/email/phone)
        const firstName = profileData.firstName || profileData.FirstName || user.FirstName || '';
        const lastName = profileData.lastName || profileData.LastName || user.LastName || '';
        const email = profileData.email || profileData.Email || userEmail || '';
        const phone = profileData.phone || profileData.Phone || user.Phone || '';
        const dateOfBirth = profileData.dateOfBirth || profileData.DateOfBirth || user.DateOfBirth || '';
        
        // Get passport data if available (from profile API response)
        const passport = profileData.passport || {};
        const passportNumber = passport.passportNumber || profileData.passportNumber || profileData.PassportNumber || '';
        const nationality = passport.nationality || profileData.nationality || profileData.Nationality || '';
        const passportExpiry = passport.dateOfExpiry || profileData.passportExpiry || profileData.PassportExpiry || '';
        
        // Set form values
        const firstNameField = document.getElementById('firstName');
        const lastNameField = document.getElementById('lastName');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const dobField = document.getElementById('dateOfBirth');
        const passportField = document.getElementById('passportNumber');
        const nationalityField = document.getElementById('nationality');
        const passportExpiryField = document.getElementById('passportExpiry');
        
        if (firstNameField) {
            firstNameField.value = firstName;
            console.log('Set firstName:', firstName);
        }
        if (lastNameField) {
            lastNameField.value = lastName;
            console.log('Set lastName:', lastName);
        }
        if (emailField) {
            emailField.value = email;
            console.log('Set email:', email);
        }
        if (phoneField) {
            phoneField.value = phone;
            console.log('Set phone:', phone);
        }
        if (dobField) {
            // Use passport DOB if available, otherwise user DOB
            const dob = passport.dateOfBirth || dateOfBirth;
            if (dob) {
                dobField.value = dob.split('T')[0]; // Handle ISO date format
                console.log('Set dateOfBirth:', dob);
            }
        }
        if (passportField && passportNumber) {
            passportField.value = passportNumber;
            console.log('Set passportNumber:', passportNumber);
        }
        if (nationalityField && nationality) {
            nationalityField.value = nationality;
            console.log('Set nationality:', nationality);
        }
        if (passportExpiryField && passportExpiry) {
            passportExpiryField.value = passportExpiry.split('T')[0]; // Handle ISO date format
            console.log('Set passportExpiry:', passportExpiry);
        }
        
        console.log('User data autofilled from profile');
    } else {
        console.warn('No user data available to autofill');
        alert('No user data available. Please log in first.');
    }
}

// Make autofill function available globally
window.autofillUserData = autofillUserData;

// Initialize booking form
function initializeBookingForm() {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processFlightBooking();
    });
}

// Process the flight booking
async function processFlightBooking() {
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
        }
    };
    
    console.log('Creating booking:', bookingData);
    
    // Generate and upload booking document to Azure Storage
    let documentResult = null;
    if (window.generateAndUploadBookingDocument) {
        documentResult = await window.generateAndUploadBookingDocument(bookingData, 'flight');
        if (documentResult && documentResult.success) {
            // Store the URL with SAS token for viewing
            bookingData.documentUrl = documentResult.documentUrlWithSas;
            bookingData.confirmationUrl = documentResult.documentUrlWithSas;
            // Store plain URL for database (without SAS token)
            bookingData.blobStorageUrl = documentResult.documentUrl;
            console.log('Booking document stored at:', documentResult.documentUrl);
        } else {
            console.warn('Document upload failed or not available:', documentResult?.error);
            // Set fallback URL even if upload fails - for demo purposes
            const fallbackFileName = `${bookingData.bookingId}-flight-confirmation.json`;
            const fallbackUrl = `https://${window.AzureConfig?.storageAccount || 'bluemountaintravel'}.blob.core.windows.net/documents/${fallbackFileName}${window.AzureConfig?.sasToken || ''}`;
            bookingData.documentUrl = fallbackUrl;
            bookingData.confirmationUrl = fallbackUrl;
        }
    } else {
        console.warn('generateAndUploadBookingDocument function not available');
        // Set fallback URL
        const fallbackFileName = `${bookingData.bookingId}-flight-confirmation.json`;
        const fallbackUrl = `https://${window.AzureConfig?.storageAccount || 'bluemountaintravel'}.blob.core.windows.net/documents/${fallbackFileName}${window.AzureConfig?.sasToken || ''}`;
        bookingData.documentUrl = fallbackUrl;
        bookingData.confirmationUrl = fallbackUrl;
    }
    
    // Store booking in localStorage for immediate display
    let bookings = localStorage.getItem('bookings');
    bookings = bookings ? JSON.parse(bookings) : [];
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Save booking to SQL database via API
    const functionsKey = window.BMT_FUNCTION_KEY || window.AzureConfig?.apiConfig?.functionKey || window.AzureConfig?.apiConfig?.primaryKey;
    const userId = user?.UserID || user?.id || 'guest';
    
    try {
        const dbBookingData = {
            bookingId: bookingData.bookingId,
            userId: userId,
            bookingType: 'Flight',
            flightId: flight.id,
            travelDate: new Date().toISOString(), // Flight date would come from flight data
            numberOfGuests: 1,
            totalAmount: flight.price,
            status: 'Confirmed',
            confirmationCode: bookingData.bookingId,
            specialRequests: passengerData.specialRequests || null,
            documentUrl: bookingData.documentUrl || null
        };
        
        const response = await fetch(`${window.AzureConfig.apiConfig.endpoint}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(functionsKey ? { 'x-functions-key': functionsKey } : {})
            },
            body: JSON.stringify(dbBookingData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Booking saved to database:', result);
        } else {
            console.error('Failed to save booking to database:', response.status);
        }
    } catch (error) {
        console.error('Database booking error:', error);
    }
    
    let successMessage = `Flight booked successfully!\n\nBooking ID: ${bookingData.bookingId}\nPassenger: ${passengerData.firstName} ${passengerData.lastName}\nFlight: ${flight.airline} ${flight.flightNumber}\nAircraft: ${flight.aircraft || 'Boeing 787 Dreamliner'}\nRoute: ${flight.from} → ${flight.to}\nPrice: $${flight.price}\n\nCheck "My Bookings" to view your ticket.`;
    
    alert(successMessage);
    
    // Redirect to bookings page
    setTimeout(() => {
        window.location.href = 'bookings.html';
    }, 1500);
}
