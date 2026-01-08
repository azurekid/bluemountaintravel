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

**Expected Outcome**:
- Find at least one `ctf_b64:` marker related to client-side data exposure

---

## 2. Reconnaissance Phase

### 🟢 Exercise 2.1: View Page Source

**Objective**: Learn to find hidden information in HTML source code.

**Steps**:
1. Right-click on the homepage and select "View Page Source"
2. Search for `ctf_b64` (Ctrl+F)
3. Look for HTML comments (`<!-- -->`)
4. Check for any credentials or API keys

**What to Look For**:
- `<!-- ctf_b64: <base64> -->`
- API endpoints
- Configuration data
- Developer comments

**Expected Findings**:
- `ctf_b64:` markers in comments or scripts
- Login/registration pages that include security-relevant hints (without publishing raw flags)

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to exposed credentials and PII

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to user enumeration

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
**Expected Outcome**:
- Find and decode a `ctf_b64:` marker related to Azure username enumeration

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to login weaknesses and endpoint disclosure

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to client-side auth and token predictability

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
**Expected Outcome**:
- Find and decode a `ctf_b64:` marker related to global/window data exposure

---

## 5. Password Spraying

### 🟡 Exercise 5.1: Application Password Spray

**Objective**: Test common passwords against all user accounts.

**Steps**:
```javascript
// Build email list
const emails = [
   "john.smith@techcorp.com",
   "sarah.johnson@globalind.com",
   "michael.chen@innovlab.io",
   "emma.williams@stratcon.com",
   "david.martinez@invbank.com",
    "admin@bluemountaintravel.com"
];

// Try common passwords
attemptPasswordSpray(emails, "password123")
attemptPasswordSpray(emails, "Password123")
attemptPasswordSpray(emails, "Winter2026!")
attemptPasswordSpray(emails, "Admin@BlueMountain2026!")
```

**Expected Results**:
- Multiple successful authentications
- Full user objects returned
- Azure credentials exposed

**Expected Flags**:
**Expected Outcome**:
- Find and decode a `ctf_b64:` marker related to password spraying

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to SQL password spraying and exposed connection details

---

### 🔴 Exercise 5.3: Entra ID Password Spray

**Objective**: Test Azure AD/Entra ID authentication.

**Steps**:
```javascript
// Get Entra usernames
const azureUsers = getAllAzureUsernames()

// Spray common passwords
attemptEntraPasswordSpray(azureUsers, "Winter2026!")
attemptEntraPasswordSpray(azureUsers, "Summer2026!")
attemptEntraPasswordSpray(azureUsers, "AzureAdmin2026!@#")
```

**Success Indicators**:
- Access tokens generated
- Tenant information revealed
- No MFA challenge

**Expected Flags**:
**Expected Outcome**:
- Find and decode a `ctf_b64:` marker related to Entra ID password spraying

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to employee database exposure

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to unauthenticated admin access

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to admin credential exposure and data export

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to the public storage browser and exposed SAS token

---

### 🔴 Exercise 8.2: Direct Storage Access with SAS Token

**Objective**: Use the SAS token to access Azure Blob Storage directly.

**SAS Token** (from page):
```
<SAS_TOKEN_QUERY_STRING_FROM_PAGE>
```

**Steps**:
```bash
# Install Azure CLI (if not installed)
# On Ubuntu/Debian:
sudo apt-get install azure-cli

# List containers
az storage container list \
  --account-name bluemountaintravel \
   --sas-token "$AZURE_STORAGE_SAS_TOKEN"

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
**Expected Outcome**:
- Find and decode a `ctf_b64:` marker related to overly-permissive/long-lived SAS tokens

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to exposed app registration and service principal details

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to unauthenticated passport access and sensitive documents

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to passport URL leakage and SAS exposure

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
**Expected Outcome**:
- Find and decode a `ctf_b64:` marker related to bulk passport download

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
**Expected Outcome**:
- Find and decode a `ctf_b64:` marker related to lateral movement from database to storage

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to service principal abuse, Key Vault access, and database-to-cloud lateral movement

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
**Expected Outcome**:
- Find and decode `ctf_b64:` markers related to hotel IDOR and internal data exposure

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

Flags are intentionally not listed here in plaintext.
Track completion by vulnerability name and record the decoded values you recover from `ctf_b64:` markers.

### Reconnaissance
- [ ] Exposed flight data in client-side code
- [ ] Hotel details exposed client-side
- [ ] User PII stored in plain text (browser storage / client code)
- [ ] Azure credentials exposed in client-side/config
- [ ] Admin password discoverable from client-side/admin surface

### Authentication & Session
- [ ] Client-side authentication bypass
- [ ] No rate limiting on login
- [ ] API endpoint exposed in page source
- [ ] Registration data logged client-side
- [ ] Insecure registration accepts any data
- [ ] Registration endpoint lacks verification
- [ ] Predictable session token generation
- [ ] Admin console output reveals secrets
- [ ] Window/global object exposes full user data

### Enumeration & Password Spraying
- [ ] User enumeration endpoint exposed
- [ ] Password spraying possible (no protection)
- [ ] SQL password spraying vulnerable
- [ ] Entra ID password spraying vulnerable
- [ ] Enumerate all users without auth
- [ ] Azure username list available for targeting

### Admin Panel
- [ ] Admin panel accessible without authentication
- [ ] Admin key exposed in admin panel
- [ ] Database credentials visible via admin panel
- [ ] Azure subscription details exposed
- [ ] Entra global admin credentials exposed
- [ ] Service principal can access broad resources
- [ ] Admin credentials/logging reveal secrets
- [ ] API keys accessible to admin functions
- [ ] User export contains excessive sensitive data

### Storage & Passports
- [ ] Storage browser publicly accessible
- [ ] Storage browser exposes SAS token
- [ ] SAS token overly permissive/long-lived
- [ ] Passport viewer accessible without authentication
- [ ] Passport images/documents accessible without auth
- [ ] International passports accessible in storage
- [ ] Bulk download possible via SAS token
- [ ] Diplomatic/admin passport exposed
- [ ] Passport container SAS token exposed
- [ ] Passport URLs with SAS tokens are enumerable/logged

### Service Principals & Identity
- [ ] App registration credentials exposed
- [ ] Service principal has full contributor access
- [ ] Database access via service principal
- [ ] API key stored in config file
- [ ] Azure CLI commands with credentials exposed

### Employee Data
- [ ] Employee database publicly accessible
- [ ] Employee search without authentication
- [ ] Employee PII export without auth
- [ ] Privileged account list exposed

### Lateral Movement
- [ ] Database → Storage lateral movement path
- [ ] Service principal → Key Vault → Storage lateral movement path

### IDOR / Direct Reference
- [ ] IDOR vulnerability in hotel details
- [ ] Internal hotel data exposed in UI

**Total**: Use `docs/VULNERABILITIES_REFERENCE.md` as the complete 68-item catalog.

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
