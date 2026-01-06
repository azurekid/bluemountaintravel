// Register page functionality
// ⚠️ VULNERABILITY: No input validation or sanitization
// FLAG{insecure_registration_accepts_any_data}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Register page loaded');
    
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', handleRegister);
});

// ⚠️ VULNERABILITY: Client-side registration without server validation
function handleRegister(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        id: 'USR' + String(Date.now()).substr(-6),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,  // ⚠️ Plain text
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value || 'N/A',
        ssn: document.getElementById('ssn').value || '',  // ⚠️ SSN collected
        creditCard: document.getElementById('creditCard').value || '',  // ⚠️ Credit card collected
        cvv: document.getElementById('cvv').value || '',  // ⚠️ CVV collected
        cardExpiry: document.getElementById('cardExpiry').value || '',
        membershipTier: 'Silver',
        dateOfBirth: '',
        address: '',
        // ⚠️ VULNERABILITY: Auto-generating Azure credentials
        azureUsername: document.getElementById('email').value.split('@')[0] + '@bluemountain.onmicrosoft.com',
        azurePassword: 'Welcome2024!',  // ⚠️ Default weak password
        entraId: generateFakeEntraId(),
        registeredDate: new Date().toISOString()
    };
    
    console.log('Registration data (ALL SENSITIVE DATA LOGGED):');
    console.log(formData);
    // FLAG{all_registration_data_logged_to_console}
    
    // ⚠️ VULNERABILITY: No password strength requirement
    if (formData.password.length < 3) {
        console.log('Weak password detected but allowed:', formData.password);
    }
    
    // ⚠️ VULNERABILITY: No email verification
    console.log('No email verification required - account activated immediately');
    
    // ⚠️ VULNERABILITY: Storing all data in localStorage without encryption
    storeUserData(formData);
    
    // ⚠️ VULNERABILITY: Making API call with all sensitive data
    makeRegistrationApiCall(formData);
    
    alert('Registration successful!\n\nYour account has been created.\n\nEmail: ' + formData.email + '\nPassword: ' + formData.password + '\n\nYou can now log in.');
    
    // Auto-login the user
    localStorage.setItem('currentUser', JSON.stringify(formData));
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// ⚠️ VULNERABILITY: Storing user data in localStorage
function storeUserData(userData) {
    // Get existing users or create new array
    let users = localStorage.getItem('registeredUsers');
    users = users ? JSON.parse(users) : [];
    
    // Add new user
    users.push(userData);
    
    // ⚠️ VULNERABILITY: All data stored unencrypted
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    console.log('User data stored in localStorage');
    console.log('Total registered users:', users.length);
    console.log('All user data accessible at: localStorage.getItem("registeredUsers")');
}

// ⚠️ VULNERABILITY: Weak Entra ID generation
function generateFakeEntraId() {
    // Simple UUID-like generation (not secure)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ⚠️ VULNERABILITY: Sending all sensitive data to API
function makeRegistrationApiCall(userData) {
    const apiEndpoint = window.AzureConfig.apiConfig.endpoint + '/auth/register';
    
    console.log('Sending registration to:', apiEndpoint);
    console.log('Registration payload includes:', Object.keys(userData));
    
    // ⚠️ VULNERABILITY: Exposed credentials in headers
    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': window.AzureConfig.apiConfig.primaryKey,
            'X-Database-Connection': window.AzureConfig.databaseConfig.connectionString,
            'X-SAS-Token': window.AzureConfig.sasToken
        },
        body: JSON.stringify(userData)
    }).then(response => {
        console.log('Registration API response:', response);
        return response.json();
    }).then(data => {
        console.log('Registration API data:', data);
    }).catch(error => {
        console.log('Registration API call failed (expected for demo):', error);
    });
    
    // ⚠️ VULNERABILITY: Also store in Azure Blob Storage
    const blobUrl = `${window.AzureConfig.storageUrls.profiles}/user-${userData.id}.json`;
    console.log('User profile would be stored at:', blobUrl);
}

console.log('=== Registration Page Security Issues ===');
console.log('1. No input validation or sanitization');
console.log('2. Plain text password storage');
console.log('3. Collecting SSN and CVV unnecessarily');
console.log('4. No email verification');
console.log('5. All data logged to console');
console.log('6. Data stored unencrypted in localStorage');
console.log('7. Auto-generated weak Azure credentials');
console.log('=========================================');
