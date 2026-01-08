// Register page functionality
// ⚠️ VULNERABILITY: No input validation or sanitization
// ctf_b64: RkxBR3tpbnNlY3VyZV9yZWdpc3RyYXRpb25fYWNjZXB0c19hbnlfZGF0YX0=

document.addEventListener('DOMContentLoaded', function() {
    console.log('Register page loaded');
    
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', handleRegister);
});

// ⚠️ VULNERABILITY: Client-side registration with backend database storage
async function handleRegister(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,  // ⚠️ Plain text
        phone: document.getElementById('phone').value || '+1-555-0000'
    };
    
    console.log('Registration data (ALL SENSITIVE DATA LOGGED):');
    console.log(formData);
    // ctf_b64: RkxBR3thbGxfcmVnaXN0cmF0aW9uX2RhdGFfbG9nZ2VkX3RvX2NvbnNvbGV9
    
    // ⚠️ VULNERABILITY: No password strength requirement
    if (formData.password.length < 3) {
        console.log('Weak password detected but allowed:', formData.password);
    }
    
    // ⚠️ VULNERABILITY: No email verification
    console.log('No email verification required - account activated immediately');
    
    try {
        // ⚠️ VULNERABILITY: Sending plain text password to backend
        const base = (typeof window !== 'undefined' && window.BMT_API_BASE_URL)
            ? window.BMT_API_BASE_URL
            : (window.location.origin.includes('localhost')
                ? 'http://localhost:3000/api'
                : 'https://bluemountaintravel-func.azurewebsites.net/api');

        const response = await fetch(`${base}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Registration failed:', error);
            alert('Registration failed: ' + (error.error || 'Unknown error'));
            return;
        }
        
        const result = await response.json();
        console.log('Registration successful:', result);
        console.log('⚠️ VULNERABILITY: New user ID and details exposed:', result.userId);
        
        alert('Registration successful!\n\nYour account has been created.\n\nEmail: ' + formData.email + '\nUser ID: ' + result.userId + '\n\nYou can now log in.');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration error: ' + error.message);
    }
}

// ⚠️ VULNERABILITY: Generate fake Entra ID (not used anymore but kept for compatibility)
function generateFakeEntraId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

console.log('=== Registration Page Security Issues ===');
console.log('1. Plain text password sent to server');
console.log('2. No password strength requirements');
console.log('3. No email verification');
console.log('4. All registration data logged to console');
console.log('5. Password stored in plain text in database');
console.log('6. No CAPTCHA or bot prevention');
console.log('=========================================');
