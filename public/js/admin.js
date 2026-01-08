// Admin panel functionality
// ⚠️ VULNERABILITY: No authentication check for admin panel
// FLAG{admin_panel_accessible_without_auth}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Admin Panel Loaded');
    
    // Check authentication
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        console.warn('No user logged in, redirecting to login page');
        alert('Please log in to access the admin panel.');
        window.location.href = 'login.html';
        return;
    } else if (currentUser.membershipTier !== 'Admin') {
        console.warn('Non-admin user attempting to access admin panel');
        console.log('Current user tier:', currentUser.membershipTier);
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return;
    }
    
    // Log all admin credentials on page load
    logAdminCredentials();
    
    // Update user count
    updateUserCount();
});

// ⚠️ VULNERABILITY: Logging all sensitive admin credentials
function logAdminCredentials() {
    console.log('=== ADMIN CREDENTIALS ===');
    console.log('Admin Access Key:', 'BMT-ADMIN-KEY-2026-PROD-abc123xyz789');
    console.log('Azure Subscription ID:', '12345678-1234-1234-1234-123456789012');
    console.log('Azure Tenant ID:', '87654321-4321-4321-4321-210987654321');
    console.log('Database Server:', 'bluemountaintravel.database.windows.net');
    console.log('Database Username:', 'admin');
    console.log('Database Password:', 'P@ssw0rd123!');
    console.log('API Primary Key:', 'fake-api-key-12345');
    console.log('Entra Admin:', 'admin@bluemountain.onmicrosoft.com');
    console.log('Entra Password:', 'AzureAdmin2026!@#');
    console.log('Service Principal App ID:', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    console.log('Service Principal Secret:', 'SuperSecret123!@#$%');
    console.log('========================');
    // FLAG{all_admin_credentials_logged_to_console}
}

function updateUserCount() {
    const users = window.sampleUsers || [];
    const registeredUsers = localStorage.getItem('registeredUsers');
    const totalUsers = users.length + (registeredUsers ? JSON.parse(registeredUsers).length : 0);
    
    document.getElementById('user-count').textContent = `Total Users: ${totalUsers} (${users.length} system + ${registeredUsers ? JSON.parse(registeredUsers).length : 0} registered)`;
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
    // FLAG{azure_service_principal_with_full_access}
}

function showConnectionString() {
    const connectionString = 'Server=tcp:bluemountaintravel.database.windows.net,1433;Initial Catalog=TravelDB;Persist Security Info=False;User ID=admin;Password=P@ssw0rd123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;';
    
    alert('Database Connection String:\n\n' + connectionString);
    console.log('Full Connection String:', connectionString);
    
    // ⚠️ VULNERABILITY: Also show connection via different methods
    console.log('Connect via Azure CLI:');
    console.log('az sql db show-connection-string --client ado.net --name TravelDB --server bluemountaintravel');
    console.log('\nDirect SQL Connection:');
    console.log('sqlcmd -S bluemountaintravel.database.windows.net -d TravelDB -U admin -P P@ssw0rd123!');
    // FLAG{sql_connection_string_fully_exposed}
}

function viewAllUsers() {
    const systemUsers = window.sampleUsers || [];
    const registeredUsers = localStorage.getItem('registeredUsers');
    const allUsers = [...systemUsers];
    
    if (registeredUsers) {
        allUsers.push(...JSON.parse(registeredUsers));
    }
    
    console.log('=== ALL USERS WITH FULL PII DATA ===');
    console.table(allUsers);
    console.log('Total users:', allUsers.length);
    
    // ⚠️ VULNERABILITY: Log sensitive data
    allUsers.forEach(user => {
        console.log(`\nUser: ${user.email}`);
        console.log('Password:', user.password);
        console.log('SSN:', user.ssn);
        console.log('Credit Card:', user.creditCard);
        console.log('CVV:', user.cvv);
        console.log('Azure Username:', user.azureUsername);
        console.log('Azure Password:', user.azurePassword);
        console.log('Entra ID:', user.entraId);
    });
    // FLAG{all_user_pii_dumped_including_passwords}
    
    alert(`Found ${allUsers.length} users. Check console for full details including passwords, SSNs, and credit cards.`);
}

function exportUserData() {
    const systemUsers = window.sampleUsers || [];
    const registeredUsers = localStorage.getItem('registeredUsers');
    const allUsers = [...systemUsers];
    
    if (registeredUsers) {
        allUsers.push(...JSON.parse(registeredUsers));
    }
    
    // ⚠️ VULNERABILITY: Export all sensitive data as JSON
    const userData = JSON.stringify(allUsers, null, 2);
    
    // Create download
    const blob = new Blob([userData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export-' + Date.now() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('User data exported with all PII, passwords, and Azure credentials');
    // FLAG{user_data_export_contains_everything}
    
    alert('User data exported successfully!\n\nFile contains all passwords, SSNs, credit cards, and Azure credentials in plain text.');
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
    // FLAG{sas_token_with_full_permissions_until_2025}
}

function regenerateKeys() {
    console.warn('Regenerating API keys...');
    
    // ⚠️ VULNERABILITY: "Regenerated" keys are still predictable
    const newPrimary = 'fake-api-key-' + Math.random().toString(36).substr(2, 9);
    const newSecondary = 'fake-api-key-' + Math.random().toString(36).substr(2, 9);
    
    console.log('New Primary Key:', newPrimary);
    console.log('New Secondary Key:', newSecondary);
    
    alert('API Keys Regenerated:\n\nPrimary: ' + newPrimary + '\nSecondary: ' + newSecondary + '\n\nOld keys will be invalidated in 24 hours.');
    // FLAG{api_key_regeneration_predictable}
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
    // FLAG{service_principal_can_access_all_azure_resources}
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
