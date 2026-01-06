// Profile page functionality
// ⚠️ VULNERABILITY: Multiple profiles stored in localStorage with all sensitive data
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading profile page...');
    initializeMultipleProfiles();
    loadProfile();
    loadProfilesList();
    setupCreateProfileForm();
});

// ⚠️ VULNERABILITY: Initialize multiple profiles from sample users
function initializeMultipleProfiles() {
    let profiles = localStorage.getItem('userProfiles');
    
    if (!profiles) {
        // ⚠️ VULNERABILITY: Storing all sample users including sensitive data
        const sampleUsers = window.sampleUsers || [];
        localStorage.setItem('userProfiles', JSON.stringify(sampleUsers));
        console.log('Initialized user profiles with sample data:', sampleUsers);
        console.log('⚠️ All user data including passwords stored in localStorage');
    }
}

// ⚠️ VULNERABILITY: Get all profiles from localStorage
function getAllProfiles() {
    let profiles = localStorage.getItem('userProfiles');
    return profiles ? JSON.parse(profiles) : [];
}

// ⚠️ VULNERABILITY: Load and display all profiles
function loadProfilesList() {
    const profiles = getAllProfiles();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Update profile selector dropdown
    const selector = document.getElementById('profile-selector');
    if (selector) {
        selector.innerHTML = profiles.map(p => 
            `<option value="${p.id}" ${p.id === currentUser.id ? 'selected' : ''}>
                ${p.firstName} ${p.lastName} (${p.email})
            </option>`
        ).join('');
    }
    
    // Update profiles grid
    const profilesList = document.getElementById('profiles-list');
    if (profilesList) {
        profilesList.innerHTML = profiles.map(p => `
            <div style="background: ${p.id === currentUser.id ? '#e3f2fd' : '#f8f9fa'}; 
                        padding: 1rem; 
                        border-radius: 8px; 
                        border: 2px solid ${p.id === currentUser.id ? 'var(--primary-color)' : '#ddd'};
                        cursor: pointer;
                        transition: all 0.2s ease;"
                 onclick="selectProfile('${p.id}')"
                 onmouseover="this.style.transform='translateY(-2px)'"
                 onmouseout="this.style.transform='translateY(0)'">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-color); 
                                color: white; display: flex; align-items: center; justify-content: center; 
                                font-weight: bold; font-size: 0.9rem;">
                        ${p.firstName.charAt(0)}${p.lastName.charAt(0)}
                    </div>
                    <div style="flex: 1; overflow: hidden;">
                        <div style="font-weight: 600; font-size: 0.95rem;">${p.firstName} ${p.lastName}</div>
                        <div style="font-size: 0.8rem; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${p.email}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--primary-color);">${p.membershipTier}</div>
                    </div>
                </div>
                ${p.id === currentUser.id ? '<div style="font-size: 0.7rem; color: #28a745; margin-top: 0.5rem; text-align: center;">✓ Active</div>' : ''}
            </div>
        `).join('');
    }
    
    console.log('Loaded', profiles.length, 'profiles');
    // ⚠️ VULNERABILITY: Logging all profiles including sensitive data
    console.log('All profiles:', profiles);
}

// ⚠️ VULNERABILITY: Select and switch to a different profile
function selectProfile(profileId) {
    const profiles = getAllProfiles();
    const profile = profiles.find(p => p.id === profileId);
    
    if (profile) {
        // ⚠️ VULNERABILITY: Storing complete profile with sensitive data
        localStorage.setItem('currentUser', JSON.stringify(profile));
        console.log('Switched to profile:', profile);
        console.log('⚠️ Password:', profile.password);
        console.log('⚠️ Credit Card:', profile.creditCard);
        
        // Reload the page to show new profile
        window.location.reload();
    }
}

// Switch profile from dropdown
function switchProfile() {
    const selector = document.getElementById('profile-selector');
    if (selector && selector.value) {
        selectProfile(selector.value);
    }
}

// Show create profile modal
function showCreateProfileModal() {
    const modal = document.getElementById('create-profile-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Hide create profile modal
function hideCreateProfileModal() {
    const modal = document.getElementById('create-profile-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Clear form
    document.getElementById('create-profile-form').reset();
}

// Setup create profile form
function setupCreateProfileForm() {
    const form = document.getElementById('create-profile-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            createNewProfile();
        });
    }
}

// ⚠️ VULNERABILITY: Create new profile with sensitive data stored in plain text
function createNewProfile() {
    const newProfile = {
        id: 'USR' + Date.now(),
        firstName: document.getElementById('new-firstName').value,
        lastName: document.getElementById('new-lastName').value,
        email: document.getElementById('new-email').value,
        // ⚠️ VULNERABILITY: Password stored in plain text
        password: document.getElementById('new-password').value,
        phone: document.getElementById('new-phone').value || '+1-555-0000',
        company: document.getElementById('new-company').value || 'N/A',
        membershipTier: 'Silver',
        // ⚠️ VULNERABILITY: Default sensitive data
        creditCard: '4111-1111-1111-' + Math.floor(1000 + Math.random() * 9000),
        cvv: String(Math.floor(100 + Math.random() * 900)),
        cardExpiry: '12/28',
        ssn: '000-00-' + String(Math.floor(1000 + Math.random() * 9000)),
        dateOfBirth: '1990-01-01',
        address: '123 New User St',
        // ⚠️ VULNERABILITY: Auto-generated Azure credentials
        azureUsername: document.getElementById('new-email').value.split('@')[0] + '@bluemountain.onmicrosoft.com',
        azurePassword: 'Welcome2024!',
        entraId: generateUUID(),
        createdDate: new Date().toISOString()
    };
    
    // ⚠️ VULNERABILITY: Logging new profile with all sensitive data
    console.log('Creating new profile:', newProfile);
    console.log('⚠️ Password:', newProfile.password);
    console.log('⚠️ Credit Card:', newProfile.creditCard);
    
    // Add to profiles list
    const profiles = getAllProfiles();
    profiles.push(newProfile);
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
    
    // Set as current user
    localStorage.setItem('currentUser', JSON.stringify(newProfile));
    
    // Hide modal and reload
    hideCreateProfileModal();
    alert('Profile created successfully!\n\nWelcome, ' + newProfile.firstName + '!');
    window.location.reload();
}

// ⚠️ VULNERABILITY: Delete current profile
function deleteCurrentProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.id) {
        alert('No profile selected to delete.');
        return;
    }
    
    // Don't allow deleting the admin
    if (currentUser.membershipTier === 'Admin') {
        alert('Cannot delete admin profile.');
        return;
    }
    
    if (!confirm('Are you sure you want to delete the profile for ' + currentUser.firstName + ' ' + currentUser.lastName + '?\n\nThis action cannot be undone.')) {
        return;
    }
    
    // Remove from profiles list
    let profiles = getAllProfiles();
    profiles = profiles.filter(p => p.id !== currentUser.id);
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
    
    console.log('Deleted profile:', currentUser);
    
    // Switch to first available profile or clear
    if (profiles.length > 0) {
        localStorage.setItem('currentUser', JSON.stringify(profiles[0]));
        alert('Profile deleted. Switched to ' + profiles[0].firstName + ' ' + profiles[0].lastName);
    } else {
        localStorage.removeItem('currentUser');
        alert('Profile deleted. No profiles remaining.');
    }
    
    window.location.reload();
}

// Generate UUID for Entra ID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Make functions available globally
window.switchProfile = switchProfile;
window.selectProfile = selectProfile;
window.showCreateProfileModal = showCreateProfileModal;
window.hideCreateProfileModal = hideCreateProfileModal;
window.createNewProfile = createNewProfile;
window.deleteCurrentProfile = deleteCurrentProfile;
window.getAllProfiles = getAllProfiles;

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
