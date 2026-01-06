# Blue Mountain Travel - Student Security Training Playbook

## 🎓 Welcome, Security Student!

This playbook is your guided journey through discovering security vulnerabilities in the Blue Mountain Travel application. Follow each exercise step-by-step to learn about web application security, Azure misconfigurations, and attack techniques.

**Difficulty Levels**:
- 🟢 **Beginner** - No prior security knowledge needed
- 🟡 **Intermediate** - Basic security concepts helpful
- 🔴 **Advanced** - Requires understanding of cloud security

**Time Required**: 4-6 hours

---

## 📋 Table of Contents

1. [Setup & Orientation](#1-setup--orientation)
2. [Reconnaissance Phase](#2-reconnaissance-phase)
3. [User Enumeration](#3-user-enumeration)
4. [Authentication Bypass](#4-authentication-bypass)
5. [Password Spraying](#5-password-spraying)
6. [Data Exposure](#6-data-exposure)
7. [Admin Panel Discovery](#7-admin-panel-discovery)
8. [Azure Storage Exploitation](#8-azure-storage-exploitation)
9. [Passport Document Access](#9-passport-document-access)
10. [Lateral Movement](#10-lateral-movement)
11. [Service Principal Abuse](#11-service-principal-abuse)
12. [IDOR Vulnerabilities](#12-idor-vulnerabilities)
13. [Final Challenge](#13-final-challenge)

---

## 1. Setup & Orientation

### 🟢 Exercise 1.1: Start the Application

**Objective**: Get the application running on your machine.

**Steps**:
```bash
# Navigate to project directory
cd bluemountaintravel

# Install dependencies
npm install

# Start the web server
npm start

# Open browser to http://localhost:8080
```

**Success Criteria**: You can see the Blue Mountain Travel homepage.

**Flag Found**: None yet - just getting started!

---

### 🟢 Exercise 1.2: Initial Reconnaissance

**Objective**: Explore the application like a normal user.

**Steps**:
1. Click through all navigation links: Home, Flights, Hotels, Destinations
2. Try to book a flight or hotel
3. Look for a login page
4. Note any unusual behavior or exposed information

**Questions to Consider**:
- What pages are publicly accessible?
- Is authentication required anywhere?
- What data is displayed without logging in?

**Flag Location**: Look in the browser console on page load for hints!

**Expected Flags**: 
- `FLAG{exposed_flight_data_in_client_side_code}`

---

## 2. Reconnaissance Phase

### 🟢 Exercise 2.1: View Page Source

**Objective**: Learn to find hidden information in HTML source code.

**Steps**:
1. Right-click on the homepage and select "View Page Source"
2. Search for the word "FLAG" (Ctrl+F)
3. Look for HTML comments (`<!-- -->`)
4. Check for any credentials or API keys

**What to Look For**:
- `<!-- FLAG{...} -->`
- API endpoints
- Configuration data
- Developer comments

**Expected Flags**: 
- Multiple flags in HTML comments throughout pages
- `FLAG{insecure_login_form_no_rate_limiting}` in login.html
- `FLAG{registration_endpoint_no_verification}` in register.html

---

### 🟢 Exercise 2.2: Browser Developer Tools

**Objective**: Use browser DevTools to inspect the application.

**Steps**:
1. Press F12 to open Developer Tools
2. Go to the **Console** tab
3. Refresh the page and read all console messages
4. Note any credentials, keys, or configuration data

**Expected Output**:
```
=== Blue Mountain Travel - Security Training Demo ===
This application contains intentional security vulnerabilities:
1. Exposed SAS tokens in client-side code
...
```

**Expected Flags**:
- Multiple flags logged on page load
- Hints about available functions

---

### 🟡 Exercise 2.3: JavaScript Source Code Analysis

**Objective**: Review client-side JavaScript for vulnerabilities.

**Steps**:
1. Open DevTools → Sources tab
2. Navigate to `js/main.js`
3. Search for "password", "credential", "api", "token"
4. Look for hardcoded values

**What You'll Find**:
- Azure SAS tokens
- Database credentials
- API keys
- User data with passwords

**Expected Flags**:
- `FLAG{user_pii_data_in_plain_text_storage}`
- `FLAG{azure_credentials_john_smith}`
- `FLAG{admin_password_found}`

---

## 3. User Enumeration

### 🟡 Exercise 3.1: Test User Enumeration Endpoint

**Objective**: Determine if the application leaks information about user existence.

**Steps**:
1. Open browser console (F12)
2. Type: `checkUserExists("john.smith@company.com")`
3. Try with: `checkUserExists("nonexistent@example.com")`
4. Compare the responses

**What to Observe**:
- Different messages for existing vs. non-existing users
- Response time differences
- No rate limiting

**Try These Commands**:
```javascript
// Check if user exists
checkUserExists("john.smith@company.com")

// List all users
enumerateAllUsers()

// Get Azure usernames for targeting
getAllAzureUsernames()
```

**Expected Flags**:
- `FLAG{user_enumeration_endpoint_exposed}`
- `FLAG{enumerate_all_users_no_auth}`

---

### 🟡 Exercise 3.2: Build Target List

**Objective**: Create a list of valid usernames for password spraying.

**Steps**:
1. Run `enumerateAllUsers()` in console
2. Copy all email addresses
3. Run `getAllAzureUsernames()` for Azure targets
4. Save both lists to a text file

**Expected Output**:
- 6+ application email addresses
- 6+ Azure/Entra usernames
- Employee database with AD usernames

**Expected Flags**:
- `FLAG{azure_username_list_for_password_spray}`

---

## 4. Authentication Bypass

### 🟢 Exercise 4.1: Navigate to Login Page

**Objective**: Understand the login mechanism.

**Steps**:
1. Go to http://localhost:8080/login.html
2. Note the demo credentials displayed
3. View the page source
4. Look for API endpoints in comments

**What's Exposed**:
- Demo credentials right on the page
- API endpoint URLs
- No CSRF token
- Client-side validation only

**Expected Flags**:
- `FLAG{insecure_login_form_no_rate_limiting}`
- `FLAG{api_endpoint_exposed_in_source}`

---

### 🟡 Exercise 4.2: Client-Side Authentication Analysis

**Objective**: Understand how authentication is implemented.

**Steps**:
1. Open DevTools → Sources → `js/login.js`
2. Find the `authenticateUser()` function
3. Notice it's comparing passwords in JavaScript
4. Try modifying the code in console

**Vulnerability**:
```javascript
// Authentication happens client-side!
const user = users.find(u => u.email === email && u.password === password);
```

**Test**:
1. Login with: john.smith@company.com / password123
2. Check localStorage: `localStorage.getItem('currentUser')`
3. See all user data including password!

**Expected Flags**:
- `FLAG{client_side_authentication_bypass}`
- `FLAG{predictable_session_token_generation}`

---

### 🟢 Exercise 4.3: Access User Data Without Login

**Objective**: Bypass authentication to access user data.

**Steps**:
1. Open browser console
2. Type: `window.sampleUsers`
3. See all user data including passwords!

**What's Exposed**:
- All usernames and passwords
- Credit card numbers
- Social Security Numbers
- Azure credentials

**Expected Flags**:
- `FLAG{all_user_data_accessible_via_window_object}`

---

## 5. Password Spraying

### 🟡 Exercise 5.1: Application Password Spray

**Objective**: Test common passwords against all user accounts.

**Steps**:
```javascript
// Build email list
const emails = [
    "john.smith@company.com",
    "sarah.johnson@enterprise.com",
    "michael.chen@startups.io",
    "emma.w@consulting.com",
    "d.martinez@finance.com",
    "admin@bluemountaintravel.com"
];

// Try common passwords
attemptPasswordSpray(emails, "password123")
attemptPasswordSpray(emails, "Password123")
attemptPasswordSpray(emails, "Winter2024!")
attemptPasswordSpray(emails, "Admin@BlueMountain2024!")
```

**Expected Results**:
- Multiple successful authentications
- Full user objects returned
- Azure credentials exposed

**Expected Flags**:
- `FLAG{password_spray_no_rate_limiting}`

---

### 🔴 Exercise 5.2: Database Password Spray

**Objective**: Attempt to authenticate to the SQL database.

**Steps**:
```javascript
// Try common SQL usernames
attemptDatabasePasswordSpray(
    ["admin", "sa", "root", "administrator"],
    "P@ssw0rd123!"
)
```

**Success Indicators**:
- Connection string returned
- Database access level shown
- No lockout after multiple attempts

**Expected Flags**:
- `FLAG{sql_password_spray_vulnerable}`
- `FLAG{sql_connection_string_fully_exposed}`

---

### 🔴 Exercise 5.3: Entra ID Password Spray

**Objective**: Test Azure AD/Entra ID authentication.

**Steps**:
```javascript
// Get Entra usernames
const azureUsers = getAllAzureUsernames()

// Spray common passwords
attemptEntraPasswordSpray(azureUsers, "Winter2024!")
attemptEntraPasswordSpray(azureUsers, "Summer2024!")
attemptEntraPasswordSpray(azureUsers, "AzureAdmin2024!@#")
```

**Success Indicators**:
- Access tokens generated
- Tenant information revealed
- No MFA challenge

**Expected Flags**:
- `FLAG{entra_id_password_spray_no_protection}`

---

## 6. Data Exposure

### 🟢 Exercise 6.1: LocalStorage Inspection

**Objective**: Find sensitive data stored in the browser.

**Steps**:
1. Open DevTools → Application tab → Storage → Local Storage
2. Expand the localhost entry
3. Look for keys like 'currentUser', 'bookings', 'rememberedPassword'

**What You'll Find**:
- Plain text passwords
- Credit card numbers
- SSNs
- Session tokens
- All booking data

**Try These Commands**:
```javascript
// View stored user
JSON.parse(localStorage.getItem('currentUser'))

// View remembered credentials
localStorage.getItem('rememberedPassword')

// View all bookings
JSON.parse(localStorage.getItem('bookings'))
```

**Expected Flags**:
- Multiple flags related to localStorage exposure

---

### 🟡 Exercise 6.2: Employee Database Access

**Objective**: Access the employee database without authentication.

**Steps**:
```javascript
// Search for employees
searchEmployees("john")

// Export all employee data
exportEmployeeData()

// Get privileged accounts
getPrivilegedEmployees()
```

**What's Exposed**:
- Full names, emails, personal emails
- SSNs, salaries, dates of birth
- Home addresses, emergency contacts
- AD/Azure usernames
- Security question answers

**Expected Flags**:
- `FLAG{employee_database_publicly_accessible}`
- `FLAG{employee_search_no_authentication}`
- `FLAG{employee_pii_export_without_auth}`
- `FLAG{privileged_account_list_exposed}`

---

### 🟡 Exercise 6.3: Network Traffic Analysis

**Objective**: Inspect API calls for exposed credentials.

**Steps**:
1. Open DevTools → Network tab
2. Clear the network log
3. Login to the application
4. Look at the request headers
5. Check the request payload

**What to Look For**:
- API keys in headers
- Passwords in plain text
- Database connection strings
- SAS tokens

**Expected Flags**:
- Various flags related to network exposure

---

## 7. Admin Panel Discovery

### 🟢 Exercise 7.1: Find the Admin Panel

**Objective**: Discover hidden administrative pages.

**Techniques**:
1. Try common admin URLs:
   - http://localhost:8080/admin.html
   - http://localhost:8080/admin
   - http://localhost:8080/administrator
2. Check robots.txt (if exists)
3. Look for links in source code
4. Search for "admin" in all JavaScript files

**Success**: You found http://localhost:8080/admin.html

**Expected Flags**:
- `FLAG{admin_panel_without_authentication}`
- `FLAG{admin_panel_accessible_without_auth}`

---

### 🟡 Exercise 7.2: Explore Admin Functions

**Objective**: Use the admin panel to access sensitive data.

**Steps**:
1. Open http://localhost:8080/admin.html
2. Click each button in the admin cards
3. Use the console functions:

```javascript
showAzureCredentials()
showConnectionString()
viewAllUsers()
exportUserData()
showSASToken()
showServicePrincipalDetails()
```

**What Gets Exposed**:
- Azure Subscription ID and Tenant ID
- Database connection strings
- Service principal secrets
- Storage SAS tokens
- All user PII in downloadable format
- Entra ID global admin credentials

**Expected Flags**:
- `FLAG{admin_key_exposed_in_panel}`
- `FLAG{database_credentials_in_admin_panel}`
- `FLAG{exposed_azure_subscription_credentials}`
- `FLAG{entra_global_admin_credentials_exposed}`
- `FLAG{service_principal_can_access_all_azure_resources}`
- `FLAG{all_admin_credentials_logged_to_console}`
- `FLAG{all_user_pii_dumped_including_passwords}`
- `FLAG{user_data_export_contains_everything}`

---

## 8. Azure Storage Exploitation

### 🟡 Exercise 8.1: Find the Storage Browser

**Objective**: Discover the Azure storage browser interface.

**Steps**:
1. Navigate to http://localhost:8080/storage-browser.html
2. Note the SAS token displayed on the page
3. Browse each container

**Containers Available**:
- passports - Employee passport documents
- profiles - User profile data
- bookings - Travel booking records
- documents - Configuration files

**Expected Flags**:
- `FLAG{storage_browser_publicly_accessible}`
- `FLAG{storage_browser_exposes_sas_token}`

---

### 🔴 Exercise 8.2: Direct Storage Access with SAS Token

**Objective**: Use the SAS token to access Azure Blob Storage directly.

**SAS Token** (from page):
```
?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=FakeSignatureForDemo123456789==
```

**Steps**:
```bash
# Install Azure CLI (if not installed)
# On Ubuntu/Debian:
sudo apt-get install azure-cli

# List containers
az storage container list \
  --account-name bluemountaintravel \
  --sas-token "sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-12-31..."

# List files in passports container
az storage blob list \
  --account-name bluemountaintravel \
  --container-name passports \
  --sas-token "..."

# Download a file
az storage blob download \
  --account-name bluemountaintravel \
  --container-name passports \
  --name US123456789-passport.pdf \
  --file passport.pdf \
  --sas-token "..."
```

**What You Can Do**:
- Read all files (sp=r)
- Write new files (sp=w)
- Delete files (sp=d)
- List contents (sp=l)

**Expected Flags**:
- `FLAG{sas_token_with_full_permissions_until_2025}`

---

### 🟡 Exercise 8.3: Access App Registration Credentials

**Objective**: Find service principal secrets in storage.

**Steps**:
1. In storage browser, click "documents" container
2. Find `app-registrations.json`
3. Download or view the file
4. Or access directly: http://localhost:8080/app-registrations.json

**What's Inside**:
- Service principal application IDs
- Client secrets
- Tenant IDs
- Azure subscription details
- Role assignments
- Azure CLI commands with credentials

**Expected Flags**:
- `FLAG{app_registration_credentials_in_public_storage}`
- `FLAG{service_principal_full_contributor_access}`
- `FLAG{azure_cli_commands_with_credentials}`
- `FLAG{api_key_in_config_file}`

---

## 9. Passport Document Access

### 🟢 Exercise 9.1: View Passport Viewer

**Objective**: Access employee passport documents.

**Steps**:
1. Navigate to http://localhost:8080/passport-viewer.html
2. Scroll through all passport entries
3. Click download links for PDFs and photos
4. Note: No authentication required!

**Passports Available**:
- John Smith (US) - US123456789
- Sarah Johnson (US) - US234567890
- Michael Chen (CN) - CN567890123
- Emma Williams (GB) - GB789012345
- David Martinez (MX) - MX890123456
- Admin (US Diplomatic) - US000000001

**Expected Flags**:
- `FLAG{passport_viewer_no_authentication}`
- `FLAG{passport_images_no_auth_required}`
- `FLAG{international_passports_in_public_blob}`
- `FLAG{admin_diplomatic_passport_with_photo}`

---

### 🟡 Exercise 9.2: Extract Passport URLs

**Objective**: Programmatically access all passport data.

**Steps**:
```javascript
// List all passport data
window.passportDatabase

// Get passport by employee ID
getPassportByEmployeeId("EMP001")

// List all download URLs
listAllPassportUrls()

// Copy URLs to download all passports
const urls = listAllPassportUrls()
urls.forEach(p => console.log(p.url))
```

**Expected Flags**:
- `FLAG{passport_data_in_public_blob_storage}`
- `FLAG{passport_documents_in_public_blob_storage}`
- `FLAG{passport_container_sas_token_exposed}`
- `FLAG{all_passport_urls_with_sas_tokens_logged}`
- `FLAG{admin_diplomatic_passport_exposed}`

---

### 🔴 Exercise 9.3: Bulk Passport Download

**Objective**: Download all passport documents using Azure CLI.

**Steps**:
```bash
# Create directory for passports
mkdir passports

# Download all passport files
az storage blob download-batch \
  --account-name bluemountaintravel \
  --source passports \
  --destination ./passports \
  --pattern "*.pdf" \
  --sas-token "..."

# Download all photos
az storage blob download-batch \
  --account-name bluemountaintravel \
  --source passports \
  --destination ./passports \
  --pattern "*.jpg" \
  --sas-token "..."
```

**Expected Flags**:
- `FLAG{bulk_passport_download_via_sas_token}`

---

## 10. Lateral Movement

### 🔴 Exercise 10.1: Database to Storage Path

**Objective**: Use database credentials to access storage.

**Attack Path**:
```
Database Credentials → Query Tables → Blob URLs with SAS → Download Files
```

**Steps**:
1. Get database credentials from source code:
   - Server: bluemountaintravel.database.windows.net
   - Username: admin
   - Password: P@ssw0rd123!

2. Simulate database query (in console):
```javascript
lateralMovementFromDatabase()
```

3. The function shows how:
   - Database contains passport metadata
   - Each record has blob storage URLs
   - URLs include SAS tokens for direct access

**Expected Flags**:
- `FLAG{lateral_movement_database_to_storage}`

---

### 🔴 Exercise 10.2: Service Principal to Key Vault Path

**Objective**: Use service principal to access Key Vault and retrieve storage keys.

**Attack Path**:
```
Service Principal Credentials → Authenticate to Azure → Access Key Vault → Get Storage Keys → Full Storage Access
```

**Steps**:

1. Get service principal from app-registrations.json:
   - Application ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
   - Secret: SuperSecret123!@#$%
   - Tenant: 87654321-4321-4321-4321-210987654321

2. Simulate the attack (in console):
```javascript
accessPassportsViaKeyVault()
```

3. Commands shown:
```bash
# Login with service principal
az login --service-principal \
  -u a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -p SuperSecret123!@#$% \
  --tenant 87654321-4321-4321-4321-210987654321

# Access Key Vault
az keyvault secret show \
  --vault-name bluemountain-kv \
  --name StorageAccountKey

# Use storage key for full access
az storage blob list \
  --account-name bluemountaintravel \
  --account-key <retrieved-key> \
  --container-name passports
```

**Why This Works**:
- Service principal has Key Vault access
- Key Vault contains storage account keys
- Storage keys bypass SAS token restrictions

**Expected Flags**:
- `FLAG{key_vault_to_storage_lateral_movement}`
- `FLAG{service_principal_can_access_all_azure_resources}`
- `FLAG{database_access_via_service_principal}`

---

## 11. Service Principal Abuse

### 🔴 Exercise 11.1: Discover Service Principal Permissions

**Objective**: Understand what the compromised service principal can access.

**Steps**:
1. Review app-registrations.json
2. Note the role assignments:
   - Contributor on subscription (full management access)
   - Owner on resource group (complete control)
   - Storage Blob Data Owner (all storage operations)
   - SQL DB Contributor (database management)

**Implications**:
- Can create/modify/delete resources
- Can access all storage containers
- Can modify database settings
- Can read Key Vault secrets

**Expected Flags**:
- Previous flags related to service principal

---

### 🔴 Exercise 11.2: Simulate Azure Resource Enumeration

**Objective**: Understand how an attacker would enumerate Azure resources.

**Simulated Commands**:
```bash
# After authenticating with service principal...

# List all resources in subscription
az resource list --subscription 12345678-1234-1234-1234-123456789012

# List all resource groups
az group list

# List all storage accounts
az storage account list

# List all databases
az sql server list

# List all Key Vaults
az keyvault list
```

**What This Reveals**:
- All Azure resources in the subscription
- Resource names and locations
- Configuration details
- More attack opportunities

---

## 12. IDOR Vulnerabilities

### 🟡 Exercise 12.1: Hotel IDOR Discovery

**Objective**: Access unauthorized hotel details by manipulating IDs.

**Steps**:
1. From hotels page, click "View Details" on any hotel
2. Note the URL: `hotel-detail.html?id=HT001`
3. Manually change the ID in URL:
   - `?id=HT002`
   - `?id=HT003`
   - `?id=HT004`
4. Try sequential IDs to discover all hotels

**What This Exposes**:
- All hotel internal data
- Debug information
- Storage URLs
- Database record paths

**Expected Flags**:
- `FLAG{idor_vulnerability_in_hotel_details}`
- `FLAG{internal_hotel_data_exposed_in_ui}`
- `FLAG{hotel_detail_page_with_insecure_direct_object_reference}`

---

### 🟡 Exercise 12.2: Booking IDOR (Conceptual)

**Objective**: Understand how booking IDs could be exploited.

**Concept**:
- Booking IDs are predictable: `BK1234567890`, `HB9876543210`
- Format: 2-letter prefix + timestamp
- No authorization checks

**How to Exploit** (if endpoints existed):
1. Create a booking, note the ID
2. Increment/decrement the timestamp
3. Access other users' bookings
4. Modify or cancel others' reservations

---

## 13. Final Challenge

### 🔴 Exercise 13.1: Complete Attack Chain

**Objective**: Chain multiple vulnerabilities for maximum impact.

**Challenge**: Starting from the homepage with no credentials, gain full access to:
1. All user accounts
2. All employee data
3. All passport documents
4. Azure subscription access
5. Database access

**Suggested Attack Path**:
```
1. Reconnaissance
   └→ View source → Find credentials in JS

2. Enumeration
   └→ enumerateAllUsers() → Get target list

3. Authentication Bypass
   └→ window.sampleUsers → All credentials

4. Admin Access
   └→ /admin.html → All system credentials

5. Storage Access
   └→ SAS token → Download passports

6. Lateral Movement
   └→ Service principal → Key Vault → Storage keys

7. Complete Control
   └→ Azure CLI → Full subscription access
```

**Time Limit**: 30 minutes

**Success Criteria**: Complete all 7 steps and document each flag found.

---

### 🔴 Exercise 13.2: Write Your Report

**Objective**: Document your findings professionally.

**Report Structure**:

1. **Executive Summary**
   - Number of vulnerabilities found
   - Risk level (Critical/High/Medium/Low)
   - Potential impact

2. **Technical Findings**
   - For each vulnerability:
     - Description
     - Steps to reproduce
     - Evidence (screenshots/logs)
     - Flag captured
     - Impact assessment

3. **Recommendations**
   - How to fix each issue
   - Best practices
   - Security controls needed

4. **Flags Captured**
   - List all 60+ flags found
   - Where each was located
   - What vulnerability it represented

---

## 📊 Progress Tracker

Track your progress through the playbook:

### Reconnaissance (5 flags)
- [ ] FLAG{exposed_flight_data_in_client_side_code}
- [ ] FLAG{hotel_details_exposed_client_side}
- [ ] FLAG{user_pii_data_in_plain_text_storage}
- [ ] FLAG{azure_credentials_john_smith}
- [ ] FLAG{admin_password_found}

### Authentication (10 flags)
- [ ] FLAG{client_side_authentication_bypass}
- [ ] FLAG{insecure_login_form_no_rate_limiting}
- [ ] FLAG{api_endpoint_exposed_in_source}
- [ ] FLAG{all_registration_data_logged_to_console}
- [ ] FLAG{insecure_registration_accepts_any_data}
- [ ] FLAG{registration_endpoint_no_verification}
- [ ] FLAG{predictable_session_token_generation}
- [ ] FLAG{admin_console_output_reveals_secrets}
- [ ] FLAG{all_user_data_accessible_via_window_object}
- [ ] FLAG{azure_admin_access_key_exposed}

### Enumeration (6 flags)
- [ ] FLAG{user_enumeration_endpoint_exposed}
- [ ] FLAG{password_spray_no_rate_limiting}
- [ ] FLAG{sql_password_spray_vulnerable}
- [ ] FLAG{entra_id_password_spray_no_protection}
- [ ] FLAG{enumerate_all_users_no_auth}
- [ ] FLAG{azure_username_list_for_password_spray}

### Admin Panel (10 flags)
- [ ] FLAG{admin_panel_without_authentication}
- [ ] FLAG{admin_panel_accessible_without_auth}
- [ ] FLAG{admin_key_exposed_in_panel}
- [ ] FLAG{database_credentials_in_admin_panel}
- [ ] FLAG{exposed_azure_subscription_credentials}
- [ ] FLAG{entra_global_admin_credentials_exposed}
- [ ] FLAG{service_principal_can_access_all_azure_resources}
- [ ] FLAG{all_admin_credentials_logged_to_console}
- [ ] FLAG{api_keys_accessible_to_admin}
- [ ] FLAG{all_user_pii_dumped_including_passwords}

### Storage & Passports (12 flags)
- [ ] FLAG{passport_data_in_public_blob_storage}
- [ ] FLAG{passport_documents_in_public_blob_storage}
- [ ] FLAG{passport_container_sas_token_exposed}
- [ ] FLAG{passport_viewer_no_authentication}
- [ ] FLAG{passport_images_no_auth_required}
- [ ] FLAG{international_passports_in_public_blob}
- [ ] FLAG{bulk_passport_download_via_sas_token}
- [ ] FLAG{admin_diplomatic_passport_exposed}
- [ ] FLAG{admin_diplomatic_passport_with_photo}
- [ ] FLAG{storage_browser_publicly_accessible}
- [ ] FLAG{storage_browser_exposes_sas_token}
- [ ] FLAG{all_passport_urls_with_sas_tokens_logged}

### Service Principal (5 flags)
- [ ] FLAG{app_registration_credentials_in_public_storage}
- [ ] FLAG{service_principal_full_contributor_access}
- [ ] FLAG{database_access_via_service_principal}
- [ ] FLAG{api_key_in_config_file}
- [ ] FLAG{azure_cli_commands_with_credentials}

### Employee Data (4 flags)
- [ ] FLAG{employee_database_publicly_accessible}
- [ ] FLAG{employee_search_no_authentication}
- [ ] FLAG{employee_pii_export_without_auth}
- [ ] FLAG{privileged_account_list_exposed}

### Lateral Movement (3 flags)
- [ ] FLAG{lateral_movement_database_to_storage}
- [ ] FLAG{key_vault_to_storage_lateral_movement}
- [ ] FLAG{sas_token_with_full_permissions_until_2025}

### IDOR (3 flags)
- [ ] FLAG{idor_vulnerability_in_hotel_details}
- [ ] FLAG{internal_hotel_data_exposed_in_ui}
- [ ] FLAG{hotel_detail_page_with_insecure_direct_object_reference}

### Miscellaneous (5+ flags)
- [ ] FLAG{user_data_export_contains_everything}
- [ ] FLAG{downloading_files_with_sas_token}
- [ ] FLAG{sql_connection_string_fully_exposed}
- [ ] And more...

**Total Flags**: 60+

---

## 🎯 Learning Objectives Achieved

By completing this playbook, you will have learned:

✅ **Web Application Security**
- Client-side authentication vulnerabilities
- IDOR attacks
- User enumeration
- Session management issues

✅ **Cloud Security (Azure)**
- SAS token exploitation
- Service principal abuse
- Key Vault access
- Storage misconfigurations

✅ **Attack Techniques**
- Password spraying
- Lateral movement
- Privilege escalation
- Data exfiltration

✅ **Reconnaissance Skills**
- Source code analysis
- Browser DevTools usage
- Network traffic inspection
- Hidden endpoint discovery

---

## 📚 Additional Resources

**OWASP Top 10**:
- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection
- A07: Identification and Authentication Failures

**Azure Security**:
- [Azure Security Best Practices](https://docs.microsoft.com/azure/security/)
- [Azure AD Security](https://docs.microsoft.com/azure/active-directory/fundamentals/security-operations)
- [Storage Security Guide](https://docs.microsoft.com/azure/storage/common/storage-security-guide)

**Tools to Learn**:
- Burp Suite
- OWASP ZAP
- Azure CLI
- Azure Storage Explorer

---

## ✅ Completion Certificate

Once you've found all flags and completed all exercises, you can consider yourself trained in:

- Web application penetration testing
- Azure cloud security assessment
- Security vulnerability research
- Attack chain development

**Next Steps**:
1. Try similar vulnerable applications
2. Practice on CTF platforms
3. Get security certifications (CEH, OSCP, etc.)
4. Apply knowledge responsibly!

---

## ⚠️ Important Reminders

- This application is **intentionally vulnerable**
- Only use these techniques in authorized environments
- Never attack real systems without permission
- Use this knowledge to **defend**, not attack

**Happy Hacking! 🎓🔐**
