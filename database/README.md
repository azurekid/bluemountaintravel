# Database Setup

## Overview

This directory contains SQL scripts to initialize the Azure SQL Database for Blue Mountain Travel.

## Prerequisites

- Azure SQL Database instance created
- Database: `TravelDB`
- Server: `bluemountaintravel.database.windows.net`
- Admin credentials configured

## Setup Steps

### 1. Create Database Schema

You can run the schema creation script using Azure Portal or Azure CloudShell:

**Option A: Using Azure Portal Query Editor**
1. Navigate to your Azure SQL Database in the Azure Portal
2. Select "Query editor" from the left menu
3. Login with your database credentials (user: `dbadmin`, password: `P@ssw0rd123!`)
4. Open `schema.sql` in a text editor and copy its contents
5. Paste the SQL script into the query editor
6. Click "Run" to execute the schema creation

**Option B: Using Azure CloudShell**
1. Open Azure CloudShell in the Azure Portal (Bash or PowerShell)
2. Upload `schema.sql` to CloudShell (use the upload button)
3. Run the following command:
```bash
# Using sqlcmd in CloudShell
sqlcmd -S bluemountaintravel.database.windows.net -d TravelDB -U dbadmin -P 'P@ssw0rd123!' -i schema.sql
```

**Option C: Using Azure Data Studio / SSMS (if available locally)**
1. Open schema.sql in Azure Data Studio or SQL Server Management Studio
2. Connect to `bluemountaintravel.database.windows.net`
3. Use database: `TravelDB`
4. Login as: `dbadmin` with password `P@ssw0rd123!`
5. Execute the script

### 2. Seed Sample Data

After creating the schema, populate the database with realistic sample data using `seed-data.sql`:

**Option A: Using Azure Portal Query Editor** (Recommended)
1. In Azure Portal, navigate to your SQL Database → Query editor
2. Open `seed-data.sql` in a text editor and copy its contents
3. Paste the SQL script into the query editor
4. Click "Run" to execute the data insertion

**Option B: Using Azure CloudShell**
```bash
# Upload seed-data.sql to CloudShell
sqlcmd -S bluemountaintravel.database.windows.net -d TravelDB -U dbadmin -P 'P@ssw0rd123!' -i seed-data.sql
```

**Option C: Using `/api/execute` endpoint** (Alternative, ⚠️ vulnerable by design)
- Start the backend server: `npm start`
- Use the backend test page at http://localhost:3000/backend-test.html
- Copy sections from seed-data.sql and execute via the SQL execution interface

**Sample Data Included:**
- **11 Users** (10 regular + 1 admin) with realistic names, emails, addresses
- **20 Flights** covering major routes (US-Europe, US-Asia, Domestic)
- **12 Hotels** in major cities worldwide with detailed amenities
- **22 Bookings** showing realistic booking history (confirmed, completed, cancelled)

All data looks authentic but is fake and intentionally vulnerable for training.

## Database Tables

- **Users** - User accounts and authentication data (passwords in plain text)
- **Flights** - Available flight inventory
- **Hotels** - Available hotel inventory  
- **Bookings** - Customer travel bookings
- **UserPaymentInfo** - Payment methods (⚠️ unencrypted credit cards)
- **Employees** - Employee directory (⚠️ contains SSN and salary data)

## Security Warnings

⚠️ **This database schema is intentionally vulnerable for training purposes:**

- Passwords stored in plain text
- Credit card numbers unencrypted
- CVV codes stored (should never be done!)
- SSN and salary data unencrypted
- No row-level security
- Weak authentication

## Connection from Application

The Node.js backend (`server.js`) connects using:

```javascript
const dbConfig = {
    server: 'bluemountaintravel.database.windows.net',
    database: 'TravelDB',
    user: 'dbadmin',
    password: 'P@ssw0rd123!',
    // ...
};
```

## Environment Variables

For production (though this is a training app), set:

```bash
export DB_SERVER=bluemountaintravel.database.windows.net
export DB_NAME=TravelDB
export DB_USER=dbadmin
export DB_PASSWORD='P@ssw0rd123!'
```

## Testing Connection

```bash
# Start the backend server
npm start

# Check health endpoint
curl http://localhost:3000/api/health

# Should return:
# {
#   "status": "running",
#   "database": "connected",
#   "timestamp": "..."
# }
```

## Vulnerable Endpoints

The following API endpoints are intentionally vulnerable:

- `POST /api/execute` - Execute arbitrary SQL queries
- `GET /api/config` - Exposes database credentials
- `GET /api/users?email=x&password=y` - SQL injection vulnerability
- `GET /api/flights?from=x&to=y` - SQL injection vulnerability

Use these for security training and penetration testing exercises.
