// Profile page functionality
// ⚠️ VULNERABILITY: Multiple profiles stored in localStorage with all sensitive data
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
    
    console.log('Current user from localStorage:', currentUser);
    
    // Load and display the current user's profile FIRST
    loadProfile();
    
    // Then initialize multiple profiles
    initializeMultipleProfiles();
    loadProfilesList();
    setupCreateProfileForm();
});

// ⚠️ VULNERABILITY: Initialize multiple profiles from sample users
function initializeMultipleProfiles() {
    let profiles = localStorage.getItem('userProfiles');
    
    if (!profiles || profiles === '[]') {
        // ⚠️ VULNERABILITY: Storing all sample users including sensitive data
        let sampleUsers = window.sampleUsers || [];
        
        // If no sample users available, generate from database format
        if (sampleUsers.length === 0) {
            sampleUsers = generateDefaultProfiles();
        }
        
        localStorage.setItem('userProfiles', JSON.stringify(sampleUsers));
        console.log('Initialized user profiles with sample data:', sampleUsers);
        console.log('⚠️ All user data including passwords stored in localStorage');
    }
}

// Generate default profiles if window.sampleUsers not available
function generateDefaultProfiles() {
    return [
        {
            id: "USR001",
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@techcorp.com",
            phone: "+1-555-0123",
            company: "Tech Corp",
            membershipTier: "Platinum",
            password: "password123",
            creditCard: "4532-1234-5678-9012"
        },
        {
            id: "USR002",
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.johnson@globalind.com",
            phone: "+1-555-0234",
            company: "Global Industries",
            membershipTier: "Gold",
            password: "Sarah@2024",
            creditCard: "5412-7534-9012-3456"
        }
    ];
}

// ⚠️ VULNERABILITY: Get all profiles from localStorage
function getAllProfiles() {
    let profiles = localStorage.getItem('userProfiles');
    return profiles ? JSON.parse(profiles) : [];
}

// ⚠️ VULNERABILITY: Load and display all profiles
function loadProfilesList() {
    const profiles = getAllProfiles();
    const currentUserStr = localStorage.getItem('currentUser') || '{}';
    const currentUser = JSON.parse(currentUserStr);
    
    // Normalize current user ID for comparison (handle both db format and sample format)
    const currentUserId = currentUser.id || currentUser.UserID;
    
    // Update profile selector dropdown
    const selector = document.getElementById('profile-selector');
    if (selector) {
        selector.innerHTML = profiles.map(p => {
            const userId = p.id || p.UserID;
            const firstName = p.firstName || p.FirstName || 'Unknown';
            const lastName = p.lastName || p.LastName || 'User';
            const email = p.email || p.Email || 'unknown@example.com';
            return `<option value="${userId}" ${userId === currentUserId ? 'selected' : ''}>
                ${firstName} ${lastName} (${email})
            </option>`;
        }).join('');
    }
    
    // Update profiles grid
    const profilesList = document.getElementById('profiles-list');
    if (profilesList) {
        profilesList.innerHTML = profiles.map(p => {
            const userId = p.id || p.UserID;
            const firstName = p.firstName || p.FirstName || 'Unknown';
            const lastName = p.lastName || p.LastName || 'User';
            const email = p.email || p.Email || 'unknown@example.com';
            const membershipTier = p.membershipTier || p.MembershipTier || 'Standard';
            const initials = firstName.charAt(0) + lastName.charAt(0);
            const isActive = userId === currentUserId;
            
            return `
            <div style="background: ${isActive ? '#e3f2fd' : '#f8f9fa'}; 
                        padding: 1rem; 
                        border-radius: 8px; 
                        border: 2px solid ${isActive ? 'var(--primary-color)' : '#ddd'};
                        cursor: pointer;
                        transition: all 0.2s ease;"
                 onclick="selectProfile('${userId}')"
                 onmouseover="this.style.transform='translateY(-2px)'"
                 onmouseout="this.style.transform='translateY(0)'">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-color); 
                                color: white; display: flex; align-items: center; justify-content: center; 
                                font-weight: bold; font-size: 0.9rem;">
                        ${initials}
                    </div>
                    <div style="flex: 1; overflow: hidden;">
                        <div style="font-weight: 600; font-size: 0.95rem;">${firstName} ${lastName}</div>
                        <div style="font-size: 0.8rem; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${email}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--primary-color);">${membershipTier}</div>
                    </div>
                </div>
                ${isActive ? '<div style="font-size: 0.7rem; color: #28a745; margin-top: 0.5rem; text-align: center;">✓ Active</div>' : ''}
            </div>
        `}).join('');
    }
    
    console.log('Loaded', profiles.length, 'profiles');
    // ⚠️ VULNERABILITY: Logging all profiles including sensitive data
    console.log('All profiles:', profiles);
}

// ⚠️ VULNERABILITY: Select and switch to a different profile
function selectProfile(profileId) {
    const profiles = getAllProfiles();
    // Find profile by either id or UserID field (handle both formats)
    const profile = profiles.find(p => (p.id || p.UserID) === profileId);
    
    if (profile) {
        // ⚠️ VULNERABILITY: Storing complete profile with sensitive data
        localStorage.setItem('currentUser', JSON.stringify(profile));
        console.log('Switched to profile:', profile);
        console.log('⚠️ Password:', profile.password);
        console.log('⚠️ Credit Card:', profile.creditCard);
        
        // Reload the page to show new profile
        window.location.reload();
    } else {
        console.warn('Profile not found:', profileId);
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
        // Focus on first input for accessibility
        const firstInput = document.getElementById('new-firstName');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
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
    
    // Normalize user object to handle both database format (Email, UserID) and sample format (email, id)
    const firstName = user.firstName || user.FirstName || 'Unknown';
    const lastName = user.lastName || user.LastName || 'User';
    const email = user.email || user.Email || 'unknown@example.com';
    const phone = user.phone || user.Phone || '';
    const company = user.company || user.Company || '';
    const userId = user.id || user.UserID || '';
    const membershipTier = user.membershipTier || user.MembershipTier || 'Standard';
    const creditCard = user.creditCard || '****-****-****-****';
    const password = user.password || '••••••••';
    
    // ⚠️ VULNERABILITY: Logging complete user object including sensitive data
    console.log('Current user profile:', user);
    console.log('Displaying user:', firstName, lastName);
    console.log('User password (plain text):', password);
    console.log('User credit card:', creditCard);
    console.log('User SSN:', user.ssn);
    
    // Update profile display - ENSURE all elements are updated
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
    
    // Get all elements and update them with proper error checking
    const elements = {
        'profile-avatar': initials,
        'profile-name': `${firstName} ${lastName}`,
        'profile-email': email,
        'profile-tier': `${membershipTier} Member`,
        'info-firstname': firstName,
        'info-lastname': lastName,
        'info-email': email,
        'info-phone': phone || 'Not provided',
        'info-company': company || 'Not provided',
        'info-userid': userId,
        'info-tier': membershipTier
    };
    
    // Update all profile elements
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            console.log(`Updated ${id} to:`, value);
        } else {
            console.warn(`Element not found: ${id}`);
        }
    });
    
    // ⚠️ VULNERABILITY: Showing last 4 digits of real card number
    const cardLast4 = creditCard.slice(-4);
    const cardElement = document.getElementById('info-card');
    if (cardElement) {
        cardElement.textContent = `•••• •••• •••• ${cardLast4}`;
    }
    
    // ⚠️ VULNERABILITY: Showing real password length
    const passwordElement = document.getElementById('info-password');
    if (passwordElement) {
        passwordElement.textContent = '•'.repeat(password.length);
    }
    
    // Load booking count
    let bookings = localStorage.getItem('bookings');
    bookings = bookings ? JSON.parse(bookings) : [];
    const bookingsElement = document.getElementById('total-bookings');
    if (bookingsElement) {
        bookingsElement.textContent = bookings.length;
    }
    
    // ⚠️ VULNERABILITY: Direct Azure Storage URLs with SAS tokens
    let profileUrl = '';
    let documentsUrl = '';
    let bookingsUrl = '';
    
    const azureConfig = window.AzureConfig;
    if (azureConfig) {
        const storageElement = document.getElementById('storage-account');
        if (storageElement) {
            storageElement.textContent = azureConfig.storageAccount;
        }
        
        // ⚠️ VULNERABILITY: Exposed container URLs with SAS tokens
        profileUrl = azureConfig.storageUrls.profiles;
        documentsUrl = azureConfig.storageUrls.documents;
        bookingsUrl = azureConfig.storageUrls.bookings;
        
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
    
    // ⚠️ VULNERABILITY: Make user data globally accessible
    window.currentUserProfile = user;
    
    console.log('Profile loaded successfully');
    console.log('Azure Storage URLs:', {
        profiles: profileUrl,
        documents: documentsUrl,
        bookings: bookingsUrl
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
