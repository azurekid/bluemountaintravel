# Blue Mountain Travel - Security Training Demo

![Blue Mountain Travel](https://img.shields.io/badge/Security-Training%20Demo-red)
![Status](https://img.shields.io/badge/Status-Intentionally%20Vulnerable-orange)

## ⚠️ SECURITY WARNING

**This application contains INTENTIONAL security vulnerabilities and should ONLY be used for security training and educational purposes. DO NOT deploy this to production or use it with real data.**

## Overview

Blue Mountain Travel is a premium business travel agency website that demonstrates common security vulnerabilities found in web applications. It is designed as a training tool for security professionals, developers, and students to learn about web application security issues.

## Features

### Business Features
- **Flight Booking System** - Search and book business class flights to major destinations worldwide
- **Hotel Reservations** - Browse and book premium business hotels
- **User Profiles** - Manage personal information and travel preferences
- **Booking Management** - View and manage all travel bookings
- **Responsive Design** - Professional, modern UI that works on all devices

### Security Training Features (Vulnerabilities)

This application intentionally includes the following security vulnerabilities:

1. **Exposed Azure SAS Tokens** - SAS tokens hardcoded in client-side JavaScript
2. **Hardcoded Credentials** - Database connection strings and API keys in source code
3. **Public Blob Storage** - Azure Storage containers with public access enabled
4. **Sensitive Data in localStorage** - Passwords, credit cards, and PII stored in browser
5. **Insufficient Access Controls** - No authentication required for sensitive operations
6. **Information Disclosure** - Detailed error messages and debug information exposed
7. **Direct Object References** - Predictable URLs for accessing user data
8. **Client-Side Security** - All validation and security checks done on client side only
9. **Long-Lived Tokens** - SAS tokens with excessive permissions and long expiration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Optional: Azure account for deploying infrastructure

### Installation

1. Clone the repository:
```bash
git clone https://github.com/azurekid/bluemountaintravel.git
cd bluemountaintravel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:8080
```

### Quick Start

The application will automatically log you in with a default user account:
- **Email**: john.smith@company.com
- **Password**: password123 (visible in browser console)

## Project Structure

```
bluemountaintravel/
├── config/
│   └── azure-config.json       # Azure configuration with exposed credentials
├── public/
│   ├── css/
│   │   └── styles.css          # Professional styling
│   ├── js/
│   │   ├── main.js             # Main app logic with vulnerabilities
│   │   ├── flights.js          # Flight booking functionality
│   │   ├── hotels.js           # Hotel booking functionality
│   │   ├── bookings.js         # Booking management
│   │   └── profile.js          # User profile management
│   ├── index.html              # Home page
│   ├── flights.html            # Flights listing
│   ├── hotels.html             # Hotels listing
│   ├── bookings.html           # Bookings page
│   └── profile.html            # User profile
├── docs/                       # Documentation
│   ├── DEPLOYMENT.md           # Azure deployment guide
│   ├── SECURITY_GUIDE.md       # Security vulnerabilities guide
│   ├── VULNERABILITIES_REFERENCE.md  # Complete vulnerabilities catalog
│   └── AZURE_RESOURCES_DATA_MAP.md   # Azure resources and data mapping
├── package.json                # Node.js dependencies
└── README.md                   # This file
```

## Security Vulnerabilities Guide

### 1. Exposed SAS Tokens

**Location**: `public/js/main.js`

```javascript
const AZURE_STORAGE_SAS_TOKEN = "?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx...";
```

**Impact**: Anyone with access to the website can view the SAS token in the browser's developer tools and gain direct access to Azure Storage.

**Fix**: 
- Never expose SAS tokens in client-side code
- Generate short-lived SAS tokens server-side
- Use Azure AD authentication instead
- Implement proper access controls

### 2. Hardcoded Database Credentials

**Location**: `config/azure-config.json` and `public/js/main.js`

```javascript
const DATABASE_CONFIG = {
    username: "admin",
    password: "P@ssw0rd123!",
    connectionString: "Server=tcp:bluemountaintravel.database.windows.net..."
};
```

**Impact**: Database credentials exposed in client-accessible files.

**Fix**:
- Store credentials in Azure Key Vault
- Use Managed Identities for Azure resources
- Never commit credentials to source control
- Use environment variables on the server side

### 3. Public Blob Storage

**Location**: Throughout the application

**Impact**: Sensitive documents and user data accessible without authentication.

**Fix**:
- Disable public access on blob containers
- Require authentication for all blob operations
- Use Azure AD for access control
- Implement proper authorization checks

### 4. Sensitive Data in localStorage

**Location**: `public/js/main.js`, `public/js/bookings.js`, `public/js/profile.js`

**Impact**: Passwords, credit card numbers, and PII stored unencrypted in the browser.

**Fix**:
- Never store sensitive data in localStorage
- Use secure, HTTP-only cookies for session management
- Implement server-side sessions
- Encrypt sensitive data at rest

### 5. No Authentication/Authorization

**Impact**: All pages and functions accessible without login.

**Fix**:
- Implement proper authentication (OAuth 2.0, Azure AD)
- Add authorization checks on server side
- Use JWT tokens properly
- Implement role-based access control (RBAC)

## Learning Exercises

Use this application to practice:

1. **Reconnaissance** - Use browser developer tools to find exposed credentials
2. **Access Control Testing** - Try to access other users' data
3. **Data Exposure** - Find PII and sensitive data in localStorage and console logs
4. **Token Manipulation** - Use exposed SAS tokens to access Azure Storage
5. **Security Code Review** - Identify vulnerabilities in the source code
6. **Security Testing** - Write automated tests to detect these vulnerabilities

## Azure Deployment (Optional)

To deploy the complete vulnerable infrastructure to Azure for training:

1. See `docs/DEPLOYMENT.md` for detailed instructions
2. Review `config/azure-config.json` for infrastructure setup
3. Use the provided deployment scripts

## Security Best Practices (Not Implemented)

This section lists security best practices that are intentionally NOT implemented in this demo:

- ❌ Server-side validation and authentication
- ❌ Encrypted storage of sensitive data
- ❌ Secure credential management (Key Vault)
- ❌ Proper access controls and RBAC
- ❌ Short-lived, scoped tokens
- ❌ HTTPS enforcement
- ❌ Content Security Policy (CSP)
- ❌ Input validation and sanitization
- ❌ Rate limiting and throttling
- ❌ Audit logging
- ❌ Security headers
- ❌ CORS policies

## Contributing

This is a security training tool. If you find additional vulnerabilities to add for training purposes, please submit a pull request.

## Disclaimer

This application is for educational purposes only. The authors are not responsible for any misuse of this code. Do not use this application with real data or deploy it to production environments.

## License

MIT License - See LICENSE file for details

## Documentation

For detailed information about this security training application:

- **[Complete Vulnerabilities Reference](docs/VULNERABILITIES_REFERENCE.md)** - Comprehensive catalog of all 68 security vulnerabilities with exploitation details and remediation guidance
- **[Azure Resources and Data Mapping](docs/AZURE_RESOURCES_DATA_MAP.md)** - Complete mapping of Azure resources and what data is stored where
- **[Security Guide](docs/SECURITY_GUIDE.md)** - Detailed guide to major security vulnerabilities
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Azure deployment instructions
- **[Vulnerability Guide](VULNERABILITY_GUIDE.md)** - CTF flags and vulnerability walkthrough

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/fundamentals/best-practices-and-patterns)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)

## Support

For questions about this training tool, please open an issue on GitHub.

---

**Remember: This is a deliberately vulnerable application for training purposes only!**
