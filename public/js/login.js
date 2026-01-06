// Login page functionality
// ⚠️ VULNERABILITY: Client-side authentication with no server validation
// FLAG{client_side_authentication_bypass}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    
    // ⚠️ VULNERABILITY: Logging loaded user data
    console.log('Available users in system:', window.sampleUsers || []);
    
    // Check if already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        console.log('User already logged in, redirecting...');
        // Optionally redirect to profile
        // window.location.href = 'profile.html';
    }
    
    // Load remembered credentials if available
    loadRememberedCredentials();
    
    // Set up form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
});

// ⚠️ VULNERABILITY: Credentials stored in localStorage
function loadRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    
    if (rememberedEmail && rememberedPassword) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('password').value = rememberedPassword;
        document.getElementById('remember').checked = true;
        
        console.log('Loaded remembered credentials for:', rememberedEmail);
        // ⚠️ VULNERABILITY: Logging password
        console.log('Password loaded from storage:', rememberedPassword);
    }
}

// ⚠️ VULNERABILITY: Client-side authentication without server verification
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    console.log('Login attempt:', {
        email: email,
        password: password,  // ⚠️ VULNERABILITY: Logging password
        timestamp: new Date().toISOString()
    });
    
    // ⚠️ VULNERABILITY: Client-side authentication logic
    const user = authenticateUser(email, password);
    
    if (user) {
        console.log('Authentication successful for user:', user);
        
        // ⚠️ VULNERABILITY: Storing sensitive user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('sessionToken', generateFakeSessionToken(user));
        localStorage.setItem('loginTimestamp', new Date().toISOString());
        
        // ⚠️ VULNERABILITY: Remember me functionality stores plain text password
        if (remember) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);  // ⚠️ Plain text password
            console.log('Credentials saved for future login');
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }
        
        // ⚠️ VULNERABILITY: Making API call with exposed credentials
        makeLoginApiCall(user, email, password);
        
        // Check if user is admin
        if (user.membershipTier === 'Admin') {
            console.log('🔑 ADMIN ACCESS GRANTED 🔑');
            console.log('Admin access key:', user.adminAccessKey);
            console.log('Azure Subscription ID:', user.azureSubscriptionId);
            console.log('Azure Tenant ID:', user.azureTenantId);
            // FLAG{admin_console_output_reveals_secrets}
            alert('Welcome Administrator!\n\nAdmin Panel: /admin.html\nAccess Key: ' + user.adminAccessKey);
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 2000);
        } else {
            alert('Login successful!\n\nWelcome back, ' + user.firstName + '!');
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        }
    } else {
        console.error('Authentication failed for:', email);
        // ⚠️ VULNERABILITY: Detailed error messages reveal user existence
        const userExists = checkUserExists(email);
        if (userExists) {
            alert('Login failed: Incorrect password');
            console.log('User exists but password incorrect');
        } else {
            alert('Login failed: User not found');
            console.log('User does not exist in system');
        }
    }
}

// ⚠️ VULNERABILITY: Authentication logic in client-side JavaScript
function authenticateUser(email, password) {
    // Get users from global scope
    const users = window.sampleUsers || [];
    
    console.log('Authenticating against', users.length, 'users');
    
    // ⚠️ VULNERABILITY: Simple string comparison, no hashing
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        console.log('User authenticated:', {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
            tier: user.membershipTier,
            // ⚠️ VULNERABILITY: Logging sensitive data
            creditCard: user.creditCard,
            ssn: user.ssn,
            azureUsername: user.azureUsername,
            azurePassword: user.azurePassword
        });
    }
    
    return user;
}

// ⚠️ VULNERABILITY: Information disclosure about user existence
function checkUserExists(email) {
    const users = window.sampleUsers || [];
    return users.some(u => u.email === email);
}

// ⚠️ VULNERABILITY: Predictable session token generation
function generateFakeSessionToken(user) {
    // ⚠️ VULNERABILITY: Weak token generation
    const token = 'BMT-' + user.id + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    console.log('Generated session token:', token);
    // FLAG{predictable_session_token_generation}
    return token;
}

// ⚠️ VULNERABILITY: Making API call with credentials in headers
function makeLoginApiCall(user, email, password) {
    const apiEndpoint = window.AzureConfig.apiConfig.endpoint + '/auth/login';
    
    const loginData = {
        email: email,
        password: password,  // ⚠️ Plain text password in request
        deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        },
        timestamp: new Date().toISOString()
    };
    
    console.log('Sending login request to:', apiEndpoint);
    console.log('Login payload:', loginData);
    
    // ⚠️ VULNERABILITY: Exposed API key and credentials in headers
    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': window.AzureConfig.apiConfig.primaryKey,
            'X-Database-Connection': window.AzureConfig.databaseConfig.connectionString,
            'X-SAS-Token': window.AzureConfig.sasToken
        },
        body: JSON.stringify(loginData)
    }).then(response => {
        console.log('Login API response:', response);
        return response.json();
    }).then(data => {
        console.log('Login API data:', data);
    }).catch(error => {
        console.log('Login API call failed (expected for demo):', error);
    });
}

// ⚠️ VULNERABILITY: Expose functions globally for console access
window.authenticateUser = authenticateUser;
window.checkUserExists = checkUserExists;
window.generateFakeSessionToken = generateFakeSessionToken;

console.log('=== Login Page Security Issues ===');
console.log('1. Client-side authentication');
console.log('2. Plain text passwords in localStorage');
console.log('3. No rate limiting on login attempts');
console.log('4. User enumeration through error messages');
console.log('5. Predictable session token generation');
console.log('6. Exposed API credentials in requests');
console.log('====================================');
