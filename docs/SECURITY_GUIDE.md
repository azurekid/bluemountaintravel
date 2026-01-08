# Security Vulnerabilities Guide

This document provides a comprehensive guide to all security vulnerabilities intentionally included in the Blue Mountain Travel application for training purposes.

## Table of Contents

1. [Exposed Azure SAS Tokens](#1-exposed-azure-sas-tokens)
2. [Hardcoded Credentials](#2-hardcoded-credentials)
3. [Public Blob Storage](#3-public-blob-storage)
4. [Sensitive Data in localStorage](#4-sensitive-data-in-localstorage)
5. [No Authentication/Authorization](#5-no-authenticationauthorization)
6. [Information Disclosure](#6-information-disclosure)
7. [Insecure Direct Object References](#7-insecure-direct-object-references)
8. [Client-Side Security Controls](#8-client-side-security-controls)
9. [Long-Lived Tokens](#9-long-lived-tokens)
10. [Missing Security Headers](#10-missing-security-headers)

---

## 1. Exposed Azure SAS Tokens

### Description
Shared Access Signature (SAS) tokens are hardcoded directly in client-side JavaScript files.

### Location
- `public/js/main.js` - Lines 4-5

### Example Code
```javascript
const AZURE_STORAGE_SAS_TOKEN = window.AzureConfig?.sasToken;
const AZURE_STORAGE_SAS_TOKEN_DOCUMENTS_WRITE = window.AzureConfig?.documentsWriteSasToken;
```

### How to Exploit
1. Open the website in a browser
2. Press F12 to open Developer Tools
3. Go to Sources tab and view `main.js`
4. Copy the SAS token
5. Use it to access blob storage directly:
```bash
curl "https://bluemountaintravel.blob.core.windows.net/bookings?restype=container&comp=list&[SAS_TOKEN]"
```

### Impact
- **Severity**: CRITICAL
- Unauthorized access to all Azure Storage containers
- Ability to read, write, delete files
- Access to sensitive booking and profile data
- Potential data breach of customer information

### Real-World Examples
- [OWASP A01:2021 – Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- Similar issues found in production apps have led to major data breaches

### Remediation
```javascript
// DON'T DO THIS:
const SAS_TOKEN = "<SAS_TOKEN>";

// DO THIS INSTEAD:
// Server-side API endpoint
app.get('/api/get-sas-token', authenticateUser, async (req, res) => {
  const token = generateShortLivedSasToken(req.user.id, 'read', 15); // 15 minutes
  res.json({ token });
});

// Client-side request
const response = await fetch('/api/get-sas-token', {
  headers: { 'Authorization': 'Bearer ' + userToken }
});
const { token } = await response.json();
```

---

## 2. Hardcoded Credentials

### Description
Database credentials, API keys, and other sensitive configuration are stored in source code.

### Locations
- `config/azure-config.json` - Complete configuration file
- `public/js/main.js` - Lines 7-14, 17-22

### Example Code
```javascript
const DATABASE_CONFIG = {
    server: "bluemountaintravel.database.windows.net",
    username: "admin",
    password: "P@ssw0rd123!",
    connectionString: "Server=tcp:bluemountaintravel.database.windows.net,1433;User ID=admin;Password=P@ssw0rd123!;"
};
```

### How to Exploit
1. Access the website
2. View page source or JavaScript files
3. Find credentials in code or console logs
4. Use credentials to connect directly to database:
```bash
sqlcmd -S bluemountaintravel.database.windows.net -U admin -P "P@ssw0rd123!" -d TravelDB
```

### Impact
- **Severity**: CRITICAL
- Direct database access
- Ability to read all customer data
- Ability to modify or delete records
- Potential for complete system compromise

### Real-World Examples
- [CVE-2019-5418](https://nvd.nist.gov/vuln/detail/CVE-2019-5418)
- Many breaches start with exposed credentials in GitHub repos

### Remediation
```javascript
// DON'T DO THIS:
const password = "P@ssw0rd123!";

// DO THIS INSTEAD:
// Use Azure Key Vault
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const credential = new DefaultAzureCredential();
const client = new SecretClient(vaultUrl, credential);
const secret = await client.getSecret("DatabasePassword");

// Or use environment variables (server-side only)
const password = process.env.DATABASE_PASSWORD;
```

---

## 3. Public Blob Storage

### Description
Azure Storage containers are configured with public blob access enabled, allowing anyone to list and download files.

### Location
- All storage containers: bookings, profiles, documents

### How to Exploit
1. Find container URLs in the application
2. Access container directly without authentication:
```
https://bluemountaintravel.blob.core.windows.net/profiles
https://bluemountaintravel.blob.core.windows.net/bookings
```
3. List all blobs in container:
```bash
curl "https://bluemountaintravel.blob.core.windows.net/bookings?restype=container&comp=list"
```

### Impact
- **Severity**: HIGH
- Unauthorized access to all documents
- Customer PII exposure
- Booking information disclosure
- No audit trail of who accessed what

### Real-World Examples
- [Tesla S3 Bucket Exposure](https://www.upguard.com/breaches/cloud-leak-tesla)
- [Verizon S3 Bucket Leak](https://www.upguard.com/breaches/verizon-cloudhopper)

### Remediation
```bash
# Disable public blob access
az storage account update \
  --name bluemountaintravel \
  --allow-blob-public-access false

# Set container to private
az storage container set-permission \
  --name bookings \
  --public-access off
```

```javascript
// Implement proper access control
async function getSecureDocumentUrl(documentId, userId) {
  // Verify user has permission to access document
  if (!await userCanAccessDocument(userId, documentId)) {
    throw new Error('Unauthorized');
  }
  
  // Generate short-lived SAS token
  const sasToken = await generateUserScopedSasToken(userId, documentId, 15);
  return `https://storage.blob.core.windows.net/documents/${documentId}?${sasToken}`;
}
```

---

## 4. Sensitive Data in localStorage

### Description
Passwords, credit card numbers, SSNs, and other PII are stored unencrypted in browser localStorage.

### Locations
- `public/js/main.js` - Line 105-120 (loadUserData function)
- `public/js/bookings.js` - Line 91-95 (booking storage)
- `public/js/flights.js` - Line 86-90
- `public/js/hotels.js` - Line 100-104

### Example Code
```javascript
const user = {
    password: "password123",
    creditCard: "4532-1234-5678-9012",
    ssn: "123-45-6789"
};
localStorage.setItem('currentUser', JSON.stringify(user));
```

### How to Exploit
1. Open website
2. Make a booking or view profile
3. Open Developer Tools > Application > Local Storage
4. View all stored data including passwords and credit cards
5. Export data:
```javascript
console.log(JSON.parse(localStorage.getItem('currentUser')));
```

### Impact
- **Severity**: HIGH
- Exposure of passwords in plain text
- Credit card information accessible
- SSN and PII available to any JavaScript
- Persistent across sessions
- Accessible to XSS attacks

### Real-World Examples
- [OWASP A02:2021 – Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)
- Storing sensitive data in localStorage violates PCI-DSS

### Remediation
```javascript
// DON'T DO THIS:
localStorage.setItem('password', userPassword);
localStorage.setItem('creditCard', cardNumber);

// DO THIS INSTEAD:
// 1. Never store passwords client-side
// 2. Use secure, HTTP-only cookies for session management
// 3. Handle sensitive data server-side only

// Server-side session
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 3600000
  }
}));

// Client-side - only store non-sensitive data
const publicProfile = {
  firstName: user.firstName,
  email: user.email,
  membershipTier: user.tier
};
localStorage.setItem('profile', JSON.stringify(publicProfile));
```

---

## 5. No Authentication/Authorization

### Description
All pages and API endpoints are accessible without any authentication or authorization checks.

### Location
- All HTML pages accessible without login
- All JavaScript functions executable without validation

### How to Exploit
1. Access any page directly: `http://localhost:8080/bookings.html`
2. View other users' data by manipulating localStorage
3. Call any function in the browser console:
```javascript
bookFlight('FL001');
showRawUserData();
exportBookingsData();
```

### Impact
- **Severity**: CRITICAL
- No user identity verification
- Anyone can access any data
- No audit trail
- Horizontal privilege escalation possible
- Vertical privilege escalation possible

### Real-World Examples
- [OWASP A07:2021 – Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)
- [Broken Authentication Examples](https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication)

### Remediation
```javascript
// Server-side authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected route
app.get('/api/bookings', authenticateToken, async (req, res) => {
  const bookings = await getBookingsForUser(req.user.id);
  res.json(bookings);
});

// Authorization check
const authorizeBookingAccess = async (req, res, next) => {
  const booking = await getBooking(req.params.id);
  if (booking.userId !== req.user.id) {
    return res.sendStatus(403);
  }
  next();
};
```

---

## 6. Information Disclosure

### Description
Detailed error messages, debug information, and sensitive configuration are logged to the browser console.

### Locations
- `public/js/main.js` - Lines 175-186 (initialization logging)
- `public/js/profile.js` - Lines 25-28 (password logging)
- All files - console.log statements throughout

### Example Code
```javascript
console.log('Azure Configuration:', {
    storageAccount: STORAGE_ACCOUNT_NAME,
    sasToken: AZURE_STORAGE_SAS_TOKEN,
    apiKeys: API_CONFIG,
    database: DATABASE_CONFIG
});
```

### How to Exploit
1. Open Developer Tools console
2. View all logged information
3. Find credentials, tokens, and configuration
4. Use information for further attacks

### Impact
- **Severity**: MEDIUM
- Reveals system architecture
- Exposes internal data structures
- Makes other vulnerabilities easier to exploit
- Aids in reconnaissance

### Remediation
```javascript
// DON'T DO THIS:
console.log('User:', user);
console.log('Password:', password);
console.error('Error details:', error);

// DO THIS INSTEAD:
// Remove all debug logging in production
if (process.env.NODE_ENV !== 'production') {
  console.log('Debug info');
}

// Use proper logging library
const logger = require('winston');
logger.error('Error occurred', { 
  userId: user.id, // Don't log sensitive data
  timestamp: new Date()
});

// Generic error messages to client
res.status(500).json({ error: 'An error occurred' });
```

---

## 7. Insecure Direct Object References

### Description
Predictable URLs and IDs allow users to access resources belonging to other users.

### Locations
- Booking IDs: `BK{timestamp}` and `HB{timestamp}`
- Document URLs with predictable patterns
- User IDs: `USR001`, `USR002`, etc.

### How to Exploit
```javascript
// Current user's booking
const myBooking = 'BK1704096000000';

// Try other bookings by changing timestamp
const otherBooking = 'BK1704095999000';

// Access in browser
fetch(`/api/bookings/${otherBooking}`);
```

### Impact
- **Severity**: HIGH
- Access to other users' bookings
- Ability to view private information
- No ownership validation

### Remediation
```javascript
// DON'T DO THIS:
app.get('/api/bookings/:bookingId', (req, res) => {
  const booking = getBooking(req.params.bookingId);
  res.json(booking);
});

// DO THIS INSTEAD:
app.get('/api/bookings/:bookingId', authenticateToken, async (req, res) => {
  const booking = await getBooking(req.params.bookingId);
  
  // Verify ownership
  if (booking.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json(booking);
});

// Use UUIDs instead of predictable IDs
const bookingId = crypto.randomUUID(); // "550e8400-e29b-41d4-a716-446655440000"
```

---

## 8. Client-Side Security Controls

### Description
All validation and security checks are performed on the client side only.

### Location
- All validation in JavaScript
- No server-side enforcement

### How to Exploit
```javascript
// Bypass client-side validation
const maliciousBooking = {
  price: 0, // Free flight!
  userId: 'USR999', // Impersonate another user
  status: 'confirmed'
};
localStorage.setItem('bookings', JSON.stringify([maliciousBooking]));
```

### Impact
- **Severity**: HIGH
- Easy to bypass all controls
- Data manipulation possible
- Price tampering
- Business logic bypass

### Remediation
```javascript
// DON'T DO THIS (client-side only):
if (price > 0 && price < 10000) {
  submitBooking(bookingData);
}

// DO THIS INSTEAD (server-side validation):
app.post('/api/bookings', authenticateToken, async (req, res) => {
  const { flightId, ...bookingData } = req.body;
  
  // Server-side validation
  if (!flightId || !isValidFlightId(flightId)) {
    return res.status(400).json({ error: 'Invalid flight ID' });
  }
  
  // Get authoritative price from database
  const flight = await getFlight(flightId);
  const actualPrice = flight.price;
  
  // Create booking with validated data
  const booking = await createBooking({
    userId: req.user.id, // From authenticated session
    flightId: flightId,
    price: actualPrice, // Not from client
    status: 'pending' // Initial status, not from client
  });
  
  res.json(booking);
});
```

---

## 9. Long-Lived Tokens

### Description
SAS tokens have excessive permissions and very long expiration times.

### Location
- SAS token expires December 31, 2025
- Permissions: rwdlacupiytfx (all permissions)

### Example
```
<SAS_TOKEN_QUERY_STRING>
```

### Impact
- **Severity**: HIGH
- Tokens valid for years
- If compromised, attacker has long-term access
- Excessive permissions allow delete operations
- Cannot easily revoke access

### Remediation
```javascript
// DON'T DO THIS:
const sasToken = generateSasToken({
  permissions: 'rwdlacupiytfx',
  expiryTime: new Date('2025-12-31')
});

// DO THIS INSTEAD:
function generateUserScopedSasToken(userId, resource, minutesValid = 15) {
  const start = new Date();
  const expiry = new Date(start.getTime() + minutesValid * 60000);
  
  return generateSasToken({
    permissions: 'r', // Read only
    expiryTime: expiry,
    ipRange: getUserIpAddress(),
    path: `/users/${userId}/${resource}`
  });
}
```

---

## 10. Missing Security Headers

### Description
No security headers are configured, making the application vulnerable to various attacks.

### Missing Headers
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- X-XSS-Protection

### Impact
- **Severity**: MEDIUM
- Vulnerable to XSS attacks
- Vulnerable to clickjacking
- No HTTPS enforcement
- MIME-type sniffing possible

### Remediation
```javascript
// Express.js with helmet
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Or configure in Azure Static Web App
// staticwebapp.config.json
{
  "globalHeaders": {
    "content-security-policy": "default-src 'self'",
    "x-frame-options": "DENY",
    "x-content-type-options": "nosniff",
    "strict-transport-security": "max-age=31536000"
  }
}
```

---

## Summary Table

| Vulnerability | Severity | OWASP Top 10 | CWE |
|--------------|----------|--------------|-----|
| Exposed SAS Tokens | CRITICAL | A01:2021 | CWE-798 |
| Hardcoded Credentials | CRITICAL | A07:2021 | CWE-798 |
| Public Blob Storage | HIGH | A01:2021 | CWE-732 |
| localStorage Sensitive Data | HIGH | A02:2021 | CWE-312 |
| No Authentication | CRITICAL | A07:2021 | CWE-306 |
| Information Disclosure | MEDIUM | A04:2021 | CWE-200 |
| IDOR | HIGH | A01:2021 | CWE-639 |
| Client-Side Controls | HIGH | A04:2021 | CWE-602 |
| Long-Lived Tokens | HIGH | A07:2021 | CWE-613 |
| Missing Security Headers | MEDIUM | A05:2021 | CWE-1021 |

---

## Training Exercises

### Exercise 1: Vulnerability Discovery
Time: 30 minutes
- Access the website
- Use browser developer tools
- Document all vulnerabilities you find
- Take screenshots of evidence

### Exercise 2: Exploitation
Time: 45 minutes
- Exploit at least 3 vulnerabilities
- Extract sensitive data
- Document your methodology
- Create a proof-of-concept

### Exercise 3: Remediation
Time: 60 minutes
- Choose 3 vulnerabilities
- Write secure code to fix them
- Test your fixes
- Document the changes

### Exercise 4: Security Assessment
Time: 90 minutes
- Perform a complete security assessment
- Write an executive summary
- Prioritize findings
- Create a remediation plan

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Remember: This application is for training purposes only. Never deploy it to production!**
