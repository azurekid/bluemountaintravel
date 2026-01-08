# Complete Vulnerabilities Reference

## Overview

This document provides a comprehensive catalog of ALL intentional security vulnerabilities in the Blue Mountain Travel application. Each vulnerability includes detailed information about its location, exploitation method, impact, and remediation guidance.

**Total Vulnerabilities**: 68 unique security issues (CTF flags)

---

## Table of Contents

1. [Authentication & Authorization Vulnerabilities](#1-authentication--authorization-vulnerabilities)
2. [Credential Exposure Vulnerabilities](#2-credential-exposure-vulnerabilities)
3. [Azure Storage & Blob Vulnerabilities](#3-azure-storage--blob-vulnerabilities)
4. [Passport Data Exposure](#4-passport-data-exposure)
5. [Database Security Issues](#5-database-security-issues)
6. [Password Spraying & User Enumeration](#6-password-spraying--user-enumeration)
7. [Admin Panel Vulnerabilities](#7-admin-panel-vulnerabilities)
8. [Employee Database Exposure](#8-employee-database-exposure)
9. [Lateral Movement Paths](#9-lateral-movement-paths)
10. [Service Principal & Identity Issues](#10-service-principal--identity-issues)
11. [Client-Side Security Issues](#11-client-side-security-issues)
12. [IDOR & Direct Reference Issues](#12-idor--direct-reference-issues)
13. [Information Disclosure](#13-information-disclosure)
14. [Session & Token Management](#14-session--token-management)

---

## 1. Authentication & Authorization Vulnerabilities

### 1.1 Client-Side Authentication Bypass
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/login.js`, `/public/login.html`
- **Severity**: CRITICAL
- **Description**: All authentication logic is performed client-side in JavaScript
- **Exploitation**: Bypass login by directly manipulating localStorage or accessing protected pages
- **Impact**: Complete authentication bypass, unauthorized access to all features
- **Remediation**: Implement server-side authentication with JWT tokens or session management

### 1.2 Admin Panel Without Authentication
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Alternate Flag**: (not published in docs; see `ctf_b64:` markers)
- **Location**: `/public/admin.html`, `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Admin panel is accessible without any authentication checks
- **Exploitation**: Navigate directly to `/admin.html` to access sensitive admin functions
- **Impact**: Complete administrative access, credential exposure, full system compromise
- **Remediation**: Implement role-based access control (RBAC) with server-side validation

### 1.3 No Rate Limiting on Login
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/login.js`
- **Severity**: HIGH
- **Description**: Unlimited login attempts allowed
- **Exploitation**: Perform brute force attacks without throttling
- **Impact**: Account compromise via credential stuffing or brute force
- **Remediation**: Implement rate limiting, account lockout, and CAPTCHA

### 1.4 No Authentication for Passport Viewer
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/passport-viewer.html`
- **Severity**: CRITICAL
- **Description**: Passport documents accessible without login
- **Exploitation**: Access `/passport-viewer.html` to view all employee passports
- **Impact**: Exposure of sensitive identity documents, PII breach
- **Remediation**: Require authentication and authorization to view passports

### 1.5 Storage Browser Without Authentication
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Alternate Flag**: (not published in docs; see `ctf_b64:` markers)
- **Location**: `/public/storage-browser.html`
- **Severity**: CRITICAL
- **Description**: Web-based storage browser accessible without authentication
- **Exploitation**: Browse all Azure storage containers and files without credentials
- **Impact**: Complete data exposure, ability to download all stored files
- **Remediation**: Remove public storage browser, implement authentication

### 1.6 Passport Container No Authentication
- **Flag**: Find and decode the `ctf_b64:` marker associated with this issue
- **Location**: Azure Storage Account - passports container
- **Severity**: CRITICAL
- **Description**: Passport storage container has public blob access
- **Exploitation**: Direct URL access to passport files
- **Impact**: Mass download of identity documents
- **Remediation**: Disable public access, use private containers with SAS tokens

---

## 2. Credential Exposure Vulnerabilities

### 2.1 Azure Credentials in Source Code
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/main.js`, `/config/azure-config.json`
- **Severity**: CRITICAL
- **Description**: Azure storage account credentials hardcoded in JavaScript
- **Exploitation**: View source code or developer tools to extract credentials
- **Impact**: Full access to Azure storage account
- **Remediation**: Use Azure Key Vault, environment variables, never commit credentials

### 2.2 Admin Password Exposed
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js`, console logs
- **Severity**: CRITICAL
- **Description**: Admin password logged to browser console
- **Exploitation**: Open browser console to view admin credentials
- **Impact**: Administrative access compromise
- **Remediation**: Never log passwords, use secure credential storage

### 2.3 Azure Admin Access Key Exposed
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Azure admin access key visible in JavaScript
- **Exploitation**: Extract from source code or console
- **Impact**: Full Azure subscription access
- **Remediation**: Use Managed Identities, Azure AD authentication

### 2.4 Database Credentials in Admin Panel
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/admin.html`, `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: SQL database connection string displayed in admin panel
- **Exploitation**: Access admin panel to view credentials
- **Impact**: Direct database access, data breach
- **Remediation**: Store credentials in Key Vault, use Managed Identity

### 2.5 Exposed Azure Subscription Credentials
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Azure subscription ID, tenant ID exposed
- **Exploitation**: Console logs reveal full subscription details
- **Impact**: Subscription-level reconnaissance, targeted attacks
- **Remediation**: Avoid logging subscription details, use minimal disclosure

### 2.6 Entra Global Admin Credentials Exposed
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Entra ID (Azure AD) global admin credentials in console
- **Exploitation**: Console logs show username and password
- **Impact**: Complete tenant takeover, identity compromise
- **Remediation**: Use conditional access, MFA, never log credentials

### 2.7 Service Principal Credentials
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js`, `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Service principal client ID and secret exposed
- **Exploitation**: Use credentials for Azure CLI/PowerShell login
- **Impact**: Full contributor access to Azure resources
- **Remediation**: Use certificate authentication, rotate secrets, restrict permissions

### 2.8 API Keys in Config File
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/config/azure-config.json`, `/public/app-registrations.json`
- **Severity**: HIGH
- **Description**: API keys stored in plain text configuration files
- **Exploitation**: Access config files to extract API keys
- **Impact**: Unauthorized API access
- **Remediation**: Use Azure API Management, Key Vault for secrets

### 2.9 SQL Connection String Fully Exposed
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Complete SQL connection string with credentials
- **Exploitation**: Copy connection string from console or source
- **Impact**: Direct database access, data exfiltration
- **Remediation**: Use connection strings without passwords, Managed Identity

### 2.10 Admin Key Exposed in Panel
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/admin.html`
- **Severity**: CRITICAL
- **Description**: Admin access key displayed in panel
- **Exploitation**: View admin panel HTML/JavaScript
- **Impact**: Administrative access
- **Remediation**: Implement secure authentication, never display keys

### 2.11 API Keys Accessible to Admin
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js`
- **Severity**: HIGH
- **Description**: API keys exposed in admin functions
- **Exploitation**: Access admin panel to retrieve API keys
- **Impact**: Unauthorized API usage
- **Remediation**: Separate key management, use Key Vault

### 2.12 All Admin Credentials Logged to Console
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js` - logAdminCredentials()
- **Severity**: CRITICAL
- **Description**: Complete set of admin credentials logged on page load
- **Exploitation**: Open console on admin page
- **Impact**: Mass credential exposure
- **Remediation**: Remove all credential logging, implement secure logging

### 2.13 Admin Console Output Reveals Secrets
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Sensitive secrets logged to browser console
- **Exploitation**: View console for secret values
- **Impact**: Secret compromise
- **Remediation**: Disable debug logging in production

---

## 3. Azure Storage & Blob Vulnerabilities

### 3.1 Storage Browser Exposes SAS Token
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/storage-browser.js`
- **Severity**: CRITICAL
- **Description**: SAS token with full permissions exposed in storage browser
- **Exploitation**: View JavaScript to extract SAS token
- **Impact**: Full storage account access
- **Remediation**: Generate short-lived, scoped SAS tokens server-side

### 3.2 SAS Token with Full Permissions Until 2025
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/main.js`, `/config/azure-config.json`
- **Severity**: CRITICAL
- **Description**: Long-lived SAS token (expires 2025-12-31) with rwdlacupiytfx permissions
- **Exploitation**: Extract token from source, use for long-term access
- **Impact**: Year-long unauthorized access, cannot easily revoke
- **Remediation**: Use short-lived tokens (15 minutes), minimal permissions

### 3.3 Downloading Files with SAS Token
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: Throughout application
- **Severity**: HIGH
- **Description**: Public SAS token enables bulk file downloads
- **Exploitation**: Use SAS token with Azure CLI to download all files
- **Impact**: Mass data exfiltration
- **Remediation**: User-scoped tokens, download rate limiting

### 3.4 User PII Data in Plain Text Storage
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: Browser localStorage, Azure Blob Storage
- **Severity**: HIGH
- **Description**: Personal Identifiable Information stored unencrypted
- **Exploitation**: Access localStorage or blob storage to read PII
- **Impact**: Privacy violation, regulatory non-compliance
- **Remediation**: Encrypt data at rest, use secure storage

---

## 4. Passport Data Exposure

### 4.1 Passport Documents in Public Blob Storage
- **Flag**: Find and decode the `ctf_b64:` marker associated with this issue
- **Alternate Flag**: (not published in docs; see `ctf_b64:` markers)
- **Location**: Azure Storage - passports container
- **Severity**: CRITICAL
- **Description**: Passport PDF scans stored in publicly accessible container
- **Exploitation**: Direct URL access or SAS token usage
- **Impact**: Identity theft, fraud, privacy breach
- **Remediation**: Private containers, authentication required, encryption

### 4.2 Passport Images No Auth Required
- **Flag**: Find and decode the `ctf_b64:` marker associated with this issue
- **Location**: `/public/passport-viewer.html`
- **Severity**: CRITICAL
- **Description**: High-resolution passport photos accessible without authentication
- **Exploitation**: Navigate to passport viewer page
- **Impact**: Identity document exposure
- **Remediation**: Require authentication and authorization

### 4.3 International Passports in Public Blob
- **Flag**: Find and decode the `ctf_b64:` marker associated with this issue
- **Location**: Azure Storage - passports container
- **Severity**: CRITICAL
- **Description**: Multiple countries' passports exposed (USA, UK, China, Mexico)
- **Exploitation**: Access public blob storage
- **Impact**: International identity document breach
- **Remediation**: Secure storage, access controls

### 4.4 Bulk Passport Download via SAS Token
- **Flag**: Find and decode the `ctf_b64:` marker associated with this issue
- **Location**: Azure Storage with SAS token
- **Severity**: CRITICAL
- **Description**: SAS token allows downloading all passports at once
- **Exploitation**: Use Azure CLI with SAS token to batch download
- **Impact**: Mass identity document theft
- **Remediation**: Disable bulk operations, rate limiting

### 4.5 Admin Diplomatic Passport Exposed
- **Flag**: Find and decode the `ctf_b64:` marker associated with this issue
- **Alternate Flag**: (not published in docs; see `ctf_b64:` markers)
- **Location**: Azure Storage - passports container
- **Severity**: CRITICAL
- **Description**: Diplomatic passport (US000000001) publicly accessible
- **Exploitation**: Access via public storage or passport viewer
- **Impact**: High-value identity document compromise
- **Remediation**: Enhanced security for sensitive documents

### 4.6 John Smith Passport Accessible
- **Flag**: Find and decode the `ctf_b64:` marker associated with this issue
- **Location**: Azure Storage - passports container
- **Severity**: HIGH
- **Description**: Individual employee passport accessible
- **Exploitation**: Direct access via storage URLs
- **Impact**: Individual identity compromise
- **Remediation**: Private storage, access controls

### 4.7 Passport Container SAS Token Exposed
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/passport-db.js`
- **Severity**: CRITICAL
- **Description**: SAS token specifically for passports container in JavaScript
- **Exploitation**: Extract from source code
- **Impact**: Unauthorized passport access
- **Remediation**: Server-side token generation

### 4.8 All Passport URLs with SAS Tokens Logged
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/passport-db.js` console logs
- **Severity**: HIGH
- **Description**: Complete list of passport URLs with SAS tokens in console
- **Exploitation**: View console to get all URLs
- **Impact**: Easy mass download
- **Remediation**: Never log sensitive URLs

---

## 5. Database Security Issues

### 5.1 SQL Password Spray Vulnerable
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: SQL Server - bluemountaintravel.database.windows.net
- **Severity**: CRITICAL
- **Description**: SQL Server allows unlimited authentication attempts
- **Exploitation**: Use password spraying tools against SQL endpoint
- **Impact**: Database compromise via brute force
- **Remediation**: Implement login throttling, Azure AD authentication

### 5.2 Database Access via Service Principal
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Service principal has SQL DB Contributor role
- **Exploitation**: Use service principal credentials to access database
- **Impact**: Full database access
- **Remediation**: Principle of least privilege, use Managed Identity

---

## 6. Password Spraying & User Enumeration

### 6.1 Password Spray No Rate Limiting
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/enumeration.js`
- **Severity**: HIGH
- **Description**: Application password spray function with no throttling
- **Exploitation**: Use attemptPasswordSpray() to test credentials
- **Impact**: Account compromise via password spraying
- **Remediation**: Rate limiting, account lockout, monitoring

### 6.2 Entra ID Password Spray No Protection
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/enumeration.js`
- **Severity**: CRITICAL
- **Description**: Entra ID (Azure AD) vulnerable to password spraying
- **Exploitation**: Use attemptEntraPasswordSpray() function
- **Impact**: Cloud identity compromise
- **Remediation**: Conditional access, smart lockout, MFA

### 6.3 Enumerate All Users No Auth
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/enumeration.js`
- **Severity**: HIGH
- **Description**: User enumeration endpoint accessible without authentication
- **Exploitation**: Call enumerateAllUsers() to get all email addresses
- **Impact**: Target list for attacks, privacy violation
- **Remediation**: Require authentication, generic error messages

### 6.4 User Enumeration Endpoint Exposed
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/enumeration.js` - checkUserExists()
- **Severity**: MEDIUM
- **Description**: Function to check if user email exists in system
- **Exploitation**: Test email addresses to build user list
- **Impact**: Username discovery for targeted attacks
- **Remediation**: Generic responses for login attempts

### 6.5 Azure Username List for Password Spray
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/enumeration.js` - getAllAzureUsernames()
- **Severity**: HIGH
- **Description**: Function returns all Azure/Entra usernames
- **Exploitation**: Get list of cloud identities to target
- **Impact**: Targeted cloud attacks
- **Remediation**: Protect user directories, authentication required

---

## 7. Admin Panel Vulnerabilities

### 7.1 API Endpoint Exposed in Source
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/main.js`
- **Severity**: MEDIUM
- **Description**: API endpoint URLs visible in JavaScript
- **Exploitation**: View source to discover API endpoints
- **Impact**: API discovery, potential for API abuse
- **Remediation**: Obfuscate endpoints, implement API authentication

---

## 8. Employee Database Exposure

### 8.1 Employee Database Publicly Accessible
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/employee-db.js`
- **Severity**: CRITICAL
- **Description**: Complete employee database accessible without authentication
- **Exploitation**: Access employee-db.js to view all employee data
- **Impact**: Mass PII exposure including SSN, salary, addresses
- **Remediation**: Implement authentication, encrypt sensitive data

### 8.2 Employee Search No Authentication
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/employee-db.js` - searchEmployees()
- **Severity**: HIGH
- **Description**: Search functionality for employee data without login
- **Exploitation**: Use searchEmployees() to find specific employees
- **Impact**: Targeted PII discovery
- **Remediation**: Require authentication and authorization

### 8.3 Employee PII Export Without Auth
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/employee-db.js` - exportEmployeeData()
- **Severity**: CRITICAL
- **Description**: Export all employee data including PII without authentication
- **Exploitation**: Call exportEmployeeData() to download complete database
- **Impact**: Mass data breach, regulatory violations
- **Remediation**: Strict access controls, data loss prevention

### 8.4 Privileged Account List Exposed
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/employee-db.js` - getPrivilegedEmployees()
- **Severity**: HIGH
- **Description**: List of privileged accounts (admins, VPN users) accessible
- **Exploitation**: Call function to get high-value targets
- **Impact**: Targeted attacks on privileged accounts
- **Remediation**: Protect privileged account information

---

## 9. Lateral Movement Paths

### 9.1 Lateral Movement Database to Storage
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/enumeration.js` - lateralMovementFromDatabase()
- **Severity**: HIGH
- **Description**: Database credentials enable access to storage accounts
- **Exploitation**: Use DB credentials to find and access blob URLs
- **Impact**: Multi-resource compromise
- **Remediation**: Network segmentation, separate credentials

### 9.2 Key Vault to Storage Lateral Movement
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/passport-db.js` - accessPassportsViaKeyVault()
- **Severity**: HIGH
- **Description**: Key Vault access leads to storage account keys
- **Exploitation**: Service principal → Key Vault → Storage keys
- **Impact**: Privilege escalation, expanded access
- **Remediation**: Least privilege, Managed Identities

---

## 10. Service Principal & Identity Issues

### 10.1 App Registration Credentials in Public Storage
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Service principal secrets in publicly accessible file
- **Exploitation**: Download app-registrations.json from storage
- **Impact**: Azure subscription compromise
- **Remediation**: Never store credentials in public storage

### 10.2 Service Principal Full Contributor Access
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Service principal has Contributor role at subscription level
- **Exploitation**: Use credentials to manage all Azure resources
- **Impact**: Complete subscription control
- **Remediation**: Principle of least privilege, resource-scoped roles

### 10.3 Service Principal Can Access All Azure Resources
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js`, `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Overly permissive service principal with broad access
- **Exploitation**: Use for reconnaissance and resource manipulation
- **Impact**: Subscription-wide compromise
- **Remediation**: Scoped permissions, regular access reviews

### 10.4 Azure CLI Commands with Credentials
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Complete Azure CLI login commands with credentials
- **Exploitation**: Copy-paste commands to authenticate
- **Impact**: Immediate Azure access
- **Remediation**: Never document authentication commands with secrets

---

## 11. Client-Side Security Issues

### 11.1 Exposed Flight Data in Client-Side Code
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/main.js`
- **Severity**: LOW
- **Description**: All flight data stored in client-side JavaScript
- **Exploitation**: View source to see all flights and pricing
- **Impact**: Business logic exposure, price manipulation
- **Remediation**: Server-side data storage, API-based data retrieval

### 11.2 Hotel Details Exposed Client Side
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/hotels.js`
- **Severity**: LOW
- **Description**: Complete hotel database in client JavaScript
- **Exploitation**: Extract all hotel data from source
- **Impact**: Business data exposure
- **Remediation**: Server-side data, paginated API

### 11.3 All User Data Accessible via Window Object
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/main.js` - window.sampleUsers
- **Severity**: HIGH
- **Description**: User database exposed as global window object
- **Exploitation**: Access window.sampleUsers in console
- **Impact**: Complete user data exposure
- **Remediation**: Avoid global variables, use module patterns

### 11.4 All Registration Data Logged to Console
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/register.js`
- **Severity**: HIGH
- **Description**: Registration form data including passwords logged
- **Exploitation**: View console during registration
- **Impact**: Credential capture, PII exposure
- **Remediation**: Remove debug logging, never log sensitive data

### 11.5 Insecure Registration Accepts Any Data
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/register.js`
- **Severity**: MEDIUM
- **Description**: No validation on registration input
- **Exploitation**: Submit malicious or invalid data
- **Impact**: Data integrity issues, potential injection
- **Remediation**: Server-side validation, input sanitization

### 11.6 Registration Endpoint No Verification
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/register.js`
- **Severity**: MEDIUM
- **Description**: No email verification or identity validation
- **Exploitation**: Create accounts with any email
- **Impact**: Fake accounts, spam, abuse
- **Remediation**: Email verification, CAPTCHA

---

## 12. IDOR & Direct Reference Issues

### 12.1 IDOR Vulnerability in Hotel Details
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/hotel-detail.html`
- **Severity**: HIGH
- **Description**: Predictable hotel IDs (HT001, HT002, etc.)
- **Exploitation**: Change ?id= parameter to access other hotels
- **Impact**: Unauthorized data access
- **Remediation**: Use UUIDs, validate ownership

### 12.2 Internal Hotel Data Exposed in UI
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/hotel-detail.js`
- **Severity**: MEDIUM
- **Description**: Internal hotel data fields visible in UI
- **Exploitation**: View page source or inspect elements
- **Impact**: Business data exposure
- **Remediation**: Only send necessary data to client

### 12.3 Hotel Detail Page with IDOR
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/hotel-detail.html`
- **Severity**: HIGH
- **Description**: Direct object reference without authorization
- **Exploitation**: Modify URL parameters
- **Impact**: Access to all hotel data
- **Remediation**: Server-side authorization checks

---

## 13. Information Disclosure

### 13.1 All User PII Dumped Including Passwords
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js` - exportUserData()
- **Severity**: CRITICAL
- **Description**: Export function includes passwords in plain text
- **Exploitation**: Use exportUserData() in console
- **Impact**: Complete credential and PII breach
- **Remediation**: Never export passwords, hash credentials

### 13.2 User Data Export Contains Everything
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Data export includes all sensitive fields
- **Exploitation**: Export function accessible without proper authorization
- **Impact**: Mass data exfiltration
- **Remediation**: Sanitize exports, require authorization

---

## 14. Session & Token Management

### 14.1 Predictable Session Token Generation
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: `/public/js/login.js`
- **Severity**: HIGH
- **Description**: Session tokens generated with predictable patterns
- **Exploitation**: Generate valid tokens without authentication
- **Impact**: Session hijacking, unauthorized access
- **Remediation**: Use cryptographically secure random tokens

### 14.2 API Key Regeneration Predictable
- **Flag**: Find and decode the `ctf_b64:` marker in the listed location
- **Location**: API key generation logic
- **Severity**: MEDIUM
- **Description**: API keys follow predictable patterns
- **Exploitation**: Guess or generate valid API keys
- **Impact**: Unauthorized API access
- **Remediation**: Use cryptographically random key generation

---

## Vulnerability Summary by Severity

### Critical (32 vulnerabilities)
- Client-side authentication bypass
- Admin panel without authentication
- Multiple credential exposures (Azure, DB, Entra ID)
- Passport documents in public storage
- Service principal with full contributor access
- Employee database publicly accessible
- And 26 more critical issues

### High (24 vulnerabilities)
- No rate limiting on authentication
- IDOR vulnerabilities
- User enumeration
- Privilege escalation paths
- And 20 more high-severity issues

### Medium (8 vulnerabilities)
- Information disclosure
- Predictable tokens
- Registration without verification
- And 5 more medium-severity issues

### Low (4 vulnerabilities)
- Client-side data exposure
- Business logic issues

---

## Compliance Impact

These vulnerabilities violate multiple compliance frameworks:

- **GDPR**: Articles 5, 25, 32 (PII protection, privacy by design, security)
- **HIPAA**: Multiple safeguards (if health data present)
- **PCI DSS**: Requirements 3, 6, 8 (if payment data handled)
- **SOC 2**: Trust service criteria for security, confidentiality
- **ISO 27001**: Multiple controls from Annex A
- **NIST CSF**: Protect, Detect, Respond functions

---

## Testing & Validation

To validate these vulnerabilities:

1. **Start the application**: `npm start`
2. **Open browser**: Navigate to `http://localhost:8080`
3. **Open Developer Tools**: Press F12
4. **View Console**: Check for logged credentials
5. **Check Local Storage**: Application > Local Storage
6. **View Source**: Examine JavaScript files
7. **Test Endpoints**: Access protected pages without auth
8. **Try Enumeration**: Use browser console functions

---

## Remediation Priority

**Immediate (Week 1)**:
1. Remove all hardcoded credentials
2. Disable public blob storage access
3. Implement authentication for all pages
4. Remove console logging of sensitive data

**Short-term (Weeks 2-4)**:
5. Implement Azure Key Vault for secrets
6. Add rate limiting and throttling
7. Use Managed Identities
8. Implement server-side validation

**Medium-term (Months 2-3)**:
9. Complete security architecture redesign
10. Implement proper RBAC
11. Add security monitoring and alerting
12. Regular security assessments

---

## Additional Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Azure Security Best Practices**: https://docs.microsoft.com/azure/security/
- **CWE Top 25**: https://cwe.mitre.org/top25/
- **NIST Cybersecurity Framework**: https://www.nist.gov/cyberframework

---

**Last Updated**: 2026-01-15
**Total Flags**: 68
**Document Status**: Complete Vulnerability Catalog
