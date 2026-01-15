// Admin panel functionality
// ⚠️ VULNERABILITY: No authentication check for admin panel
// ctf_b64: RkxBR3thZG1pbl9wYW5lbF9hY2Nlc3NpYmxlX3dpdGhvdXRfYXV0aH0=

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Admin Panel Loaded');
    
    // Check authentication immediately
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        console.warn('No user logged in, redirecting to login page');
        // Redirect immediately without showing alert
        window.location.href = 'login.html';
        return;
    }

    // Support both demo users (membershipTier) and DB users (MembershipTier)
    const tier = (currentUser.membershipTier || currentUser.MembershipTier || '').toString();
    const isAdmin = tier.toLowerCase() === 'admin' || tier.toLowerCase() === 'administrator';

    if (!isAdmin) {
        console.warn('Non-admin user attempting to access admin panel');
        console.log('Current user tier:', tier || '(none)');
        // Redirect immediately without showing alert
        window.location.href = 'index.html';
        return;
    }

    // Access granted - show content
    document.body.classList.add('admin-authenticated');
    
    // Log all admin credentials on page load
    logAdminCredentials();

    // Initialize dynamic values
    initializeDynamicAdminValues();
    
    // Update user count
    updateUserCount();

    // Fetch additional DB info (admin password, profile counts)
    updateAdminDbInfo();
});

function getApiBaseUrl() {
    if (typeof window !== 'undefined' && window.BMT_API_BASE_URL) {
        return window.BMT_API_BASE_URL;
    }
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        // Local Azure Functions
        return 'http://localhost:7071/api';
    }
    return 'https://bluemountaintravel-func.azurewebsites.net/api';
}

function getFunctionsKey() {
    return (
        window.BMT_FUNCTION_KEY ||
        window.AzureConfig?.apiConfig?.functionKey ||
        window.AzureConfig?.apiConfig?.primaryKey ||
        null
    );
}

function generateGuid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    // Fallback UUIDv4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function base64EncodeAscii(value) {
    // Value is ASCII by design for CTF flags/IDs.
    try {
        return btoa(value);
    } catch (e) {
        console.warn('btoa failed, returning raw value', e);
        return value;
    }
}

function getOrCreateAdminKeyBase64() {
    const storageKey = 'bmt_admin_key_b64';
    const existing = localStorage.getItem(storageKey);
    if (existing) return existing;

    // Embed a flag inside the base64 payload (CTF-style).
    const hiddenFlag = 'FLAG{admin_key_exposed_in_panel}';
    const payload = `BMT|ADMIN|${hiddenFlag}|${generateGuid()}|${Date.now()}`;
    const encoded = base64EncodeAscii(payload);
    localStorage.setItem(storageKey, encoded);
    return encoded;
}

function getOrCreateApiKeys() {
    const storageKey = 'bmt_api_keys';
    const existing = localStorage.getItem(storageKey);
    if (existing) {
        try {
            const parsed = JSON.parse(existing);
            if (parsed?.primary && parsed?.secondary) return parsed;
        } catch (_) {
            // ignore
        }
    }

    const created = {
        primary: generateGuid(),
        secondary: generateGuid(),
        updatedAt: new Date().toISOString()
    };
    localStorage.setItem(storageKey, JSON.stringify(created));
    return created;
}

function initializeDynamicAdminValues() {
    // Admin Key
    const adminKeyEl = document.getElementById('admin-key');
    if (adminKeyEl) {
        adminKeyEl.textContent = getOrCreateAdminKeyBase64();
    }

    // API keys
    try {
        localStorage.removeItem('bmt_api_keys');
    } catch (_) {
        // ignore
    }
    const primaryEl = document.getElementById('api-primary-key');
    const secondaryEl = document.getElementById('api-secondary-key');
    if (primaryEl) primaryEl.textContent = 'Click Regenerate Keys';
    if (secondaryEl) secondaryEl.textContent = 'Click Regenerate Keys';
}

// ⚠️ VULNERABILITY: Logging all sensitive admin credentials
function logAdminCredentials() {
    const adminKey = getOrCreateAdminKeyBase64();

    console.log('=== ADMIN CREDENTIALS ===');
    console.log('Admin Access Key (base64):', adminKey);
    console.log('Azure Subscription ID:', '12345678-1234-1234-1234-123456789012');
    console.log('Azure Tenant ID:', '87654321-4321-4321-4321-210987654321');
    console.log('Database Server:', 'bluemountaintravel-sql.database.windows.net');
    console.log('Database Username:', 'admin');
    console.log('Database Password:', 'P@ssw0rd123!');
    console.log('Entra Admin:', 'admin@bluemountain.onmicrosoft.com');
    console.log('Entra Password:', 'AzureAdmin2026!@#');
    console.log('Service Principal App ID:', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    console.log('Service Principal Secret:', 'SuperSecret123!@#$%');
    console.log('========================');
    // ctf_b64: RkxBR3thbGxfYWRtaW5fY3JlZGVudGlhbHNfbG9nZ2VkX3RvX2NvbnNvbGV9
}

async function fetchAdminInfoFromDb() {
    const base = getApiBaseUrl();
    const functionsKey = getFunctionsKey();

    const res = await fetch(`${base}/users?action=adminInfo`, {
        headers: {
            ...(functionsKey ? { 'x-functions-key': functionsKey } : {})
        }
    });

    if (!res.ok) {
        throw new Error(`AdminInfo API returned ${res.status}`);
    }

    return await res.json();
}

async function updateAdminDbInfo() {
    const adminPasswordEl = document.getElementById('admin-password');
    const profileCountEl = document.getElementById('profile-count');
    if (!adminPasswordEl && !profileCountEl) return;

    try {
        const data = await fetchAdminInfoFromDb();
        const adminUser = data?.adminUser || null;
        const counts = data?.counts || {};

        if (adminPasswordEl) {
            adminPasswordEl.textContent = adminUser?.password || '(not found)';
        }

        if (profileCountEl) {
            const users = Number(counts.userProfiles || 0);
            const active = Number(counts.activeUsers || 0);
            const passports = Number(counts.passportProfiles || 0);
            profileCountEl.textContent = `Profiles in DB: ${users} users (${active} active), ${passports} passports`;
        }

        // ⚠️ VULNERABILITY: log the fetched admin password
        if (adminUser?.email && adminUser?.password) {
            console.log('Admin DB User:', adminUser.email);
            console.log('Admin DB Password (fetched):', adminUser.password);
        }
    } catch (error) {
        console.warn('Could not fetch admin DB info:', error);
        if (adminPasswordEl) adminPasswordEl.textContent = '(db info unavailable)';
        if (profileCountEl) profileCountEl.textContent = 'Profiles in DB: (unavailable)';
    }
}

async function updateUserCount() {
    const el = document.getElementById('user-count');
    if (!el) return;

    const systemUsers = window.sampleUsers || [];
    const registeredUsersRaw = localStorage.getItem('registeredUsers');
    const registeredUsers = registeredUsersRaw ? JSON.parse(registeredUsersRaw) : [];
    const localTotal = systemUsers.length + registeredUsers.length;

    el.textContent = `Total Users: ${localTotal} (local: ${systemUsers.length} system + ${registeredUsers.length} registered, db: loading...)`;

    try {
        const base = getApiBaseUrl();
        const functionsKey = getFunctionsKey();

        const res = await fetch(`${base}/users?action=count`, {
            headers: {
                ...(functionsKey ? { 'x-functions-key': functionsKey } : {})
            }
        });

        if (!res.ok) {
            throw new Error(`Users count API returned ${res.status}`);
        }

        const data = await res.json();
        const dbTotal = Number(data.total || 0);
        const dbActive = Number(data.active || 0);

        el.textContent = `Total Users: ${dbTotal + localTotal} (db: ${dbTotal} total / ${dbActive} active, local: ${localTotal})`;
    } catch (error) {
        console.warn('Could not fetch DB user count:', error);
        el.textContent = `Total Users: ${localTotal} (local only; db count unavailable)`;
    }
}

function showAzureCredentials() {
    const credentials = `
=== AZURE CREDENTIALS ===

Subscription ID: 12345678-1234-1234-1234-123456789012
Tenant ID: 87654321-4321-4321-4321-210987654321
Resource Group: bluemountain-rg

Management Certificate: 
MIIKDAIBAzCCCcwGCSqGSIb3DQEHAaCCCb0Eggm5MIIJtTCCBe4GCSqGSIb3DQEHAaCCBd8EggXb...

Service Principal:
  App ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Object ID: 12345678-abcd-ef12-3456-789012345678
  Client Secret: SuperSecret123!@#$%
  
Login Command:
az login --service-principal -u a1b2c3d4-e5f6-7890-abcd-ef1234567890 -p SuperSecret123!@#$% --tenant 87654321-4321-4321-4321-210987654321

Portal URL: https://portal.azure.com/#@bluemountain.onmicrosoft.com
========================
    `;
    
    alert(credentials);
    console.log(credentials);
    // ctf_b64: RkxBR3thenVyZV9zZXJ2aWNlX3ByaW5jaXBhbF93aXRoX2Z1bGxfYWNjZXNzfQ==
}

function showConnectionString() {
    const connectionString = 'Server=tcp:bluemountaintravel-sql.database.windows.net,1433;Initial Catalog=TravelDB;Persist Security Info=False;User ID=bmt_reader;Password=R3ad0nly2024!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;';
    
    alert('Database Connection String:\n\n' + connectionString);
    console.log('Full Connection String:', connectionString);
    
    // ⚠️ VULNERABILITY: Also show connection via different methods
    console.log('Connect via Azure CLI:');
    console.log('az sql db show-connection-string --client ado.net --name TravelDB --server bluemountaintravel-sql');
    console.log('\nDirect SQL Connection:');
    console.log('sqlcmd -S bluemountaintravel-sql.database.windows.net -d TravelDB -U bmt_reader -P R3ad0nly2024!');
    // ctf_b64: RkxBR3tzcWxfY29ubmVjdGlvbl9zdHJpbmdfZnVsbHlfZXhwb3NlZH0=
}

function viewAllUsers() {
    viewAllUsersAsync();
}

async function viewAllUsersAsync() {
    const systemUsers = window.sampleUsers || [];
    const registeredUsersRaw = localStorage.getItem('registeredUsers');
    const registeredUsers = registeredUsersRaw ? JSON.parse(registeredUsersRaw) : [];
    const localUsers = [...systemUsers, ...registeredUsers];

    let dbUsers = [];
    try {
        const base = getApiBaseUrl();
        const functionsKey = getFunctionsKey();
        const res = await fetch(`${base}/users?action=list`, {
            headers: {
                ...(functionsKey ? { 'x-functions-key': functionsKey } : {})
            }
        });
        if (res.ok) {
            dbUsers = await res.json();
        }
    } catch (e) {
        console.warn('Could not fetch DB users:', e);
    }

    const allUsers = [...dbUsers, ...localUsers];

    console.log('=== ALL USERS (DB + LOCAL) ===');
    console.table(allUsers);
    console.log('Total users:', allUsers.length, { db: dbUsers.length, local: localUsers.length });
    // ctf_b64: RkxBR3thbGxfdXNlcl9waWlfZHVtcGVkX2luY2x1ZGluZ19wYXNzd29yZHN9

    alert(`Found ${allUsers.length} users (db: ${dbUsers.length}, local: ${localUsers.length}). Check console for details.`);
}

function exportUserData() {
    exportUserDataAsync();
}

async function exportUserDataAsync() {
    const systemUsers = window.sampleUsers || [];
    const registeredUsersRaw = localStorage.getItem('registeredUsers');
    const registeredUsers = registeredUsersRaw ? JSON.parse(registeredUsersRaw) : [];
    const localUsers = [...systemUsers, ...registeredUsers];

    let dbUsers = [];
    try {
        const base = getApiBaseUrl();
        const functionsKey = getFunctionsKey();
        const res = await fetch(`${base}/users?action=list`, {
            headers: {
                ...(functionsKey ? { 'x-functions-key': functionsKey } : {})
            }
        });
        if (res.ok) {
            dbUsers = await res.json();
        }
    } catch (e) {
        console.warn('Could not fetch DB users for export:', e);
    }

    const allUsers = [...dbUsers, ...localUsers];

    // ⚠️ VULNERABILITY: Export as JSON
    const userData = JSON.stringify(allUsers, null, 2);

    const blob = new Blob([userData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export-' + Date.now() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('User data exported (db + local)');
    // ctf_b64: RkxBR3t1c2VyX2RhdGFfZXhwb3J0X2NvbnRhaW5zX2V2ZXJ5dGhpbmd9

    alert(`User data exported successfully!\n\nUsers exported: ${allUsers.length} (db: ${dbUsers.length}, local: ${localUsers.length}).`);
}

function showSASToken() {
    const sasToken = window.AzureConfig.sasToken;
    const storageAccount = window.AzureConfig.storageAccount;
    
    const info = `
=== AZURE STORAGE SAS TOKEN ===

Storage Account: ${storageAccount}
SAS Token: ${sasToken}

Container URLs with SAS:
- Bookings: https://${storageAccount}.blob.core.windows.net/bookings${sasToken}
- Profiles: https://${storageAccount}.blob.core.windows.net/profiles${sasToken}
- Documents: https://${storageAccount}.blob.core.windows.net/documents${sasToken}

This token grants FULL permissions (read, write, delete, list) until 2025-12-31

Azure Storage Explorer connection string:
BlobEndpoint=https://${storageAccount}.blob.core.windows.net/;SharedAccessSignature=${sasToken.substring(1)}
=============================
    `;
    
    alert(info);
    console.log(info);
    // ctf_b64: RkxBR3tzYXNfdG9rZW5fd2l0aF9mdWxsX3Blcm1pc3Npb25zX3VudGlsXzIwMjV9
}

function regenerateKeys() {
    console.warn('Regenerating API keys...');

    // Primary key: Use the real Azure Functions key from config
    const realFunctionKey = getFunctionsKey();
    const newPrimary = realFunctionKey || 'bmT_' + generateRandomString(52) + '==';
    
    // Secondary key: CTF flag
    const newSecondary = 'FLAG{api_keys_exposed_in_admin_panel}';

    const stored = {
        primary: newPrimary,
        secondary: newSecondary,
        updatedAt: new Date().toISOString()
    };
    localStorage.setItem('bmt_api_keys', JSON.stringify(stored));

    const primaryEl = document.getElementById('api-primary-key');
    const secondaryEl = document.getElementById('api-secondary-key');
    if (primaryEl) primaryEl.textContent = newPrimary;
    if (secondaryEl) secondaryEl.textContent = newSecondary;

    console.log('New Primary Key (Function Key):', newPrimary);
    console.log('New Secondary Key (CTF Flag):', newSecondary);

    const keySource = realFunctionKey ? '(Real Azure Functions Key)' : '(Generated Key)';
    
    alert('API Keys Regenerated:\n\n' +
          'Primary Key ' + keySource + ':\n' + newPrimary + '\n\n' +
          'Secondary Key (Backup):\n' + newSecondary + '\n\n' +
          'Use Primary Key with: curl -H "x-functions-key: ' + newPrimary + '" <endpoint>\n\n' +
          'Example:\ncurl -H "x-functions-key: ' + newPrimary + '" http://localhost:7071/api/health\n\n' +
          'Old keys will be invalidated in 24 hours.');
    // ctf_b64: RkxBR3thcGlfa2V5X3JlZ2VuZXJhdGlvbl9wcmVkaWN0YWJsZX0=
}

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    const randomArray = new Uint8Array(length);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(randomArray);
        for (let i = 0; i < length; i++) {
            result += chars[randomArray[i] % chars.length];
        }
    } else {
        // Fallback for environments without crypto
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
    }
    return result;
}

function showServicePrincipalDetails() {
    const details = `
=== SERVICE PRINCIPAL DETAILS ===

Display Name: BlueMountainTravel-ServicePrincipal
Application (Client) ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
Object ID: 12345678-abcd-ef12-3456-789012345678
Directory (Tenant) ID: 87654321-4321-4321-4321-210987654321

Client Secret: SuperSecret123!@#$%
Secret ID: secret-id-12345
Expires: 2025-12-31

Permissions:
- Contributor on subscription
- Storage Blob Data Contributor
- SQL DB Contributor
- Key Vault Administrator

Authentication:
az login --service-principal \\
  --username a1b2c3d4-e5f6-7890-abcd-ef1234567890 \\
  --password SuperSecret123!@#$% \\
  --tenant 87654321-4321-4321-4321-210987654321

Microsoft Graph API access token endpoint:
https://login.microsoftonline.com/87654321-4321-4321-4321-210987654321/oauth2/v2.0/token

==================================
    `;
    
    alert(details);
    console.log(details);
    // ctf_b64: RkxBR3tzZXJ2aWNlX3ByaW5jaXBhbF9jYW5fYWNjZXNzX2FsbF9henVyZV9yZXNvdXJjZXN9
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionToken');
    console.log('User logged out');
    window.location.href = 'login.html';
}

// ⚠️ VULNERABILITY: Expose all functions globally
window.showAzureCredentials = showAzureCredentials;
window.showConnectionString = showConnectionString;
window.viewAllUsers = viewAllUsers;
window.exportUserData = exportUserData;
window.showSASToken = showSASToken;
window.regenerateKeys = regenerateKeys;
window.showServicePrincipalDetails = showServicePrincipalDetails;
window.logout = logout;

console.log('=== ADMIN PANEL VULNERABILITIES ===');
console.log('1. No authentication required to access');
console.log('2. All credentials displayed in plain text');
console.log('3. Full user PII export available');
console.log('4. Azure subscription access exposed');
console.log('5. Service Principal with full permissions');
console.log('6. Database connection string exposed');
console.log('7. SAS token with excessive permissions');
console.log('====================================');
