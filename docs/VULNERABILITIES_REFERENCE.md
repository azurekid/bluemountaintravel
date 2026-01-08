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
- **Flag**: `FLAG{client_side_authentication_bypass}`
- **Location**: `/public/js/login.js`, `/public/login.html`
- **Severity**: CRITICAL
- **Description**: All authentication logic is performed client-side in JavaScript
- **Exploitation**: Bypass login by directly manipulating localStorage or accessing protected pages
- **Impact**: Complete authentication bypass, unauthorized access to all features
- **Remediation**: Implement server-side authentication with JWT tokens or session management

### 1.2 Admin Panel Without Authentication
- **Flag**: `FLAG{admin_panel_without_authentication}`
- **Alternate Flag**: `FLAG{admin_panel_accessible_without_auth}`
- **Location**: `/public/admin.html`, `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Admin panel is accessible without any authentication checks
- **Exploitation**: Navigate directly to `/admin.html` to access sensitive admin functions
- **Impact**: Complete administrative access, credential exposure, full system compromise
- **Remediation**: Implement role-based access control (RBAC) with server-side validation

### 1.3 No Rate Limiting on Login
- **Flag**: `FLAG{insecure_login_form_no_rate_limiting}`
- **Location**: `/public/js/login.js`
- **Severity**: HIGH
- **Description**: Unlimited login attempts allowed
- **Exploitation**: Perform brute force attacks without throttling
- **Impact**: Account compromise via credential stuffing or brute force
- **Remediation**: Implement rate limiting, account lockout, and CAPTCHA

### 1.4 No Authentication for Passport Viewer
- **Flag**: `FLAG{passport_viewer_no_authentication}`
- **Location**: `/public/passport-viewer.html`
- **Severity**: CRITICAL
- **Description**: Passport documents accessible without login
- **Exploitation**: Access `/passport-viewer.html` to view all employee passports
- **Impact**: Exposure of sensitive identity documents, PII breach
- **Remediation**: Require authentication and authorization to view passports

### 1.5 Storage Browser Without Authentication
- **Flag**: `FLAG{storage_browser_publicly_accessible}`
- **Alternate Flag**: `FLAG{storage_browser_no_auth_required}`
- **Location**: `/public/storage-browser.html`
- **Severity**: CRITICAL
- **Description**: Web-based storage browser accessible without authentication
- **Exploitation**: Browse all Azure storage containers and files without credentials
- **Impact**: Complete data exposure, ability to download all stored files
- **Remediation**: Remove public storage browser, implement authentication

### 1.6 Passport Container No Authentication
- **Flag**: `FLAG{passport_container_no_authentication}`
- **Location**: Azure Storage Account - passports container
- **Severity**: CRITICAL
- **Description**: Passport storage container has public blob access
- **Exploitation**: Direct URL access to passport files
- **Impact**: Mass download of identity documents
- **Remediation**: Disable public access, use private containers with SAS tokens

---

## 2. Credential Exposure Vulnerabilities

### 2.1 Azure Credentials in Source Code
- **Flag**: `FLAG{azure_credentials_john_smith}`
- **Location**: `/public/js/main.js`, `/config/azure-config.json`
- **Severity**: CRITICAL
- **Description**: Azure storage account credentials hardcoded in JavaScript
- **Exploitation**: View source code or developer tools to extract credentials
- **Impact**: Full access to Azure storage account
- **Remediation**: Use Azure Key Vault, environment variables, never commit credentials

### 2.2 Admin Password Exposed
- **Flag**: `FLAG{admin_password_found}`
- **Location**: `/public/js/admin.js`, console logs
- **Severity**: CRITICAL
- **Description**: Admin password logged to browser console
- **Exploitation**: Open browser console to view admin credentials
- **Impact**: Administrative access compromise
- **Remediation**: Never log passwords, use secure credential storage

### 2.3 Azure Admin Access Key Exposed
- **Flag**: `FLAG{azure_admin_access_key_exposed}`
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Azure admin access key visible in JavaScript
- **Exploitation**: Extract from source code or console
- **Impact**: Full Azure subscription access
- **Remediation**: Use Managed Identities, Azure AD authentication

### 2.4 Database Credentials in Admin Panel
- **Flag**: `FLAG{database_credentials_in_admin_panel}`
- **Location**: `/public/admin.html`, `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: SQL database connection string displayed in admin panel
- **Exploitation**: Access admin panel to view credentials
- **Impact**: Direct database access, data breach
- **Remediation**: Store credentials in Key Vault, use Managed Identity

### 2.5 Exposed Azure Subscription Credentials
- **Flag**: `FLAG{exposed_azure_subscription_credentials}`
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Azure subscription ID, tenant ID exposed
- **Exploitation**: Console logs reveal full subscription details
- **Impact**: Subscription-level reconnaissance, targeted attacks
- **Remediation**: Avoid logging subscription details, use minimal disclosure

### 2.6 Entra Global Admin Credentials Exposed
- **Flag**: `FLAG{entra_global_admin_credentials_exposed}`
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Entra ID (Azure AD) global admin credentials in console
- **Exploitation**: Console logs show username and password
- **Impact**: Complete tenant takeover, identity compromise
- **Remediation**: Use conditional access, MFA, never log credentials

### 2.7 Service Principal Credentials
- **Flag**: `FLAG{azure_service_principal_with_full_access}`
- **Location**: `/public/js/admin.js`, `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Service principal client ID and secret exposed
- **Exploitation**: Use credentials for Azure CLI/PowerShell login
- **Impact**: Full contributor access to Azure resources
- **Remediation**: Use certificate authentication, rotate secrets, restrict permissions

### 2.8 API Keys in Config File
- **Flag**: `FLAG{api_key_in_config_file}`
- **Location**: `/config/azure-config.json`, `/public/app-registrations.json`
- **Severity**: HIGH
- **Description**: API keys stored in plain text configuration files
- **Exploitation**: Access config files to extract API keys
- **Impact**: Unauthorized API access
- **Remediation**: Use Azure API Management, Key Vault for secrets

### 2.9 SQL Connection String Fully Exposed
- **Flag**: `FLAG{sql_connection_string_fully_exposed}`
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Complete SQL connection string with credentials
- **Exploitation**: Copy connection string from console or source
- **Impact**: Direct database access, data exfiltration
- **Remediation**: Use connection strings without passwords, Managed Identity

### 2.10 Admin Key Exposed in Panel
- **Flag**: `FLAG{admin_key_exposed_in_panel}`
- **Location**: `/public/admin.html`
- **Severity**: CRITICAL
- **Description**: Admin access key displayed in panel
- **Exploitation**: View admin panel HTML/JavaScript
- **Impact**: Administrative access
- **Remediation**: Implement secure authentication, never display keys

### 2.11 API Keys Accessible to Admin
- **Flag**: `FLAG{api_keys_accessible_to_admin}`
- **Location**: `/public/js/admin.js`
- **Severity**: HIGH
- **Description**: API keys exposed in admin functions
- **Exploitation**: Access admin panel to retrieve API keys
- **Impact**: Unauthorized API usage
- **Remediation**: Separate key management, use Key Vault

### 2.12 All Admin Credentials Logged to Console
- **Flag**: `FLAG{all_admin_credentials_logged_to_console}`
- **Location**: `/public/js/admin.js` - logAdminCredentials()
- **Severity**: CRITICAL
- **Description**: Complete set of admin credentials logged on page load
- **Exploitation**: Open console on admin page
- **Impact**: Mass credential exposure
- **Remediation**: Remove all credential logging, implement secure logging

### 2.13 Admin Console Output Reveals Secrets
- **Flag**: `FLAG{admin_console_output_reveals_secrets}`
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Sensitive secrets logged to browser console
- **Exploitation**: View console for secret values
- **Impact**: Secret compromise
- **Remediation**: Disable debug logging in production

---

## 3. Azure Storage & Blob Vulnerabilities

### 3.1 Storage Browser Exposes SAS Token
- **Flag**: `FLAG{storage_browser_exposes_sas_token}`
- **Location**: `/public/js/storage-browser.js`
- **Severity**: CRITICAL
- **Description**: SAS token with full permissions exposed in storage browser
- **Exploitation**: View JavaScript to extract SAS token
- **Impact**: Full storage account access
- **Remediation**: Generate short-lived, scoped SAS tokens server-side

### 3.2 SAS Token with Full Permissions Until 2025
- **Flag**: `FLAG{sas_token_with_full_permissions_until_2025}`
- **Location**: `/public/js/main.js`, `/config/azure-config.json`
- **Severity**: CRITICAL
- **Description**: Long-lived SAS token (expires 2025-12-31) with rwdlacupiytfx permissions
- **Exploitation**: Extract token from source, use for long-term access
- **Impact**: Year-long unauthorized access, cannot easily revoke
- **Remediation**: Use short-lived tokens (15 minutes), minimal permissions

### 3.3 Downloading Files with SAS Token
- **Flag**: `FLAG{downloading_files_with_sas_token}`
- **Location**: Throughout application
- **Severity**: HIGH
- **Description**: Public SAS token enables bulk file downloads
- **Exploitation**: Use SAS token with Azure CLI to download all files
- **Impact**: Mass data exfiltration
- **Remediation**: User-scoped tokens, download rate limiting

### 3.4 User PII Data in Plain Text Storage
- **Flag**: `FLAG{user_pii_data_in_plain_text_storage}`
- **Location**: Browser localStorage, Azure Blob Storage
- **Severity**: HIGH
- **Description**: Personal Identifiable Information stored unencrypted
- **Exploitation**: Access localStorage or blob storage to read PII
- **Impact**: Privacy violation, regulatory non-compliance
- **Remediation**: Encrypt data at rest, use secure storage

---

## 4. Passport Data Exposure

### 4.1 Passport Documents in Public Blob Storage
- **Flag**: `FLAG{passport_documents_in_public_blob_storage}`
- **Alternate Flag**: `FLAG{passport_data_in_public_blob_storage}`
- **Location**: Azure Storage - passports container
- **Severity**: CRITICAL
- **Description**: Passport PDF scans stored in publicly accessible container
- **Exploitation**: Direct URL access or SAS token usage
- **Impact**: Identity theft, fraud, privacy breach
- **Remediation**: Private containers, authentication required, encryption

### 4.2 Passport Images No Auth Required
- **Flag**: `FLAG{passport_images_no_auth_required}`
- **Location**: `/public/passport-viewer.html`
- **Severity**: CRITICAL
- **Description**: High-resolution passport photos accessible without authentication
- **Exploitation**: Navigate to passport viewer page
- **Impact**: Identity document exposure
- **Remediation**: Require authentication and authorization

### 4.3 International Passports in Public Blob
- **Flag**: `FLAG{international_passports_in_public_blob}`
- **Location**: Azure Storage - passports container
- **Severity**: CRITICAL
- **Description**: Multiple countries' passports exposed (USA, UK, China, Mexico)
- **Exploitation**: Access public blob storage
- **Impact**: International identity document breach
- **Remediation**: Secure storage, access controls

### 4.4 Bulk Passport Download via SAS Token
- **Flag**: `FLAG{bulk_passport_download_via_sas_token}`
- **Location**: Azure Storage with SAS token
- **Severity**: CRITICAL
- **Description**: SAS token allows downloading all passports at once
- **Exploitation**: Use Azure CLI with SAS token to batch download
- **Impact**: Mass identity document theft
- **Remediation**: Disable bulk operations, rate limiting

### 4.5 Admin Diplomatic Passport Exposed
- **Flag**: `FLAG{admin_diplomatic_passport_exposed}`
- **Alternate Flag**: `FLAG{admin_diplomatic_passport_with_photo}`
- **Location**: Azure Storage - passports container
- **Severity**: CRITICAL
- **Description**: Diplomatic passport (US000000001) publicly accessible
- **Exploitation**: Access via public storage or passport viewer
- **Impact**: High-value identity document compromise
- **Remediation**: Enhanced security for sensitive documents

### 4.6 John Smith Passport Accessible
- **Flag**: `FLAG{john_smith_passport_accessible}`
- **Location**: Azure Storage - passports container
- **Severity**: HIGH
- **Description**: Individual employee passport accessible
- **Exploitation**: Direct access via storage URLs
- **Impact**: Individual identity compromise
- **Remediation**: Private storage, access controls

### 4.7 Passport Container SAS Token Exposed
- **Flag**: `FLAG{passport_container_sas_token_exposed}`
- **Location**: `/public/js/passport-db.js`
- **Severity**: CRITICAL
- **Description**: SAS token specifically for passports container in JavaScript
- **Exploitation**: Extract from source code
- **Impact**: Unauthorized passport access
- **Remediation**: Server-side token generation

### 4.8 All Passport URLs with SAS Tokens Logged
- **Flag**: `FLAG{all_passport_urls_with_sas_tokens_logged}`
- **Location**: `/public/js/passport-db.js` console logs
- **Severity**: HIGH
- **Description**: Complete list of passport URLs with SAS tokens in console
- **Exploitation**: View console to get all URLs
- **Impact**: Easy mass download
- **Remediation**: Never log sensitive URLs

---

## 5. Database Security Issues

### 5.1 SQL Password Spray Vulnerable
- **Flag**: `FLAG{sql_password_spray_vulnerable}`
- **Location**: SQL Server - bluemountaintravel.database.windows.net
- **Severity**: CRITICAL
- **Description**: SQL Server allows unlimited authentication attempts
- **Exploitation**: Use password spraying tools against SQL endpoint
- **Impact**: Database compromise via brute force
- **Remediation**: Implement login throttling, Azure AD authentication

### 5.2 Database Access via Service Principal
- **Flag**: `FLAG{database_access_via_service_principal}`
- **Location**: `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Service principal has SQL DB Contributor role
- **Exploitation**: Use service principal credentials to access database
- **Impact**: Full database access
- **Remediation**: Principle of least privilege, use Managed Identity

---

## 6. Password Spraying & User Enumeration

### 6.1 Password Spray No Rate Limiting
- **Flag**: `FLAG{password_spray_no_rate_limiting}`
- **Location**: `/public/js/enumeration.js`
- **Severity**: HIGH
- **Description**: Application password spray function with no throttling
- **Exploitation**: Use attemptPasswordSpray() to test credentials
- **Impact**: Account compromise via password spraying
- **Remediation**: Rate limiting, account lockout, monitoring

### 6.2 Entra ID Password Spray No Protection
- **Flag**: `FLAG{entra_id_password_spray_no_protection}`
- **Location**: `/public/js/enumeration.js`
- **Severity**: CRITICAL
- **Description**: Entra ID (Azure AD) vulnerable to password spraying
- **Exploitation**: Use attemptEntraPasswordSpray() function
- **Impact**: Cloud identity compromise
- **Remediation**: Conditional access, smart lockout, MFA

### 6.3 Enumerate All Users No Auth
- **Flag**: `FLAG{enumerate_all_users_no_auth}`
- **Location**: `/public/js/enumeration.js`
- **Severity**: HIGH
- **Description**: User enumeration endpoint accessible without authentication
- **Exploitation**: Call enumerateAllUsers() to get all email addresses
- **Impact**: Target list for attacks, privacy violation
- **Remediation**: Require authentication, generic error messages

### 6.4 User Enumeration Endpoint Exposed
- **Flag**: `FLAG{user_enumeration_endpoint_exposed}`
- **Location**: `/public/js/enumeration.js` - checkUserExists()
- **Severity**: MEDIUM
- **Description**: Function to check if user email exists in system
- **Exploitation**: Test email addresses to build user list
- **Impact**: Username discovery for targeted attacks
- **Remediation**: Generic responses for login attempts

### 6.5 Azure Username List for Password Spray
- **Flag**: `FLAG{azure_username_list_for_password_spray}`
- **Location**: `/public/js/enumeration.js` - getAllAzureUsernames()
- **Severity**: HIGH
- **Description**: Function returns all Azure/Entra usernames
- **Exploitation**: Get list of cloud identities to target
- **Impact**: Targeted cloud attacks
- **Remediation**: Protect user directories, authentication required

---

## 7. Admin Panel Vulnerabilities

### 7.1 API Endpoint Exposed in Source
- **Flag**: `FLAG{api_endpoint_exposed_in_source}`
- **Location**: `/public/js/main.js`
- **Severity**: MEDIUM
- **Description**: API endpoint URLs visible in JavaScript
- **Exploitation**: View source to discover API endpoints
- **Impact**: API discovery, potential for API abuse
- **Remediation**: Obfuscate endpoints, implement API authentication

---

## 8. Employee Database Exposure

### 8.1 Employee Database Publicly Accessible
- **Flag**: `FLAG{employee_database_publicly_accessible}`
- **Location**: `/public/js/employee-db.js`
- **Severity**: CRITICAL
- **Description**: Complete employee database accessible without authentication
- **Exploitation**: Access employee-db.js to view all employee data
- **Impact**: Mass PII exposure including SSN, salary, addresses
- **Remediation**: Implement authentication, encrypt sensitive data

### 8.2 Employee Search No Authentication
- **Flag**: `FLAG{employee_search_no_authentication}`
- **Location**: `/public/js/employee-db.js` - searchEmployees()
- **Severity**: HIGH
- **Description**: Search functionality for employee data without login
- **Exploitation**: Use searchEmployees() to find specific employees
- **Impact**: Targeted PII discovery
- **Remediation**: Require authentication and authorization

### 8.3 Employee PII Export Without Auth
- **Flag**: `FLAG{employee_pii_export_without_auth}`
- **Location**: `/public/js/employee-db.js` - exportEmployeeData()
- **Severity**: CRITICAL
- **Description**: Export all employee data including PII without authentication
- **Exploitation**: Call exportEmployeeData() to download complete database
- **Impact**: Mass data breach, regulatory violations
- **Remediation**: Strict access controls, data loss prevention

### 8.4 Privileged Account List Exposed
- **Flag**: `FLAG{privileged_account_list_exposed}`
- **Location**: `/public/js/employee-db.js` - getPrivilegedEmployees()
- **Severity**: HIGH
- **Description**: List of privileged accounts (admins, VPN users) accessible
- **Exploitation**: Call function to get high-value targets
- **Impact**: Targeted attacks on privileged accounts
- **Remediation**: Protect privileged account information

---

## 9. Lateral Movement Paths

### 9.1 Lateral Movement Database to Storage
- **Flag**: `FLAG{lateral_movement_database_to_storage}`
- **Location**: `/public/js/enumeration.js` - lateralMovementFromDatabase()
- **Severity**: HIGH
- **Description**: Database credentials enable access to storage accounts
- **Exploitation**: Use DB credentials to find and access blob URLs
- **Impact**: Multi-resource compromise
- **Remediation**: Network segmentation, separate credentials

### 9.2 Key Vault to Storage Lateral Movement
- **Flag**: `FLAG{key_vault_to_storage_lateral_movement}`
- **Location**: `/public/js/passport-db.js` - accessPassportsViaKeyVault()
- **Severity**: HIGH
- **Description**: Key Vault access leads to storage account keys
- **Exploitation**: Service principal → Key Vault → Storage keys
- **Impact**: Privilege escalation, expanded access
- **Remediation**: Least privilege, Managed Identities

---

## 10. Service Principal & Identity Issues

### 10.1 App Registration Credentials in Public Storage
- **Flag**: `FLAG{app_registration_credentials_in_public_storage}`
- **Location**: `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Service principal secrets in publicly accessible file
- **Exploitation**: Download app-registrations.json from storage
- **Impact**: Azure subscription compromise
- **Remediation**: Never store credentials in public storage

### 10.2 Service Principal Full Contributor Access
- **Flag**: `FLAG{service_principal_full_contributor_access}`
- **Location**: `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Service principal has Contributor role at subscription level
- **Exploitation**: Use credentials to manage all Azure resources
- **Impact**: Complete subscription control
- **Remediation**: Principle of least privilege, resource-scoped roles

### 10.3 Service Principal Can Access All Azure Resources
- **Flag**: `FLAG{service_principal_can_access_all_azure_resources}`
- **Location**: `/public/js/admin.js`, `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Overly permissive service principal with broad access
- **Exploitation**: Use for reconnaissance and resource manipulation
- **Impact**: Subscription-wide compromise
- **Remediation**: Scoped permissions, regular access reviews

### 10.4 Azure CLI Commands with Credentials
- **Flag**: `FLAG{azure_cli_commands_with_credentials}`
- **Location**: `/public/app-registrations.json`
- **Severity**: CRITICAL
- **Description**: Complete Azure CLI login commands with credentials
- **Exploitation**: Copy-paste commands to authenticate
- **Impact**: Immediate Azure access
- **Remediation**: Never document authentication commands with secrets

---

## 11. Client-Side Security Issues

### 11.1 Exposed Flight Data in Client-Side Code
- **Flag**: `FLAG{exposed_flight_data_in_client_side_code}`
- **Location**: `/public/js/main.js`
- **Severity**: LOW
- **Description**: All flight data stored in client-side JavaScript
- **Exploitation**: View source to see all flights and pricing
- **Impact**: Business logic exposure, price manipulation
- **Remediation**: Server-side data storage, API-based data retrieval

### 11.2 Hotel Details Exposed Client Side
- **Flag**: `FLAG{hotel_details_exposed_client_side}`
- **Location**: `/public/js/hotels.js`
- **Severity**: LOW
- **Description**: Complete hotel database in client JavaScript
- **Exploitation**: Extract all hotel data from source
- **Impact**: Business data exposure
- **Remediation**: Server-side data, paginated API

### 11.3 All User Data Accessible via Window Object
- **Flag**: `FLAG{all_user_data_accessible_via_window_object}`
- **Location**: `/public/js/main.js` - window.sampleUsers
- **Severity**: HIGH
- **Description**: User database exposed as global window object
- **Exploitation**: Access window.sampleUsers in console
- **Impact**: Complete user data exposure
- **Remediation**: Avoid global variables, use module patterns

### 11.4 All Registration Data Logged to Console
- **Flag**: `FLAG{all_registration_data_logged_to_console}`
- **Location**: `/public/js/register.js`
- **Severity**: HIGH
- **Description**: Registration form data including passwords logged
- **Exploitation**: View console during registration
- **Impact**: Credential capture, PII exposure
- **Remediation**: Remove debug logging, never log sensitive data

### 11.5 Insecure Registration Accepts Any Data
- **Flag**: `FLAG{insecure_registration_accepts_any_data}`
- **Location**: `/public/js/register.js`
- **Severity**: MEDIUM
- **Description**: No validation on registration input
- **Exploitation**: Submit malicious or invalid data
- **Impact**: Data integrity issues, potential injection
- **Remediation**: Server-side validation, input sanitization

### 11.6 Registration Endpoint No Verification
- **Flag**: `FLAG{registration_endpoint_no_verification}`
- **Location**: `/public/js/register.js`
- **Severity**: MEDIUM
- **Description**: No email verification or identity validation
- **Exploitation**: Create accounts with any email
- **Impact**: Fake accounts, spam, abuse
- **Remediation**: Email verification, CAPTCHA

---

## 12. IDOR & Direct Reference Issues

### 12.1 IDOR Vulnerability in Hotel Details
- **Flag**: `FLAG{idor_vulnerability_in_hotel_details}`
- **Location**: `/public/hotel-detail.html`
- **Severity**: HIGH
- **Description**: Predictable hotel IDs (HT001, HT002, etc.)
- **Exploitation**: Change ?id= parameter to access other hotels
- **Impact**: Unauthorized data access
- **Remediation**: Use UUIDs, validate ownership

### 12.2 Internal Hotel Data Exposed in UI
- **Flag**: `FLAG{internal_hotel_data_exposed_in_ui}`
- **Location**: `/public/js/hotel-detail.js`
- **Severity**: MEDIUM
- **Description**: Internal hotel data fields visible in UI
- **Exploitation**: View page source or inspect elements
- **Impact**: Business data exposure
- **Remediation**: Only send necessary data to client

### 12.3 Hotel Detail Page with IDOR
- **Flag**: `FLAG{hotel_detail_page_with_insecure_direct_object_reference}`
- **Location**: `/public/hotel-detail.html`
- **Severity**: HIGH
- **Description**: Direct object reference without authorization
- **Exploitation**: Modify URL parameters
- **Impact**: Access to all hotel data
- **Remediation**: Server-side authorization checks

---

## 13. Information Disclosure

### 13.1 All User PII Dumped Including Passwords
- **Flag**: `FLAG{all_user_pii_dumped_including_passwords}`
- **Location**: `/public/js/admin.js` - exportUserData()
- **Severity**: CRITICAL
- **Description**: Export function includes passwords in plain text
- **Exploitation**: Use exportUserData() in console
- **Impact**: Complete credential and PII breach
- **Remediation**: Never export passwords, hash credentials

### 13.2 User Data Export Contains Everything
- **Flag**: `FLAG{user_data_export_contains_everything}`
- **Location**: `/public/js/admin.js`
- **Severity**: CRITICAL
- **Description**: Data export includes all sensitive fields
- **Exploitation**: Export function accessible without proper authorization
- **Impact**: Mass data exfiltration
- **Remediation**: Sanitize exports, require authorization

---

## 14. Session & Token Management

### 14.1 Predictable Session Token Generation
- **Flag**: `FLAG{predictable_session_token_generation}`
- **Location**: `/public/js/login.js`
- **Severity**: HIGH
- **Description**: Session tokens generated with predictable patterns
- **Exploitation**: Generate valid tokens without authentication
- **Impact**: Session hijacking, unauthorized access
- **Remediation**: Use cryptographically secure random tokens

### 14.2 API Key Regeneration Predictable
- **Flag**: `FLAG{api_key_regeneration_predictable}`
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
