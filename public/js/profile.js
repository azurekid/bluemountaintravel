// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading profile page...');
    loadProfile();
});

function loadProfile() {
    // ⚠️ VULNERABILITY: Reading sensitive user data from localStorage
    let user = localStorage.getItem('currentUser');
    
    if (!user) {
        console.log('No user found, redirecting to home...');
        window.location.href = 'index.html';
        return;
    }
    
    user = JSON.parse(user);
    
    // ⚠️ VULNERABILITY: Logging complete user object including sensitive data
    console.log('Current user profile:', user);
    console.log('User password (plain text):', user.password);
    console.log('User credit card:', user.creditCard);
    console.log('User SSN:', user.ssn);
    
    // Update profile display
    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    document.getElementById('profile-avatar').textContent = initials;
    document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-tier').textContent = `${user.membershipTier} Member`;
    
    document.getElementById('info-firstname').textContent = user.firstName;
    document.getElementById('info-lastname').textContent = user.lastName;
    document.getElementById('info-email').textContent = user.email;
    document.getElementById('info-phone').textContent = user.phone;
    document.getElementById('info-company').textContent = user.company;
    document.getElementById('info-userid').textContent = user.id;
    document.getElementById('info-tier').textContent = user.membershipTier;
    
    // ⚠️ VULNERABILITY: Showing last 4 digits of real card number
    const cardLast4 = user.creditCard.slice(-4);
    document.getElementById('info-card').textContent = `•••• •••• •••• ${cardLast4}`;
    
    // ⚠️ VULNERABILITY: Showing real password length
    document.getElementById('info-password').textContent = '•'.repeat(user.password.length);
    
    // Load booking count
    let bookings = localStorage.getItem('bookings');
    bookings = bookings ? JSON.parse(bookings) : [];
    document.getElementById('total-bookings').textContent = bookings.length;
    
    // ⚠️ VULNERABILITY: Direct Azure Storage URLs with SAS tokens
    const azureConfig = window.AzureConfig;
    document.getElementById('storage-account').textContent = azureConfig.storageAccount;
    
    // ⚠️ VULNERABILITY: Exposed container URLs with SAS tokens
    const profileUrl = azureConfig.storageUrls.profiles;
    const documentsUrl = azureConfig.storageUrls.documents;
    
    document.getElementById('profile-container-url').href = profileUrl;
    document.getElementById('profile-container-url').textContent = 'Open Profiles Container';
    document.getElementById('documents-container-url').href = documentsUrl;
    document.getElementById('documents-container-url').textContent = 'Open Documents Container';
    
    // ⚠️ VULNERABILITY: Make user data globally accessible
    window.currentUserProfile = user;
    
    console.log('Profile loaded successfully');
    console.log('Azure Storage URLs:', {
        profiles: profileUrl,
        documents: documentsUrl,
        bookings: azureConfig.storageUrls.bookings
    });
}

// ⚠️ VULNERABILITY: Function that displays raw user data including passwords
function showRawUserData() {
    const user = localStorage.getItem('currentUser');
    const userData = JSON.parse(user);
    
    const displayData = {
        ...userData,
        // ⚠️ Including sensitive fields
        password: userData.password,
        creditCard: userData.creditCard,
        ssn: userData.ssn,
        storedIn: 'localStorage',
        vulnerabilities: [
            'Plain text password storage',
            'Unencrypted credit card data',
            'SSN stored in browser',
            'No authentication required',
            'Client-side only validation'
        ]
    };
    
    console.log('=== RAW USER DATA ===');
    console.log(JSON.stringify(displayData, null, 2));
    console.log('====================');
    
    alert('Raw user data has been logged to the console. Press F12 to view.\n\nThis demonstrates the security vulnerability of storing sensitive data in localStorage.');
}

// ⚠️ VULNERABILITY: Function that displays complete Azure configuration
function showAzureConfig() {
    const azureConfig = window.AzureConfig;
    
    const displayConfig = {
        ...azureConfig,
        vulnerabilities: [
            'SAS tokens in client-side code',
            'Long-lived SAS tokens (expires 2025)',
            'Excessive SAS permissions (rwdlacupiytfx)',
            'Database credentials in JavaScript',
            'API keys exposed',
            'Public blob containers'
        ],
        exploitExamples: [
            'Anyone can access: ' + azureConfig.storageUrls.profiles,
            'Direct database connection: ' + azureConfig.databaseConfig.connectionString,
            'API access with: ' + azureConfig.apiConfig.primaryKey
        ]
    };
    
    console.log('=== AZURE CONFIGURATION ===');
    console.log(JSON.stringify(displayConfig, null, 2));
    console.log('==========================');
    
    alert('Azure configuration has been logged to the console. Press F12 to view.\n\nThis demonstrates multiple security vulnerabilities:\n\n1. Exposed SAS tokens\n2. Database credentials\n3. API keys in client code\n4. Public storage access\n5. Long-lived tokens');
}

// ⚠️ VULNERABILITY: Function to upload user profile picture to Azure Storage
function uploadProfilePicture(file) {
    const user = window.currentUserProfile;
    const azureConfig = window.AzureConfig;
    
    // ⚠️ VULNERABILITY: Constructing direct blob URL with SAS token
    const blobUrl = `${azureConfig.storageUrls.profiles}/${user.id}-profile-${Date.now()}.jpg`;
    
    console.log('Uploading profile picture to:', blobUrl);
    console.log('Using SAS token:', azureConfig.sasToken);
    
    // ⚠️ VULNERABILITY: Making request with exposed SAS token
    fetch(blobUrl, {
        method: 'PUT',
        headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': file.type
        },
        body: file
    }).then(response => {
        console.log('Upload response:', response);
        alert('Profile picture uploaded successfully!\n\nURL: ' + blobUrl);
    }).catch(error => {
        console.error('Upload error:', error);
    });
}

// ⚠️ VULNERABILITY: Function to download all user data
function downloadUserData() {
    const user = localStorage.getItem('currentUser');
    const bookings = localStorage.getItem('bookings');
    const azureConfig = window.AzureConfig;
    
    const completeData = {
        user: JSON.parse(user),
        bookings: JSON.parse(bookings || '[]'),
        azureConfiguration: azureConfig,
        localStorageData: { ...localStorage },
        exportDate: new Date().toISOString(),
        securityNotes: 'This export contains all user data including sensitive information'
    };
    
    const dataStr = JSON.stringify(completeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `user-data-export-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('User data exported:', completeData);
}

// Make functions available globally
window.showRawUserData = showRawUserData;
window.showAzureConfig = showAzureConfig;
window.uploadProfilePicture = uploadProfilePicture;
window.downloadUserData = downloadUserData;
