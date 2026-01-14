// Login page functionality
// ⚠️ VULNERABILITY: Client-side authentication with no server validation
// ctf_b64: RkxBR3tjbGllbnRfc2lkZV9hdXRoZW50aWNhdGlvbl9ieXBhc3N9

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    
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

// ⚠️ VULNERABILITY: Client-side authentication without proper security
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    console.log('Login attempt:', {
        email: email,
        password: password,  // ⚠️ VULNERABILITY: Logging password
        timestamp: new Date().toISOString()
    });
    
    try {
        // ⚠️ VULNERABILITY: Password sent via GET query parameters
        // Query database through backend API (prefer configured Function host when provided)
        const base = (typeof window !== 'undefined' && window.BMT_API_BASE_URL)
            ? window.BMT_API_BASE_URL
            : (window.location.origin.includes('localhost')
                ? 'http://localhost:3000/api'
                : 'https://bluemountaintravel-func.azurewebsites.net/api');

        const functionsKey = window.BMT_FUNCTION_KEY || window.AzureConfig?.apiConfig?.functionKey || window.AzureConfig?.apiConfig?.primaryKey;
        const response = await fetch(`${base}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
            functionsKey ? { headers: { 'x-functions-key': functionsKey } } : undefined
        );
        
        if (!response.ok) {
            let bodyText = '';
            try {
                bodyText = await response.text();
            } catch (_) {}

            console.error('Login failed:', {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                body: bodyText
            });

            const msg = bodyText
                ? `Login failed (${response.status}).\n\n${bodyText}`
                : `Login failed (${response.status}). Please check your credentials.`;
            alert(msg);
            return;
        }
        
        const users = await response.json();
        
        if (users && users.length > 0) {
            const user = users[0];
            console.log('Authentication successful for user:', user);
            console.log('⚠️ VULNERABILITY: Full user record including password returned from API');
            
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
            
            // Update last login date
            updateLastLogin(user.UserID);
            
            showMessage('Login successful! Redirecting...', 'success');
            
            // Check for redirect parameter
            const urlParams = new URLSearchParams(window.location.search);
            const redirectTo = urlParams.get('redirect') || 'index.html';
            
            setTimeout(() => {
                window.location.href = redirectTo;
            }, 1000);
        } else {
            console.log('Authentication failed: Invalid credentials');
            alert('Invalid email or password. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login error: ' + error.message);
    }
}

// ⚠️ VULNERABILITY: Update last login date via backend API
async function updateLastLogin(userId) {
    try {
        // This would normally update the LastLoginDate in the database
        console.log('Updating last login for user:', userId);
    } catch (error) {
        console.error('Failed to update last login:', error);
    }
}

// Show message helper
function showMessage(message, type) {
    console.log(`[${type}] ${message}`);
}

// ⚠️ VULNERABILITY: Predictable session token generation
function generateFakeSessionToken(user) {
    // ⚠️ VULNERABILITY: Weak token generation
    const token = 'BMT-' + user.UserID + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    console.log('Generated session token:', token);
    // ctf_b64: RkxBR3twcmVkaWN0YWJsZV9zZXNzaW9uX3Rva2VuX2dlbmVyYXRpb259
    return token;
}

// ⚠️ VULNERABILITY: Expose functions globally for console access
window.generateFakeSessionToken = generateFakeSessionToken;

console.log('=== Login Page Security Issues ===');
console.log('1. Password sent via GET query parameters (visible in logs)');
console.log('2. Plain text passwords in localStorage and database');
console.log('3. No rate limiting on login attempts');
console.log('4. Full user record including password returned from API');
console.log('5. Predictable session token generation');
console.log('6. SQL injection vulnerability in backend');
console.log('====================================');
