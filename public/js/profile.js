// Profile page functionality
// Fetch user profile from database API
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading profile page...');
    
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        console.log('No user logged in, redirecting to login page');
        alert('Please log in to view your profile.');
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(currentUser);
    const userEmail = user.email || user.Email;
    
    if (!userEmail) {
        console.error('No email found in user object');
        alert('Unable to load profile. Please log in again.');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('Loading profile for:', userEmail);
    
    // Load profile from API
    loadProfileFromAPI(userEmail);
});

// Fetch profile from database API
async function loadProfileFromAPI(email) {
    try {
        // Show loading state
        document.getElementById('profile-name').textContent = 'Loading...';
        
        // Get API base URL
        const apiBaseUrl = window.BMT_API_BASE_URL || 
                          (window.location.hostname === 'localhost' ? 'http://localhost:7071/api' : 'https://bluemountaintravel-func.azurewebsites.net/api');
        
        const response = await fetch(`${apiBaseUrl}/profile?email=${encodeURIComponent(email)}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load profile: ${response.status}`);
        }
        
        const profile = await response.json();
        console.log('Profile loaded from API:', profile);
        
        // Display profile data
        displayProfile(profile);
        
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Failed to load profile from database. Please try again.');
        
        // Fallback to localStorage data
        loadProfileFromLocalStorage();
    }
}

// Display profile data on page
function displayProfile(profile) {
    // Update profile display
    const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    
    // Get all elements and update them
    const elements = {
        'profile-avatar': initials,
        'profile-name': `${profile.firstName} ${profile.lastName}`,
        'profile-email': profile.email,
        'profile-tier': `${profile.membershipTier} Member`,
        'info-firstname': profile.firstName,
        'info-lastname': profile.lastName,
        'info-email': profile.email,
        'info-phone': profile.phone || 'Not provided',
        'info-company': profile.company || 'Not provided',
        'info-userid': profile.userId,
        'info-tier': profile.membershipTier
    };
    
    // Update all profile elements
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Display passport information if available
    if (profile.passport) {
        displayPassportInfo(profile.passport);
    }
    
    // Update other elements
    const cardLast4 = '****'; // Don't expose card number from API
    const cardElement = document.getElementById('info-card');
    if (cardElement) {
        cardElement.textContent = `•••• •••• •••• ${cardLast4}`;
    }
    
    const passwordElement = document.getElementById('info-password');
    if (passwordElement) {
        passwordElement.textContent = '••••••••';
    }
    
    // Load booking count
    let bookings = localStorage.getItem('bookings');
    bookings = bookings ? JSON.parse(bookings) : [];
    const bookingsElement = document.getElementById('total-bookings');
    if (bookingsElement) {
        bookingsElement.textContent = bookings.length;
    }
    
    // Update Azure Storage URLs
    const azureConfig = window.AzureConfig;
    if (azureConfig) {
        const storageElement = document.getElementById('storage-account');
        if (storageElement) {
            storageElement.textContent = azureConfig.storageAccount;
        }
        
        const profileUrl = azureConfig.storageUrls.profiles;
        const documentsUrl = azureConfig.storageUrls.documents;
        
        const profileUrlElement = document.getElementById('profile-container-url');
        if (profileUrlElement) {
            profileUrlElement.href = profileUrl;
            profileUrlElement.textContent = 'Open Profiles Container';
        }
        
        const docsUrlElement = document.getElementById('documents-container-url');
        if (docsUrlElement) {
            docsUrlElement.href = documentsUrl;
            docsUrlElement.textContent = 'Open Documents Container';
        }
    }
    
    console.log('Profile displayed successfully');
}

// Display passport information
function displayPassportInfo(passport) {
    console.log('Displaying passport info:', passport);
    
    // Find or create passport info section
    let passportSection = document.getElementById('passport-info-section');
    if (!passportSection) {
        // Create passport section after personal info
        const personalInfoCard = document.querySelector('.profile-card');
        if (personalInfoCard && personalInfoCard.parentNode) {
            passportSection = document.createElement('div');
            passportSection.id = 'passport-info-section';
            passportSection.className = 'profile-card';
            passportSection.style.marginTop = '2rem';
            personalInfoCard.parentNode.insertBefore(passportSection, personalInfoCard.nextSibling);
        }
    }
    
    if (passportSection) {
        passportSection.innerHTML = `
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🛂 Passport Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Passport Number:</span>
                    <span class="info-value">${passport.passportNumber}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Full Name:</span>
                    <span class="info-value">${passport.givenNames} ${passport.surname}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Nationality:</span>
                    <span class="info-value">${passport.nationality}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date of Birth:</span>
                    <span class="info-value">${new Date(passport.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Issue Date:</span>
                    <span class="info-value">${new Date(passport.dateOfIssue).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Expiry Date:</span>
                    <span class="info-value">${new Date(passport.dateOfExpiry).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Issuing Authority:</span>
                    <span class="info-value">${passport.issuingAuthority}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Place of Issue:</span>
                    <span class="info-value">${passport.placeOfIssue}</span>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <p style="font-size: 0.85rem; color: #666;">⚠️ Passport document stored in Azure Blob Storage</p>
                ${passport.blobStorageUrl ? `<a href="${passport.blobStorageUrl}" target="_blank" class="btn-search" style="display: inline-block; margin-top: 0.5rem; padding: 0.5rem 1rem; font-size: 0.9rem; text-decoration: none;">View Passport Document</a>` : ''}
            </div>
        `;
    }
}

// Fallback to localStorage if API fails
function loadProfileFromLocalStorage() {
    let user = localStorage.getItem('currentUser');
    
    if (!user) {
        console.log('No user found in localStorage');
        window.location.href = 'index.html';
        return;
    }
    
    user = JSON.parse(user);
    
    // Normalize user object
    const profile = {
        userId: user.id || user.UserID || '',
        firstName: user.firstName || user.FirstName || 'Unknown',
        lastName: user.lastName || user.LastName || 'User',
        email: user.email || user.Email || 'unknown@example.com',
        phone: user.phone || user.Phone || '',
        company: user.company || user.Company || '',
        membershipTier: user.membershipTier || user.MembershipTier || 'Standard'
    };
    
    displayProfile(profile);
    console.log('Profile loaded from localStorage (fallback)');
}

// ⚠️ VULNERABILITY: Function to show raw user data in console
function showRawUserData() {
    const user = localStorage.getItem('currentUser');
    const bookings = localStorage.getItem('bookings');
    
    console.log('=== RAW USER DATA ===');
    console.log('Current User:', JSON.parse(user));
    console.log('Bookings:', JSON.parse(bookings || '[]'));
    console.log('All localStorage:', { ...localStorage });
    console.log('====================');
    
    alert('User data has been logged to the console. Press F12 to view.\n\nThis demonstrates a security vulnerability:\nExposing sensitive data in browser console.');
}

// ⚠️ VULNERABILITY: Function to show Azure configuration in console
function showAzureConfig() {
    const azureConfig = window.AzureConfig;
    
    const displayConfig = {
        storageAccount: azureConfig.storageAccount,
        containers: {
            profiles: azureConfig.storageUrls.profiles,
            bookings: azureConfig.storageUrls.bookings,
            documents: azureConfig.storageUrls.documents
        },
        sasToken: azureConfig.sasToken,
        databaseConnection: azureConfig.sqlConfig,
        vulnerabilities: [
            'Exposed SAS tokens in client code',
            'Database credentials visible',
            'Long-lived access tokens',
            'Public storage access',
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
