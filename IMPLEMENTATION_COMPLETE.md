# Blue Mountain Travel - Enhanced Security Training Features

## Summary of Implementation

This document summarizes all the new features and vulnerabilities added to the Blue Mountain Travel application to meet the requirements for a comprehensive security training environment.

## Features Implemented

### 1. ✅ Expanded Flight Database
- **50 international flight routes** covering major cities worldwide
- Searchable by origin, destination, and airline
- Includes detailed information: departure times, duration, pricing
- Flight search functionality with dropdown filters

### 2. ✅ Detailed Hotel Information
- **12 luxury hotels** with comprehensive details
- Room facilities: bed types, amenities, bathroom features
- Hotel facilities: spa, restaurants, pools, business centers
- Pricing, availability, check-in/check-out policies, cancellation policies
- Clickable hotel cards leading to detailed view pages

### 3. ✅ Hotel Detail Pages
- Individual pages for each hotel (IDOR vulnerability)
- Display all room and hotel facilities
- Show prices, contact information, addresses
- Booking functionality integrated

### 4. ✅ Login and Registration System
- Full authentication pages (intentionally vulnerable)
- Login page with demo credentials
- Registration page collecting PII
- Client-side authentication (exploitable)
- Plain text password storage
- "Remember me" functionality storing credentials in localStorage

### 5. ✅ User Management with PII Data
- **6 sample users** with complete profiles
- Stored data includes:
  - Passwords (plain text)
  - Credit card numbers with CVV
  - Social Security Numbers
  - Azure/Entra credentials
  - Addresses, phone numbers, personal emails
  - Security question answers
- Users accessible via `window.sampleUsers`

### 6. ✅ Admin Panel
- Accessible without authentication at `/admin.html`
- Displays all system credentials:
  - Azure subscription details
  - Database connection strings
  - Service principal secrets
  - API keys
  - Entra ID global admin credentials
- Functions to export user data, view all credentials
- Full Azure configuration exposed

### 7. ✅ Password Spraying Capabilities
- **User enumeration endpoint** - no authentication required
- **Application password spray** - test credentials against user list
- **Database password spray** - attempt SQL authentication
- **Entra ID password spray** - test against Azure AD
- No rate limiting on any endpoint
- Functions available in browser console

### 8. ✅ Employee Database
- **6 employees + admin** with complete HR data
- Contains:
  - Full names, emails, personal emails
  - SSN, salary, date of birth
  - Home addresses, emergency contacts
  - AD usernames, Azure usernames
  - Security question answers
  - Access levels and VPN access status
- Searchable without authentication
- Exportable to JSON

### 9. ✅ Passport Documents
- **6 international passports** (US, UK, China, Mexico + Diplomatic)
- Each passport includes:
  - Full passport PDF (simulated)
  - High-resolution passport photo
  - Complete biographical data
  - Visa information and travel history
- Stored in Azure Blob Storage "passports" container
- Accessible via public SAS token

### 10. ✅ Passport Viewer Page
- Dedicated page at `/passport-viewer.html`
- Displays all passport images (using Unsplash photos)
- Shows passport details for each employee
- Provides direct download URLs with SAS tokens
- No authentication required
- Includes diplomatic passport for admin

### 11. ✅ Azure Storage Browser
- Web-based storage browser at `/storage-browser.html`
- Lists all containers:
  - passports - Employee documents
  - profiles - User data
  - bookings - Travel bookings
  - documents - Configuration files
- Browse and download files
- SAS token displayed in UI

### 12. ✅ App Registration Credentials
- JSON file at `/app-registrations.json`
- Contains:
  - 3 service principal configurations
  - Client secrets for each
  - Azure subscription details
  - Key Vault access information
  - Azure CLI commands with embedded credentials
- Publicly accessible without authentication

### 13. ✅ Lateral Movement Paths

#### Path 1: Database → Storage
1. Get DB credentials from source code
2. Query database for blob URLs
3. Use SAS tokens to access storage

#### Path 2: Service Principal → Key Vault → Storage
1. Find app-registrations.json
2. Extract service principal credentials
3. Authenticate to Azure
4. Access Key Vault
5. Retrieve storage account keys
6. Full access to all containers

### 14. ✅ Hidden CTF Flags
- **60+ flags** throughout the application
- Located in:
  - HTML comments
  - JavaScript source code
  - Console logs
  - API responses
  - Configuration files
  - Function outputs
- Documented in VULNERABILITY_GUIDE.md

## Security Vulnerabilities (Intentional)

### Authentication & Authorization
1. Client-side authentication only
2. No rate limiting on login attempts
3. User enumeration via different error messages
4. Passwords stored in plain text
5. Remember me stores credentials in localStorage
6. No session timeout
7. Predictable session tokens
8. Admin panel without authentication

### Data Exposure
1. All user data in window object
2. Passwords logged to console
3. PII in localStorage
4. Database credentials in source code
5. Azure credentials in JavaScript
6. Service principal secrets in JSON file
7. SAS tokens in HTML/JavaScript
8. Passport images publicly accessible

### Azure-Specific
1. Long-lived SAS tokens (expires 2025)
2. SAS token with full permissions
3. Public blob containers
4. Service principal with Contributor role
5. Database credentials in multiple locations
6. Key Vault access via service principal
7. No IP restrictions
8. No conditional access policies

### Password Spraying & Enumeration
1. No rate limiting on authentication
2. Username enumeration endpoint
3. Different response times for valid/invalid users
4. List all usernames function
5. No account lockout
6. Verbose error messages

### IDOR & Access Control
1. Hotel details accessible by ID parameter
2. Booking IDs predictable
3. User profiles accessible without authentication
4. No authorization checks
5. Direct object references everywhere

## Files Added/Modified

### New HTML Pages
- `/public/login.html` - Login page
- `/public/register.html` - Registration page
- `/public/admin.html` - Admin panel
- `/public/hotel-detail.html` - Hotel detail view
- `/public/storage-browser.html` - Storage browser
- `/public/passport-viewer.html` - Passport viewer

### New JavaScript Files
- `/public/js/login.js` - Login functionality
- `/public/js/register.js` - Registration functionality
- `/public/js/admin.js` - Admin panel functionality
- `/public/js/hotel-detail.js` - Hotel detail page
- `/public/js/enumeration.js` - User enumeration & password spray
- `/public/js/employee-db.js` - Employee database
- `/public/js/passport-db.js` - Passport database
- `/public/js/storage-browser.js` - Storage browser functionality

### Modified Files
- `/public/js/main.js` - Added 50 flights, 12 hotels, 6 users with PII
- `/public/js/flights.js` - Added search functionality
- `/public/js/hotels.js` - Added detail page links
- `/public/flights.html` - Added search form

### New Data Files
- `/public/app-registrations.json` - Service principal credentials

### Documentation
- `/VULNERABILITY_GUIDE.md` - Complete guide with all flags and vulnerabilities

## Testing Instructions

1. **Start the application**:
   ```bash
   npm install
   npm start
   ```

2. **Open browser to**: http://localhost:8080

3. **Test key features**:
   - Login with john.smith@company.com / password123
   - Access admin panel without auth: /admin.html
   - View passports: /passport-viewer.html
   - Browse storage: /storage-browser.html
   - Test password spray in console

4. **Find flags**:
   - View page source for HTML comments
   - Open DevTools console for JavaScript flags
   - Check network tab for API credentials
   - Download app-registrations.json

## Statistics

- **Total Flags**: 60+
- **Total Users**: 6 + 1 admin
- **Total Flights**: 50
- **Total Hotels**: 12
- **Total Passports**: 6 (with images)
- **Total Employees**: 6 + 1 admin
- **Vulnerabilities**: 20+ categories
- **Lines of Code Added**: ~5000+

## Key Learning Objectives

Students will learn about:
1. User enumeration and password spraying
2. Client-side security vulnerabilities
3. Azure storage misconfigurations
4. Service principal abuse
5. Lateral movement in cloud environments
6. PII data exposure
7. IDOR vulnerabilities
8. Authentication bypass techniques
9. Privilege escalation
10. Data exfiltration methods

## Conclusion

The Blue Mountain Travel application now provides a comprehensive, realistic environment for security training with multiple attack paths, numerous flags to discover, and real-world vulnerability scenarios. All requirements from the problem statement have been implemented:

✅ Flight search with large destination list
✅ Detailed hotel/destination information from database
✅ Login pages with PII data (passwords, credit cards, SSNs)
✅ Multiple CTF flags hidden throughout
✅ Password spraying capabilities
✅ Employee database for enumeration
✅ Passport documents with images in Azure storage
✅ App registration credentials for lateral movement
✅ Anonymous access and enumeration vectors

The application is ready for security training use!
