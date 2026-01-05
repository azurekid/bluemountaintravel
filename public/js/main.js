// Blue Mountain Travel - Main JavaScript
// WARNING: This code contains intentional security vulnerabilities for training purposes

// ⚠️ VULNERABILITY: Exposed Azure Storage SAS Token
const AZURE_STORAGE_SAS_TOKEN = "?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=FakeSignatureForDemo123456789==";
const STORAGE_ACCOUNT_NAME = "bluemountaintravel";

// ⚠️ VULNERABILITY: Hardcoded API Keys
const API_CONFIG = {
    primaryKey: "fake-api-key-12345",
    secondaryKey: "fake-api-key-67890",
    endpoint: "https://bluemountaintravel.azurewebsites.net/api"
};

// ⚠️ VULNERABILITY: Database Connection String in Client Code
const DATABASE_CONFIG = {
    server: "bluemountaintravel.database.windows.net",
    database: "TravelDB",
    username: "admin",
    password: "P@ssw0rd123!",
    connectionString: "Server=tcp:bluemountaintravel.database.windows.net,1433;Initial Catalog=TravelDB;User ID=admin;Password=P@ssw0rd123!;"
};

// ⚠️ VULNERABILITY: Public Blob Storage URLs
const STORAGE_URLS = {
    bookings: `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/bookings${AZURE_STORAGE_SAS_TOKEN}`,
    profiles: `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/profiles${AZURE_STORAGE_SAS_TOKEN}`,
    documents: `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/documents${AZURE_STORAGE_SAS_TOKEN}`
};

// Sample flight data
const flightData = [
    {
        id: "FL001",
        airline: "Delta Airlines",
        flightNumber: "DL1234",
        from: "New York (JFK)",
        to: "London (LHR)",
        departure: "08:00 AM",
        arrival: "08:30 PM",
        duration: "7h 30m",
        class: "Business",
        price: 749,
        availableSeats: 12
    },
    {
        id: "FL002",
        airline: "United Airlines",
        flightNumber: "UA5678",
        from: "San Francisco (SFO)",
        to: "Tokyo (NRT)",
        departure: "11:00 AM",
        arrival: "2:30 PM +1",
        duration: "11h 30m",
        class: "Business",
        price: 999,
        availableSeats: 8
    },
    {
        id: "FL003",
        airline: "American Airlines",
        flightNumber: "AA9012",
        from: "Chicago (ORD)",
        to: "Paris (CDG)",
        departure: "5:00 PM",
        arrival: "7:00 AM +1",
        duration: "8h 00m",
        class: "Business",
        price: 699,
        availableSeats: 15
    },
    {
        id: "FL004",
        airline: "Emirates",
        flightNumber: "EK2345",
        from: "New York (JFK)",
        to: "Dubai (DXB)",
        departure: "10:30 PM",
        arrival: "7:00 PM +1",
        duration: "12h 30m",
        class: "First Class",
        price: 1299,
        availableSeats: 4
    },
    {
        id: "FL005",
        airline: "Lufthansa",
        flightNumber: "LH6789",
        from: "Los Angeles (LAX)",
        to: "Frankfurt (FRA)",
        departure: "3:00 PM",
        arrival: "11:00 AM +1",
        duration: "11h 00m",
        class: "Business",
        price: 899,
        availableSeats: 10
    },
    {
        id: "FL006",
        airline: "Singapore Airlines",
        flightNumber: "SQ1122",
        from: "San Francisco (SFO)",
        to: "Singapore (SIN)",
        departure: "11:30 PM",
        arrival: "7:00 AM +2",
        duration: "16h 30m",
        class: "Business",
        price: 1099,
        availableSeats: 6
    }
];

// Sample hotel data
const hotelData = [
    {
        id: "HT001",
        name: "Grand Hyatt New York",
        location: "New York, USA",
        rating: 5,
        roomType: "Executive Suite",
        amenities: ["WiFi", "Breakfast", "Gym", "Pool", "Business Center"],
        price: 299,
        available: true
    },
    {
        id: "HT002",
        name: "The Ritz-Carlton London",
        location: "London, UK",
        rating: 5,
        roomType: "Deluxe Room",
        amenities: ["WiFi", "Breakfast", "Spa", "Concierge"],
        price: 399,
        available: true
    },
    {
        id: "HT003",
        name: "Park Hyatt Tokyo",
        location: "Tokyo, Japan",
        rating: 5,
        roomType: "Park King Room",
        amenities: ["WiFi", "Breakfast", "Gym", "City View"],
        price: 449,
        available: true
    },
    {
        id: "HT004",
        name: "Four Seasons George V",
        location: "Paris, France",
        rating: 5,
        roomType: "Superior Room",
        amenities: ["WiFi", "Breakfast", "Spa", "Restaurant"],
        price: 499,
        available: true
    },
    {
        id: "HT005",
        name: "Burj Al Arab Jumeirah",
        location: "Dubai, UAE",
        rating: 5,
        roomType: "Deluxe Suite",
        amenities: ["WiFi", "Butler Service", "Private Beach", "Chauffeur"],
        price: 899,
        available: true
    },
    {
        id: "HT006",
        name: "Marina Bay Sands",
        location: "Singapore",
        rating: 5,
        roomType: "Premier Room",
        amenities: ["WiFi", "Infinity Pool", "Casino", "Sky Park"],
        price: 349,
        available: true
    }
];

// Sample user data - ⚠️ VULNERABILITY: Storing sensitive data in localStorage
const sampleUsers = [
    {
        id: "USR001",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@company.com",
        phone: "+1-555-0123",
        company: "Tech Corp",
        membershipTier: "Platinum",
        // ⚠️ VULNERABILITY: Password stored in plain text
        password: "password123",
        creditCard: "4532-1234-5678-9012",
        ssn: "123-45-6789"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Blue Mountain Travel - Initializing...');
    
    // ⚠️ VULNERABILITY: Logging sensitive configuration
    console.log('Azure Configuration:', {
        storageAccount: STORAGE_ACCOUNT_NAME,
        sasToken: AZURE_STORAGE_SAS_TOKEN,
        apiKeys: API_CONFIG,
        database: DATABASE_CONFIG
    });
    
    initializeTabSwitching();
    initializeDateFields();
    initializeSearchForms();
    loadUserData();
    
    console.log('Application initialized successfully');
});

// Tab switching functionality
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchContents = document.querySelectorAll('.search-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            searchContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabName}-search`).classList.add('active');
        });
    });
}

// Initialize date fields with default values
function initializeDateFields() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    // Set default dates
    const departureDate = document.getElementById('departure-date');
    const returnDate = document.getElementById('return-date');
    const checkinDate = document.getElementById('checkin-date');
    const checkoutDate = document.getElementById('checkout-date');
    
    if (departureDate) departureDate.value = formatDate(tomorrow);
    if (returnDate) returnDate.value = formatDate(nextWeek);
    if (checkinDate) checkinDate.value = formatDate(tomorrow);
    if (checkoutDate) checkoutDate.value = formatDate(nextWeek);
}

// Initialize search forms
function initializeSearchForms() {
    const searchForms = document.querySelectorAll('.search-form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const searchType = this.closest('.search-content').id.replace('-search', '');
            
            console.log(`Searching ${searchType}...`, Object.fromEntries(formData));
            
            // ⚠️ VULNERABILITY: Sending data with exposed credentials
            sendSearchRequest(searchType, Object.fromEntries(formData));
            
            // Redirect to appropriate page
            if (searchType === 'flights') {
                window.location.href = 'flights.html';
            } else if (searchType === 'hotels') {
                window.location.href = 'hotels.html';
            }
        });
    });
}

// ⚠️ VULNERABILITY: Function that exposes API calls with credentials
function sendSearchRequest(type, data) {
    const requestData = {
        type: type,
        searchParams: data,
        // ⚠️ VULNERABILITY: Including credentials in request
        apiKey: API_CONFIG.primaryKey,
        sasToken: AZURE_STORAGE_SAS_TOKEN,
        user: getCurrentUser()
    };
    
    console.log('Sending request to:', API_CONFIG.endpoint);
    console.log('Request data:', requestData);
    
    // Store in localStorage - ⚠️ VULNERABILITY: Sensitive data in browser storage
    localStorage.setItem('lastSearch', JSON.stringify(requestData));
}

// Load user data from localStorage
function loadUserData() {
    let user = localStorage.getItem('currentUser');
    
    if (!user) {
        // ⚠️ VULNERABILITY: Auto-login with default credentials
        user = sampleUsers[0];
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Auto-logged in with default user:', user.email);
    } else {
        user = JSON.parse(user);
    }
    
    return user;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// ⚠️ VULNERABILITY: Direct blob storage access function
function uploadToAzureStorage(file, containerName) {
    const blobUrl = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${file.name}${AZURE_STORAGE_SAS_TOKEN}`;
    
    console.log('Uploading to Azure Storage:', blobUrl);
    
    // This would make an actual upload in production
    return blobUrl;
}

// ⚠️ VULNERABILITY: Function that constructs URLs with SAS tokens
function getDocumentUrl(documentId) {
    return `${STORAGE_URLS.documents}/${documentId}`;
}

// Export data for use in other pages
if (typeof window !== 'undefined') {
    window.FlightData = flightData;
    window.HotelData = hotelData;
    window.AzureConfig = {
        storageAccount: STORAGE_ACCOUNT_NAME,
        sasToken: AZURE_STORAGE_SAS_TOKEN,
        storageUrls: STORAGE_URLS,
        apiConfig: API_CONFIG,
        databaseConfig: DATABASE_CONFIG
    };
}

// ⚠️ VULNERABILITY: Console logging function that exposes internal data
function debugLog(message, data) {
    console.log(`[DEBUG] ${message}`, data);
    console.log('Current Configuration:', window.AzureConfig);
    console.log('Current User:', getCurrentUser());
}

// Set up global error handler - ⚠️ VULNERABILITY: Exposes stack traces
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error occurred:', {
        message: msg,
        url: url,
        lineNo: lineNo,
        columnNo: columnNo,
        error: error,
        stack: error ? error.stack : 'N/A',
        config: window.AzureConfig,
        user: getCurrentUser()
    });
    return false;
};

console.log('=== Blue Mountain Travel - Security Training Demo ===');
console.log('This application contains intentional security vulnerabilities:');
console.log('1. Exposed SAS tokens in client-side code');
console.log('2. Hardcoded API keys and credentials');
console.log('3. Database connection strings in JavaScript');
console.log('4. Sensitive data in localStorage');
console.log('5. Public blob storage URLs');
console.log('6. Detailed error logging with sensitive information');
console.log('===============================================');
