# Database Architecture and Usage

## Overview

This document clarifies how data is stored and managed in the Blue Mountain Travel application, specifically addressing the Azure SQL Database (`bluemountaintravel-sql`) referenced throughout the codebase.

## Important: Database is NOT Actively Used

**The Azure SQL Database `bluemountaintravel-sql` (server: `bluemountaintravel.database.windows.net`) is NOT actively used by the running application.**

This is a **static web application** that operates entirely client-side without a backend server or active database connections.

## Actual Data Storage Architecture

### Production/Demo Environment

The application uses the following data storage mechanisms:

1. **Client-Side JavaScript Objects**
   - **Location**: `/public/js/main.js`, `/public/js/employee-db.js`, etc.
   - **Purpose**: Store sample data for flights, hotels, users, and employees
   - **Data**: Hardcoded arrays and objects
   - **Example**:
     ```javascript
     const flightData = [ /* 50+ flight objects */ ];
     const hotelData = [ /* 12+ hotel objects */ ];
     const sampleUsers = [ /* 6+ user objects */ ];
     ```

2. **Browser localStorage**
   - **Location**: User's browser
   - **Purpose**: Store user session data, bookings, and preferences
   - **Security Issue**: ⚠️ Intentionally vulnerable - sensitive data stored unencrypted
   - **Data Stored**:
     - Current user information (including passwords)
     - Search history
     - Booking data
     - Credit card information

3. **No Backend Server**
   - The application is served as static HTML/CSS/JavaScript files
   - No server-side processing
   - No actual database queries executed
   - All "database operations" are simulated client-side

## Database References in the Codebase

The Azure SQL Database is referenced in multiple locations, but these references serve **educational purposes only**:

### 1. Configuration Files
- **File**: `/config/azure-config.json`
- **Purpose**: Demonstrate exposed credentials vulnerability
- **Content**: Example connection strings with fake credentials
- **Usage**: Referenced in documentation and training materials

### 2. JavaScript Code
- **File**: `/public/js/main.js`
- **Lines**: 16-22
- **Content**:
  ```javascript
  const DATABASE_CONFIG = {
      server: "bluemountaintravel.database.windows.net",
      database: "TravelDB",
      username: "dbadmin",
      password: "P@ssw0rd123!",
      connectionString: "Server=tcp:bluemountaintravel.database.windows.net,1433;..."
  };
  ```
- **Purpose**: Demonstrate the vulnerability of hardcoded credentials in client-side code
- **Usage**: Logged to console, not used for actual connections

### 3. SQL Injection Demonstration
- **File**: `/public/js/sql-injection-demo.js`
- **Purpose**: Educational tool to demonstrate SQL injection vulnerabilities
- **Usage**: Shows what SQL queries would look like if there were a backend database
- **Example**:
  ```javascript
  function testFlightSQLInjection(payload) {
      const injectedQuery = "SELECT * FROM Flights WHERE departure_city = '" + payload + "'";
      console.log('⚠️ INJECTED SQL QUERY:', injectedQuery);
  }
  ```

### 4. Documentation
- **Files**: 
  - `/docs/DEPLOYMENT.md` - Instructions for optionally deploying a real Azure SQL Database
  - `/docs/AZURE_RESOURCES_DATA_MAP.md` - Describes what data would be stored if database were used
  - `/docs/SECURITY_GUIDE.md` - Shows database vulnerabilities as examples
- **Purpose**: Training scenarios and optional deployment configurations

### 5. Admin Panel Display
- **File**: `/public/js/admin.js`
- **Purpose**: Display fake connection strings as part of the security training
- **Usage**: Shows credentials in console for educational purposes

## Why the Database is Empty

If you deploy the Azure SQL Database as described in the deployment guide, it will be empty because:

1. **No Schema Creation**: There are no SQL scripts to create tables
2. **No Data Population**: There are no scripts to populate data
3. **No Backend Connection**: The static web app cannot connect to SQL databases
4. **Intentional Design**: The application is designed to work entirely client-side

## Optional Database Deployment

The deployment guide (`/docs/DEPLOYMENT.md`) includes instructions to create an Azure SQL Database for **advanced training scenarios**:

### Purpose of Optional Database
- Demonstrate misconfigured database security
- Practice identifying exposed database credentials
- Test database enumeration techniques
- Learn about firewall misconfigurations

### If You Deploy the Database
- It will remain empty unless you manually create tables and populate data
- The web application will NOT use it
- It serves as a "vulnerable infrastructure" training target
- Students can practice connecting with exposed credentials

## Training Scenarios

### Scenario 1: Credential Exposure Discovery
Students should:
1. Open browser DevTools
2. Navigate to Console tab
3. Find the exposed `DATABASE_CONFIG` object
4. Identify the connection string and credentials
5. Learn why this is a critical vulnerability

### Scenario 2: Client-Side Data Storage Analysis
Students should:
1. Open browser DevTools → Application → Local Storage
2. View stored user data including passwords
3. Understand why sensitive data should never be stored client-side
4. Learn about proper authentication mechanisms

### Scenario 3: SQL Injection Understanding
Students should:
1. Open browser Console
2. Call `showCommonSQLInjectionPayloads()`
3. Test injection payloads with `testFlightSQLInjection(payload)`
4. Understand SQL injection principles (even though no real database is used)

## Data Flow Diagram (Actual)

```
┌─────────────────┐
│   User Browser  │
│                 │
│  ┌───────────┐  │
│  │ HTML/CSS  │  │
│  │ JavaScript│  │
│  │  (with    │  │
│  │ hardcoded │  │
│  │   data)   │  │
│  └───────────┘  │
│        ↕         │
│  ┌───────────┐  │
│  │localStorage│ │
│  │ (sensitive │  │
│  │   data)    │  │
│  └───────────┘  │
└─────────────────┘

Note: No backend server or database connections
```

## Comparison: What a Secure Architecture Would Look Like

```
┌─────────────────┐
│   User Browser  │
│    (Client)     │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Backend API    │
│  (Server)       │
│  - Auth         │
│  - Validation   │
└────────┬────────┘
         │ Encrypted
         ▼
┌─────────────────┐
│  Azure SQL DB   │
│  - Encrypted    │
│  - Private      │
│  - Managed ID   │
└─────────────────┘
```

## Key Takeaways

1. **The database is not used** - This is a static web application
2. **All data is client-side** - Stored in JavaScript and localStorage
3. **Database references are educational** - Used to demonstrate vulnerabilities
4. **Empty database is expected** - If deployed, it's for training purposes only
5. **No backend required** - Application runs entirely in the browser

## Validation Steps

To validate that the database is not being used:

1. **Check Network Tab**: 
   - Open DevTools → Network
   - Navigate through the application
   - No database connection attempts will be visible

2. **Review Source Code**:
   - Search for actual database connection libraries (none exist)
   - No SQL Server client libraries in `package.json`
   - No backend API endpoints defined

3. **Test Offline**:
   - Disconnect from internet
   - Application still functions normally (after initial load)
   - Proves all data is client-side

4. **Check package.json**:
   ```json
   "dependencies": {
     "http-server": "^14.1.1"  // Only serves static files
   }
   ```
   No database drivers or connection libraries

## Conclusion

The Azure SQL Database `bluemountaintravel-sql` is referenced throughout the application for **educational purposes only**. The application is intentionally designed as a static website to demonstrate client-side security vulnerabilities. The database, if deployed, serves as an additional training target for practicing identification of exposed credentials and database misconfigurations, but is not required for the application to function.

This design is intentional and appropriate for a security training application, as it allows students to learn about multiple vulnerability types without requiring complex backend infrastructure.

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-06  
**Purpose**: Clarify database architecture for security training
