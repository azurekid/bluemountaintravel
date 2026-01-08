// User enumeration API endpoint simulation
// ⚠️ VULNERABILITY: User enumeration without rate limiting
// FLAG{user_enumeration_endpoint_exposed}

document.addEventListener('DOMContentLoaded', function() {
    console.log('API endpoints available for testing');
    logApiEndpoints();
});

// ⚠️ VULNERABILITY: Public API for user enumeration
function checkUserExists(email) {
    // Simulate API call that reveals if user exists
    const users = window.sampleUsers || [];
    const registeredUsers = localStorage.getItem('registeredUsers');
    const allUsers = [...users];
    
    if (registeredUsers) {
        allUsers.push(...JSON.parse(registeredUsers));
    }
    
    const userExists = allUsers.some(u => u.email === email);
    
    // ⚠️ VULNERABILITY: Different response times/messages reveal user existence
    if (userExists) {
        console.log(`[API] User enumeration: ${email} - EXISTS`);
        return { 
            exists: true, 
            message: "Email is already registered",
            responseTime: Math.random() * 100 + 200 // 200-300ms
        };
    } else {
        console.log(`[API] User enumeration: ${email} - NOT FOUND`);
        return { 
            exists: false, 
            message: "Email not found",
            responseTime: Math.random() * 50 + 50 // 50-100ms - faster response for non-existent
        };
    }
}

// ⚠️ VULNERABILITY: Password spray endpoint without rate limiting
function attemptPasswordSpray(emailList, password) {
    console.log('=== PASSWORD SPRAY ATTEMPT ===');
    console.log(`Testing password: ${password} against ${emailList.length} accounts`);
    // FLAG{password_spray_no_rate_limiting}
    
    const results = [];
    const users = window.sampleUsers || [];
    const registeredUsers = localStorage.getItem('registeredUsers');
    const allUsers = [...users];
    
    if (registeredUsers) {
        allUsers.push(...JSON.parse(registeredUsers));
    }
    
    emailList.forEach(email => {
        const user = allUsers.find(u => u.email === email);
        
        if (user && user.password === password) {
            console.log(`✓ SUCCESS: ${email} / ${password}`);
            results.push({
                email: email,
                success: true,
                user: user, // ⚠️ Returns full user object
                azureUsername: user.azureUsername,
                azurePassword: user.azurePassword
            });
        } else if (user) {
            console.log(`✗ FAILED: ${email} / ${password}`);
            results.push({
                email: email,
                success: false,
                message: "Invalid password"
            });
        } else {
            console.log(`✗ NOT FOUND: ${email}`);
            results.push({
                email: email,
                success: false,
                message: "User not found"
            });
        }
        
        // ⚠️ VULNERABILITY: No delay between attempts
    });
    
    console.log('=== SPRAY RESULTS ===');
    console.table(results);
    console.log(`Successful logins: ${results.filter(r => r.success).length}`);
    
    return results;
}

// ⚠️ VULNERABILITY: SQL database password spray
function attemptDatabasePasswordSpray(usernames, password) {
    console.log('=== DATABASE PASSWORD SPRAY ===');
    console.log(`Attempting SQL authentication with password: ${password}`);
    // FLAG{sql_password_spray_vulnerable}
    
    const dbConfig = window.AzureConfig.databaseConfig;
    console.log('Target database:', dbConfig.server);
    console.log('Database name:', dbConfig.database);
    
    const commonUsernames = usernames || ['admin', 'sa', 'root', 'administrator', 'sqluser', 'dbadmin'];
    const results = [];
    
    commonUsernames.forEach(username => {
        // Simulate database login attempt
        const connectionString = `Server=tcp:${dbConfig.server},1433;Initial Catalog=${dbConfig.database};User ID=${username};Password=${password};`;
        
        console.log(`Testing: ${username} / ${password}`);
        
        // Check against known credentials
        if (username === dbConfig.username && password === dbConfig.password) {
            console.log(`✓ SUCCESS: Database login successful!`);
            console.log('Connection string:', connectionString);
            results.push({
                username: username,
                password: password,
                success: true,
                connectionString: connectionString,
                access: 'db_owner' // ⚠️ Full database access
            });
        } else {
            results.push({
                username: username,
                success: false
            });
        }
    });
    
    console.log('=== DATABASE SPRAY RESULTS ===');
    console.table(results);
    
    const successful = results.filter(r => r.success);
    if (successful.length > 0) {
        console.log('🚨 SUCCESSFUL DATABASE AUTHENTICATION:');
        successful.forEach(s => {
            console.log(`Username: ${s.username}`);
            console.log(`Password: ${s.password}`);
            console.log(`Connection: ${s.connectionString}`);
        });
    }
    
    return results;
}

// ⚠️ VULNERABILITY: Azure AD / Entra ID password spray
function attemptEntraPasswordSpray(usernames, password) {
    console.log('=== ENTRA ID PASSWORD SPRAY ===');
    console.log(`Attempting Entra authentication with password: ${password}`);
    // FLAG{entra_id_password_spray_no_protection}
    
    const tenant = 'bluemountain.onmicrosoft.com';
    const users = window.sampleUsers || [];
    const results = [];
    
    const targetUsernames = usernames || users.map(u => u.azureUsername).filter(u => u);
    
    targetUsernames.forEach(username => {
        console.log(`Testing Entra ID: ${username} / ${password}`);
        
        const user = users.find(u => u.azureUsername === username);
        
        if (user && user.azurePassword === password) {
            console.log(`✓ SUCCESS: Entra ID login successful for ${username}`);
            results.push({
                username: username,
                password: password,
                success: true,
                tenant: tenant,
                entraId: user.entraId,
                membershipTier: user.membershipTier,
                // ⚠️ VULNERABILITY: Expose tokens
                accessToken: generateFakeAccessToken(user),
                refreshToken: generateFakeRefreshToken(user)
            });
        } else {
            results.push({
                username: username,
                success: false
            });
        }
    });
    
    console.log('=== ENTRA SPRAY RESULTS ===');
    console.table(results);
    
    const successful = results.filter(r => r.success);
    if (successful.length > 0) {
        console.log('🚨 SUCCESSFUL ENTRA AUTHENTICATION:');
        successful.forEach(s => {
            console.log(`User: ${s.username}`);
            console.log(`Password: ${s.password}`);
            console.log(`Entra ID: ${s.entraId}`);
            console.log(`Access Token: ${s.accessToken}`);
        });
    }
    
    return results;
}

// Helper functions for token generation
function generateFakeAccessToken(user) {
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        aud: 'https://graph.microsoft.com',
        iss: 'https://sts.windows.net/87654321-4321-4321-4321-210987654321/',
        sub: user.entraId,
        upn: user.azureUsername,
        roles: user.membershipTier === 'Admin' ? ['Global Administrator'] : ['User'],
        exp: Math.floor(Date.now() / 1000) + 3600
    }));
    const signature = btoa('fake-signature-' + Math.random().toString(36));
    return `${header}.${payload}.${signature}`;
}

function generateFakeRefreshToken(user) {
    return 'refresh_token_' + user.entraId + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
}

// ⚠️ VULNERABILITY: Enumerate all emails in system
function enumerateAllUsers() {
    console.log('=== USER ENUMERATION ===');
    // FLAG{enumerate_all_users_no_auth}
    
    const users = window.sampleUsers || [];
    const registeredUsers = localStorage.getItem('registeredUsers');
    const allUsers = [...users];
    
    if (registeredUsers) {
        allUsers.push(...JSON.parse(registeredUsers));
    }
    
    const emails = allUsers.map(u => u.email);
    const azureUsernames = allUsers.map(u => u.azureUsername).filter(u => u);
    
    console.log('All email addresses in system:');
    console.log(emails);
    console.log('');
    console.log('All Azure/Entra usernames:');
    console.log(azureUsernames);
    console.log('');
    console.log(`Total users: ${allUsers.length}`);
    
    return {
        emails: emails,
        azureUsernames: azureUsernames,
        count: allUsers.length
    };
}

// Log API endpoints for testing
function logApiEndpoints() {
    console.log('');
    console.log('=== AVAILABLE API FUNCTIONS FOR TESTING ===');
    console.log('');
    console.log('1. User Enumeration:');
    console.log('   checkUserExists("email@example.com")');
    console.log('   enumerateAllUsers()');
    console.log('');
    console.log('2. Password Spraying:');
    console.log('   attemptPasswordSpray(["email1@example.com", "email2@example.com"], "password")');
    console.log('   attemptDatabasePasswordSpray(["admin", "sa"], "password")');
    console.log('   attemptEntraPasswordSpray(["user@bluemountain.onmicrosoft.com"], "password")');
    console.log('');
    console.log('3. Common Password Lists:');
    console.log('   ["password123", "Password123", "Winter2026!", "Summer2026!", "Admin@123"]');
    console.log('');
    console.log('4. Known Working Credentials:');
    console.log('   Database: admin / P@ssw0rd123!');
    console.log('   Entra Admin: admin@bluemountain.onmicrosoft.com / AzureAdmin2026!@#');
    console.log('   User: john.smith@bluemountain.onmicrosoft.com / Winter2026!');
    console.log('');
    console.log('===========================================');
}

// ⚠️ VULNERABILITY: Expose all functions globally
window.checkUserExists = checkUserExists;
window.attemptPasswordSpray = attemptPasswordSpray;
window.attemptDatabasePasswordSpray = attemptDatabasePasswordSpray;
window.attemptEntraPasswordSpray = attemptEntraPasswordSpray;
window.enumerateAllUsers = enumerateAllUsers;

console.log('Password spray and enumeration endpoints loaded');
console.log('Run logApiEndpoints() for usage examples');
