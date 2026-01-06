# Azure Resources and Data Mapping

## Overview

This document provides a comprehensive mapping of all Azure resources used in the Blue Mountain Travel application and details what data is stored in each resource. This is essential for understanding the attack surface, data flow, and privacy implications of the application.

---

## Table of Contents

1. [Azure Storage Account](#1-azure-storage-account)
2. [Azure SQL Database](#2-azure-sql-database)
3. [Azure Cosmos DB](#3-azure-cosmos-db)
4. [Azure Key Vault](#4-azure-key-vault)
5. [Azure Static Web Apps](#5-azure-static-web-apps)
6. [Azure Entra ID (Azure Active Directory)](#6-azure-entra-id-azure-active-directory)
7. [Service Principals and Managed Identities](#7-service-principals-and-managed-identities)
8. [Data Flow Diagram](#8-data-flow-diagram)
9. [Data Classification](#9-data-classification)
10. [Privacy and Compliance](#10-privacy-and-compliance)

---

## 1. Azure Storage Account

### Resource Details
- **Account Name**: `bluemountaintravel`
- **Endpoint**: `https://bluemountaintravel.blob.core.windows.net`
- **Region**: East US (typical deployment)
- **SKU**: Standard_LRS (Locally Redundant Storage)
- **Public Access**: ⚠️ ENABLED (Intentional Vulnerability)
- **Access Tier**: Hot

### Storage Containers

#### 1.1 Container: `bookings`
**Purpose**: Store travel booking confirmations and itineraries

**Public Access**: ⚠️ Blob (Anonymous read access)

**Data Stored**:
- Booking confirmation PDFs
- Itinerary documents
- E-ticket files
- Travel insurance documents
- Booking receipts

**Data Fields in Files**:
- Booking ID (e.g., BK1704096000000, HB1704096000001)
- User information (name, email, phone)
- Travel dates and destinations
- Flight/hotel details
- Payment information (partially redacted)
- Booking timestamps
- Total amounts paid
- Confirmation codes

**File Naming Convention**:
- `booking-{booking_id}.pdf`
- `itinerary-{user_id}-{timestamp}.pdf`
- `receipt-{booking_id}.json`

**Sample Files**:
```
bookings/
├── booking-BK1704096000000.pdf
├── booking-BK1704096000001.pdf
├── itinerary-USR001-20240115.pdf
├── receipt-BK1704096000000.json
└── ...
```

**Access Method**:
- Public URL: `https://bluemountaintravel.blob.core.windows.net/bookings/{filename}`
- With SAS token: `{url}?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-12-31...`

**Sensitive Data Level**: HIGH
- PII (names, email, phone numbers)
- Travel plans (security risk)
- Payment information

---

#### 1.2 Container: `profiles`
**Purpose**: Store user profile information and documents

**Public Access**: ⚠️ Blob (Anonymous read access)

**Data Stored**:
- User profile JSON files
- Profile pictures
- Identity verification documents
- Travel preference settings
- Loyalty program data
- Contact information

**Data Fields in Files**:
- User ID (USR001, USR002, etc.)
- Full name
- Email address
- Phone number
- Date of birth
- Home address (street, city, state, zip)
- Emergency contacts
- Passport number
- Credit card information (⚠️ stored in plain text)
- SSN (⚠️ stored in plain text)
- Security question answers
- Membership tier (Gold, Platinum, Diamond, Admin)
- Travel preferences
- Frequent flyer numbers
- Hotel loyalty numbers

**File Naming Convention**:
- `profile-{user_id}.json`
- `avatar-{user_id}.jpg`
- `verification-{user_id}-{document_type}.pdf`

**Sample Files**:
```
profiles/
├── profile-USR001.json
├── profile-USR002.json
├── avatar-USR001.jpg
├── verification-USR001-passport.pdf
└── ...
```

**JSON Structure Example**:
```json
{
  "userId": "USR001",
  "email": "john.smith@company.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1-555-0123",
  "dateOfBirth": "1985-06-15",
  "address": {
    "street": "123 Business Ave",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "creditCard": {
    "number": "4532-1234-5678-9012",
    "expiry": "12/25",
    "cvv": "123"
  },
  "ssn": "123-45-6789",
  "membershipTier": "Platinum"
}
```

**Access Method**:
- Public URL: `https://bluemountaintravel.blob.core.windows.net/profiles/{filename}`
- Accessible via SAS token

**Sensitive Data Level**: CRITICAL
- Full PII
- Financial information (credit cards)
- Government IDs (SSN)
- Authentication credentials (passwords in plain text)

---

#### 1.3 Container: `documents`
**Purpose**: Store configuration files, credentials, and system documents

**Public Access**: ⚠️ Blob (Anonymous read access)

**Data Stored**:
- Azure configuration files
- Service principal credentials
- API keys and secrets
- Database connection strings
- System documentation
- Backup configurations
- Integration credentials

**Files and Contents**:

**`azure-credentials.txt`**:
```
Azure Subscription: 12345678-1234-1234-1234-123456789012
Tenant ID: 87654321-4321-4321-4321-210987654321
Admin Username: admin@bluemountain.onmicrosoft.com
Admin Password: AzureAdmin2024!@#
```

**`app-registrations.json`** (see dedicated section below):
- Service principal credentials
- Client secrets
- Application IDs
- Role assignments
- Azure CLI login commands

**`database-config.json`**:
```json
{
  "server": "bluemountaintravel.database.windows.net",
  "database": "TravelDB",
  "username": "admin",
  "password": "P@ssw0rd123!",
  "port": 1433
}
```

**`api-keys.json`**:
```json
{
  "primary": "fake-api-key-12345",
  "secondary": "fake-api-key-67890",
  "sendgrid": "SG.fake-key-abc123",
  "stripe": "sk_test_fake123"
}
```

**File List**:
```
documents/
├── azure-credentials.txt
├── app-registrations.json
├── database-config.json
├── api-keys.json
├── backup-config.json
├── system-documentation.pdf
└── ...
```

**Access Method**:
- Direct public URLs
- Listed via SAS token with list permissions

**Sensitive Data Level**: CRITICAL
- Complete system credentials
- Azure subscription access
- Database passwords
- API keys for all services

---

#### 1.4 Container: `passports`
**Purpose**: Store employee passport scans and photos

**Public Access**: ⚠️ Blob (Anonymous read access)

**Data Stored**:
- Passport document scans (PDF)
- Passport photo pages (high-resolution JPEG)
- Identity verification documents

**Passport Records**:

| Employee | Passport Number | Country | Issue Date | Expiry Date | Files |
|----------|----------------|---------|------------|-------------|-------|
| John Smith | US123456789 | USA | 2020-01-15 | 2030-01-15 | PDF, JPG |
| Sarah Johnson | US234567890 | USA | 2019-03-20 | 2029-03-20 | PDF, JPG |
| Michael Chen | CN567890123 | China | 2021-05-10 | 2031-05-10 | PDF, JPG |
| Emma Williams | GB789012345 | UK | 2020-08-12 | 2030-08-12 | PDF, JPG |
| David Martinez | MX890123456 | Mexico | 2021-02-28 | 2031-02-28 | PDF, JPG |
| Admin User | US000000001 | USA (Diplomatic) | 2022-01-01 | 2032-01-01 | PDF, JPG |

**Data in Passport Documents**:
- Full legal name
- Date of birth
- Place of birth
- Passport number
- Issue date and expiry date
- Nationality
- Photo
- Signature
- Machine-readable zone (MRZ)
- Entry/exit stamps (for some passports)

**File Naming Convention**:
- `passport-{employee_name}-scan.pdf`
- `passport-{employee_name}-photo.jpg`

**Sample Files**:
```
passports/
├── passport-john-smith-scan.pdf
├── passport-john-smith-photo.jpg
├── passport-sarah-johnson-scan.pdf
├── passport-sarah-johnson-photo.jpg
├── passport-admin-diplomatic-scan.pdf
├── passport-admin-diplomatic-photo.jpg
└── ...
```

**Access Method**:
- Public URLs with SAS token
- Bulk download available via Azure CLI
- Accessible via `/passport-viewer.html` page

**Sensitive Data Level**: CRITICAL
- Government-issued identity documents
- Full identity information
- Biometric data (photos)
- International travel documents

---

### Storage Account Access Credentials

**SAS Token** (Shared Access Signature):
```
?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=FakeSignatureForDemo123456789==
```

**Permissions**: rwdlacupiytfx
- r: Read
- w: Write
- d: Delete
- l: List
- a: Add
- c: Create
- u: Update
- p: Process
- i: Immutable storage
- t: Tags
- f: Filter
- x: Execute

**Expiry**: December 31, 2025 (⚠️ Long-lived token)

**Connection String**:
```
DefaultEndpointsProtocol=https;AccountName=bluemountaintravel;AccountKey=FAKE_KEY_FOR_DEMO_abc123XYZ==;EndpointSuffix=core.windows.net
```

**Access Keys**:
- Key1: `FAKE_KEY_FOR_DEMO_abc123XYZ==`
- Key2: `FAKE_KEY_FOR_DEMO_def456ABC==`

---

## 2. Azure SQL Database

### Resource Details
- **Server Name**: `bluemountaintravel.database.windows.net`
- **Database Name**: `TravelDB`
- **Region**: East US
- **Pricing Tier**: Basic (5 DTUs)
- **Max Size**: 2 GB
- **Firewall**: ⚠️ Allow all IPs (0.0.0.0 - 255.255.255.255)

### Connection Details
**Connection String**:
```
Server=tcp:bluemountaintravel.database.windows.net,1433;Initial Catalog=TravelDB;Persist Security Info=False;User ID=admin;Password=P@ssw0rd123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

**Credentials**:
- Username: `admin` (⚠️ default admin account)
- Password: `P@ssw0rd123!` (⚠️ weak password)

### Database Schema

#### 2.1 Table: `Users`
**Purpose**: Store user account information

**Columns**:
- `UserID` (varchar(10), PK) - e.g., USR001
- `Email` (varchar(255), unique)
- `PasswordHash` (⚠️ Actually stores plain text)
- `FirstName` (varchar(50))
- `LastName` (varchar(50))
- `Phone` (varchar(20))
- `DateOfBirth` (date)
- `Address` (varchar(500))
- `City` (varchar(100))
- `State` (varchar(50))
- `ZipCode` (varchar(20))
- `Country` (varchar(50))
- `MembershipTier` (varchar(20)) - Gold, Platinum, Diamond, Admin
- `CreatedDate` (datetime)
- `LastLoginDate` (datetime)
- `IsActive` (bit)

**Sample Data**:
```sql
UserID | Email                          | Password      | FirstName | MembershipTier
-------|--------------------------------|---------------|-----------|---------------
USR001 | john.smith@company.com         | password123   | John      | Platinum
USR002 | sarah.johnson@enterprise.com   | Sarah@2024    | Sarah     | Gold
USR003 | michael.chen@startups.io       | Chen#2024     | Michael   | Diamond
USR004 | admin@bluemountaintravel.com   | Admin@...2024!| Admin     | Admin
```

**Row Count**: ~50 users

---

#### 2.2 Table: `UserPaymentInfo`
**Purpose**: Store payment methods (⚠️ unencrypted)

**Columns**:
- `PaymentID` (int, PK, identity)
- `UserID` (varchar(10), FK to Users)
- `CardType` (varchar(20)) - Visa, MasterCard, Amex
- `CardNumber` (⚠️ varchar(20), unencrypted)
- `CardHolderName` (varchar(100))
- `ExpiryMonth` (int)
- `ExpiryYear` (int)
- `CVV` (⚠️ varchar(4), stored!)
- `BillingAddress` (varchar(500))
- `IsDefault` (bit)
- `AddedDate` (datetime)

**Sensitive Data**: Credit card numbers, CVV codes in plain text

---

#### 2.3 Table: `Flights`
**Purpose**: Available flight inventory

**Columns**:
- `FlightID` (varchar(10), PK) - FL001, FL002, etc.
- `Airline` (varchar(100))
- `FlightNumber` (varchar(20))
- `DepartureAirport` (varchar(10)) - IATA code
- `ArrivalAirport` (varchar(10))
- `DepartureTime` (time)
- `ArrivalTime` (time)
- `Duration` (varchar(20))
- `Class` (varchar(20)) - Business, First
- `Price` (decimal(10,2))
- `Currency` (varchar(3)) - USD
- `AvailableSeats` (int)
- `Status` (varchar(20))

**Row Count**: ~50 flights

---

#### 2.4 Table: `Hotels`
**Purpose**: Available hotel inventory

**Columns**:
- `HotelID` (varchar(10), PK) - HT001, HT002, etc.
- `Name` (varchar(200))
- `Location` (varchar(100))
- `Address` (varchar(500))
- `City` (varchar(100))
- `Country` (varchar(50))
- `Rating` (decimal(2,1)) - 4.5, 5.0
- `PricePerNight` (decimal(10,2))
- `Currency` (varchar(3))
- `Description` (text)
- `Amenities` (text) - JSON array
- `ImageURL` (varchar(500))
- `AvailableRooms` (int)

**Row Count**: ~50 hotels

---

#### 2.5 Table: `Bookings`
**Purpose**: Travel booking records

**Columns**:
- `BookingID` (varchar(20), PK) - BK{timestamp} or HB{timestamp}
- `UserID` (varchar(10), FK to Users)
- `BookingType` (varchar(20)) - Flight, Hotel
- `FlightID` (varchar(10), FK, nullable)
- `HotelID` (varchar(10), FK, nullable)
- `BookingDate` (datetime)
- `TravelDate` (date)
- `ReturnDate` (date, nullable)
- `NumberOfGuests` (int)
- `TotalAmount` (decimal(10,2))
- `Currency` (varchar(3))
- `Status` (varchar(20)) - Confirmed, Cancelled, Pending
- `PaymentID` (int, FK)
- `ConfirmationCode` (varchar(20))
- `SpecialRequests` (text)
- `BlobStorageURL` (varchar(500)) - Link to booking document in blob storage

**Row Count**: ~500+ bookings

**Data Links**:
- `BlobStorageURL` contains links to booking PDFs in the `bookings` container
- Creates data flow between SQL and Blob Storage

---

#### 2.6 Table: `Employees`
**Purpose**: Employee directory with PII

**Columns**:
- `EmployeeID` (varchar(10), PK) - EMP001
- `FirstName` (varchar(50))
- `LastName` (varchar(50))
- `Email` (varchar(255))
- `PersonalEmail` (varchar(255))
- `Phone` (varchar(20))
- `DateOfBirth` (date)
- `SSN` (⚠️ varchar(11), unencrypted) - 123-45-6789
- `Address` (varchar(500))
- `City` (varchar(100))
- `State` (varchar(50))
- `ZipCode` (varchar(20))
- `Department` (varchar(100))
- `JobTitle` (varchar(100))
- `HireDate` (date)
- `Salary` (⚠️ decimal(10,2), unencrypted)
- `Manager` (varchar(10), FK)
- `ADUsername` (varchar(100)) - Active Directory username
- `AzureUsername` (varchar(255)) - Azure/Entra ID UPN
- `SecurityQuestion` (varchar(500))
- `SecurityAnswer` (⚠️ varchar(500), plain text)
- `HasVPNAccess` (bit)
- `AccessLevel` (varchar(20)) - Standard, Privileged, Admin
- `PassportNumber` (varchar(20))
- `PassportBlobURL` (varchar(500)) - Link to passport in blob storage

**Row Count**: ~100 employees

**Highly Sensitive Data**:
- SSN (Social Security Numbers)
- Salaries
- Security question answers
- Passport numbers
- Links to passport documents

---

#### 2.7 Table: `AuditLog`
**Purpose**: System audit trail (⚠️ minimal logging)

**Columns**:
- `LogID` (int, PK, identity)
- `Timestamp` (datetime)
- `UserID` (varchar(10))
- `Action` (varchar(100))
- `Resource` (varchar(500))
- `IPAddress` (varchar(45))
- `UserAgent` (varchar(500))
- `Status` (varchar(20))

**Note**: ⚠️ Insufficient logging for security events

---

### Database Users and Permissions

**Admin Account**:
- Login: `admin`
- Password: `P@ssw0rd123!`
- Permissions: db_owner (full control)
- ⚠️ Used for all connections

**Service Principal Account**:
- Login: Uses Azure AD authentication
- AppID: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- Role: SQL DB Contributor

---

## 3. Azure Cosmos DB

### Resource Details
- **Account Name**: `bluemountaintravel`
- **API**: Core (SQL)
- **Endpoint**: `https://bluemountaintravel.documents.azure.com:443/`
- **Region**: East US
- **Consistency**: Session

### Connection Details
**Endpoint**: `https://bluemountaintravel.documents.azure.com:443/`
**Primary Key**: `FAKE_COSMOS_KEY_abc123XYZ789==`

### Database: `TravelBookings`

#### Collection: `bookings`
**Purpose**: Real-time booking data and session information

**Partition Key**: `/userId`

**Document Structure**:
```json
{
  "id": "BK1704096000000",
  "userId": "USR001",
  "bookingType": "flight",
  "flightId": "FL001",
  "bookingDate": "2024-01-15T10:30:00Z",
  "travelDate": "2024-02-01",
  "status": "confirmed",
  "amount": 1250.00,
  "currency": "USD",
  "passengerInfo": {
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@company.com",
    "phone": "+1-555-0123",
    "passportNumber": "US123456789"
  },
  "payment": {
    "cardLastFour": "9012",
    "paymentMethod": "Visa",
    "transactionId": "TXN123456"
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.100"
  },
  "_ts": 1704096000
}
```

**Data Stored**:
- Real-time booking information
- User session data
- Payment transaction records
- Search history
- User preferences

**Document Count**: ~1000+ documents

---

## 4. Azure Key Vault

### Resource Details
- **Vault Name**: `bluemountain-kv`
- **Vault URI**: `https://bluemountain-kv.vault.azure.net/`
- **Region**: East US
- **Pricing Tier**: Standard

### Access Policies
**Service Principal Access**:
- AppID: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- Permissions: Get, List secrets
- ⚠️ Can retrieve all secrets

**Managed Identity Access**:
- Identity: `bluemountain-webapp-identity`
- Permissions: Get secrets (specific secrets only)

### Secrets Stored

#### 4.1 Secret: `DatabasePassword`
- **Value**: `P@ssw0rd123!`
- **Content Type**: SQL password
- **Purpose**: Azure SQL Database admin password
- **Enabled**: Yes
- **Expiration**: None (⚠️ no rotation policy)

#### 4.2 Secret: `StorageAccountKey`
- **Value**: `FAKE_KEY_FOR_DEMO_abc123XYZ==`
- **Content Type**: Storage account key
- **Purpose**: Primary access key for storage account
- **Enabled**: Yes
- **Note**: ⚠️ Provides full storage account access

#### 4.3 Secret: `CosmosDBKey`
- **Value**: `FAKE_COSMOS_KEY_abc123XYZ789==`
- **Content Type**: Cosmos DB primary key
- **Purpose**: Full access to Cosmos DB account
- **Enabled**: Yes

#### 4.4 Secret: `ApiKey`
- **Value**: `fake-api-key-12345`
- **Content Type**: API authentication key
- **Purpose**: External API authentication
- **Enabled**: Yes
- **Note**: ⚠️ Also stored in plain text config files

#### 4.5 Secret: `ServicePrincipalSecret`
- **Value**: `SuperSecret123!@#$%`
- **Content Type**: Service principal client secret
- **Purpose**: Application authentication
- **Enabled**: Yes
- **Note**: ⚠️ Also exposed in public files

#### 4.6 Secret: `EntraAdminPassword`
- **Value**: `AzureAdmin2024!@#`
- **Content Type**: Entra ID admin password
- **Purpose**: Global administrator account
- **Enabled**: Yes
- **Severity**: ⚠️ CRITICAL - full tenant access

### Key Vault Data Classification
- All secrets are CRITICAL sensitivity
- Contains credentials for all Azure resources
- Compromise = complete infrastructure access

---

## 5. Azure Static Web Apps

### Resource Details
- **App Name**: `bluemountain-travel`
- **Region**: East US 2
- **URL**: `https://bluemountain-travel.azurestaticapps.net`
- **Pricing Tier**: Free
- **Source**: GitHub repository

### Deployed Content
- All HTML, CSS, JavaScript files from `/public` directory
- Configuration files (⚠️ including sensitive config)
- Client-side code with embedded credentials

### Configuration Files Exposed
Located at `/public` and accessible via web:
- `/config.json` - App configuration
- `/app-registrations.json` - Service principal credentials
- All JavaScript files with hardcoded credentials

### Data Accessible via Static Web App
- All client-side code
- Sample user data in JavaScript
- Hardcoded credentials
- SAS tokens
- API endpoints

---

## 6. Azure Entra ID (Azure Active Directory)

### Tenant Details
- **Tenant ID**: `87654321-4321-4321-4321-210987654321`
- **Tenant Name**: `bluemountain.onmicrosoft.com`
- **Primary Domain**: `bluemountain.onmicrosoft.com`

### Users

#### 6.1 Global Administrator
- **UPN**: `admin@bluemountain.onmicrosoft.com`
- **Password**: `AzureAdmin2024!@#` (⚠️ exposed)
- **Roles**: Global Administrator, Security Administrator
- **MFA**: ⚠️ Disabled
- **Risk Level**: CRITICAL

#### 6.2 Regular Users
Sample users in Entra ID:
- `john.smith@bluemountain.onmicrosoft.com`
- `sarah.johnson@bluemountain.onmicrosoft.com`
- `michael.chen@bluemountain.onmicrosoft.com`
- And ~100 more employees

### Groups
- **All Employees** - Contains all users
- **IT Administrators** - Privileged access
- **VPN Users** - Remote access
- **Security Team** - Security tools access

### Conditional Access Policies
⚠️ **None configured** - Major vulnerability

---

## 7. Service Principals and Managed Identities

### 7.1 Service Principal: BlueMountainTravel-WebApp
- **Application ID**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- **Object ID**: `12345678-abcd-ef12-3456-789012345678`
- **Display Name**: Blue Mountain Travel Web Application
- **Client Secret**: `SuperSecret123!@#$%`
- **Secret Expiration**: 2025-12-31

**Role Assignments**:
- **Subscription**: Contributor (⚠️ overly permissive)
- **Resource Group**: Owner
- **Key Vault**: Get/List secrets

**Microsoft Graph Permissions**:
- User.Read.All
- Group.Read.All
- Directory.Read.All
- Application.Read.All

**Data Accessible**:
- All Azure resources in subscription
- All Entra ID user data
- All secrets in Key Vault
- Full management capabilities

---

### 7.2 Service Principal: BlueMountainTravel-BackupService
- **Application ID**: `b2c3d4e5-f6a7-8901-bcde-f23456789012`
- **Client Secret**: `BackupSecret2024!@#`

**Role Assignments**:
- **Storage Account**: Storage Blob Data Owner

**Data Accessible**:
- Full read/write/delete access to all blob containers
- Can download all data
- Can delete data

---

### 7.3 Service Principal: BlueMountainTravel-DataSync
- **Application ID**: `c3d4e5f6-a7b8-9012-cdef-345678901234`
- **Client Secret**: `DataSync2024Pass!@#`

**Role Assignments**:
- **SQL Server**: SQL DB Contributor

**Data Accessible**:
- Full database access
- Can read all tables
- Can modify schema
- Can export data

---

### 7.4 Managed Identity: bluemountain-webapp-identity
- **Type**: System-assigned
- **Principal ID**: `d4e5f6a7-b8c9-0123-def0-456789012345`
- **Client ID**: `e5f6a7b8-c9d0-1234-ef01-567890123456`

**Role Assignments**:
- **Subscription**: Reader
- **Key Vault**: Key Vault Secrets User (specific secrets)

**Intended Use**: Web app to access Key Vault secrets

---

## 8. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Internet Users                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Azure Static Web App (Public)                       │
│  - HTML/CSS/JavaScript files                                    │
│  - Hardcoded credentials in JS                                  │
│  - SAS tokens exposed                                           │
└────────┬────────────────────┬──────────────────────┬────────────┘
         │                    │                      │
         ▼                    ▼                      ▼
┌────────────────┐   ┌────────────────┐   ┌─────────────────┐
│ Azure Storage  │   │ Azure SQL DB   │   │ Azure Cosmos DB │
│  - bookings    │   │  - Users       │   │  - bookings     │
│  - profiles    │   │  - Bookings    │   │                 │
│  - documents   │   │  - Employees   │   │                 │
│  - passports   │   │  - Payments    │   │                 │
│                │   │                │   │                 │
│ ⚠️ PUBLIC!     │   │ ⚠️ Weak creds  │   │ ⚠️ Key exposed  │
└────────────────┘   └────────────────┘   └─────────────────┘
         │                    │                      │
         └────────────────────┴──────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Azure Key Vault │
                    │  - All secrets   │
                    │                  │
                    │ ⚠️ SP can access │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Entra ID       │
                    │  - Users         │
                    │  - Groups        │
                    │  - App Registrations│
                    │                  │
                    │ ⚠️ Admin exposed │
                    └──────────────────┘
```

### Data Flow Paths

**User Registration Flow**:
1. User fills form on Static Web App
2. Data stored in browser localStorage (⚠️ including password)
3. Data sent to Azure SQL Database Users table (⚠️ plain text password)
4. Profile JSON created in Storage Account profiles container (⚠️ public access)

**Booking Flow**:
1. User selects flight/hotel
2. Booking created in SQL Database Bookings table
3. Confirmation document created in Storage Account bookings container
4. Real-time booking record added to Cosmos DB
5. Links between SQL and Storage via BlobStorageURL field

**Passport Access Flow**:
1. User navigates to passport viewer (no auth required!)
2. JavaScript loads passport list from passport-db.js
3. Passport images/PDFs loaded from Storage Account passports container (public!)
4. SAS token allows direct download

**Admin Access Flow**:
1. User navigates to admin.html (no auth check!)
2. Admin panel displays all credentials from admin.js
3. Credentials logged to browser console
4. Functions available to export all data

---

## 9. Data Classification

### Critical Data (Requires Highest Protection)
**In Storage Account**:
- Credit card numbers (profiles container)
- SSN (profiles container)
- Passwords in plain text (profiles container)
- Passport documents (passports container)
- Service principal secrets (documents container)

**In SQL Database**:
- Users.PasswordHash (actually plain text!)
- UserPaymentInfo.CardNumber (unencrypted)
- UserPaymentInfo.CVV (stored!)
- Employees.SSN (unencrypted)
- Employees.Salary
- Employees.SecurityAnswer

**In Key Vault**:
- All secrets (DatabasePassword, StorageAccountKey, etc.)

**In Entra ID**:
- Global admin credentials
- Service principal secrets

---

### High Sensitivity Data
**In Storage Account**:
- User addresses (profiles container)
- Phone numbers
- Email addresses
- Booking details
- Travel itineraries

**In SQL Database**:
- Users table (all PII)
- Employees table (all PII except SSN)
- Bookings (travel plans)

**In Cosmos DB**:
- Real-time booking data
- User session information

---

### Medium Sensitivity Data
- Flight information (pricing, availability)
- Hotel information (pricing, availability)
- System configuration (non-credential)
- Audit logs

---

### Public Data (But still exposed inappropriately)
- Flight listings
- Hotel listings
- Company information
- Marketing content

---

## 10. Privacy and Compliance

### Regulatory Concerns

#### GDPR Violations
1. **Article 5 (Data Minimization)**: Excessive data collection and storage
2. **Article 25 (Privacy by Design)**: No security controls implemented
3. **Article 32 (Security)**: No encryption, weak access controls
4. **Article 33 (Breach Notification)**: No breach detection capabilities
5. **Article 35 (DPIA)**: High-risk processing without assessment

**Data Subject Rights Not Implemented**:
- Right to access (no secure portal)
- Right to erasure (no deletion capability)
- Right to portability (insecure export)
- Right to rectification (no secure update)

---

#### PCI DSS Violations
**Requirement 3 (Protect Stored Cardholder Data)**:
- ❌ Card numbers stored in plain text
- ❌ CVV stored (prohibited!)
- ❌ No encryption at rest
- ❌ No encryption in transit

**Requirement 6 (Secure Systems)**:
- ❌ Known vulnerabilities not remediated
- ❌ No security testing

**Requirement 8 (Identify and Authenticate)**:
- ❌ Weak passwords
- ❌ No MFA
- ❌ Shared credentials

---

#### HIPAA (If Health Data Present)
- ❌ No encryption
- ❌ No access controls
- ❌ No audit logs
- ❌ No business associate agreements

---

#### SOC 2 Trust Service Criteria
**Security**:
- ❌ Unauthorized access possible
- ❌ No security monitoring

**Confidentiality**:
- ❌ Public blob storage
- ❌ Exposed credentials

**Privacy**:
- ❌ No privacy controls
- ❌ Excessive data collection

---

### Data Residency
- **Primary Region**: East US
- **No geographic restrictions**: Data not confined to specific jurisdictions
- **Compliance Issue**: May violate data localization laws in some countries

---

### Data Retention
**Current State**: ⚠️ No retention policy
- Data kept indefinitely
- No automated deletion
- No archival process

**Compliance Issue**: Violates GDPR Article 5(e) - storage limitation principle

---

### Audit and Monitoring
**Current State**: ⚠️ Minimal logging
- Basic audit log table in SQL
- No Azure Monitor integration
- No alert rules
- No security event logging

**Missing Capabilities**:
- Who accessed what data
- When data was downloaded
- Failed access attempts
- Anomalous behavior detection

---

## Summary Table: Data Locations

| Data Type | Primary Location | Sensitivity | Public Access | Encrypted |
|-----------|-----------------|-------------|---------------|-----------|
| User Passwords | SQL, localStorage, Blob | CRITICAL | ✅ Yes | ❌ No |
| Credit Cards | SQL, Blob | CRITICAL | ✅ Yes | ❌ No |
| SSN | SQL, Blob | CRITICAL | ✅ Yes | ❌ No |
| Passport Documents | Blob (passports) | CRITICAL | ✅ Yes | ❌ No |
| Employee PII | SQL (Employees) | CRITICAL | ⚠️ Via SQL | ❌ No |
| Booking Data | SQL, Cosmos, Blob | HIGH | ⚠️ Via Blob | ❌ No |
| User Profiles | SQL, Blob | HIGH | ✅ Yes | ❌ No |
| Service Credentials | Blob, Key Vault, JS | CRITICAL | ✅ Yes | ❌ No |
| API Keys | Blob, JS, Config | HIGH | ✅ Yes | ❌ No |
| Azure Credentials | Blob, JS | CRITICAL | ✅ Yes | ❌ No |

---

## Recommended Actions

### Immediate (Critical)
1. **Disable public blob access** on all containers
2. **Remove all hardcoded credentials** from code
3. **Rotate all secrets and keys**
4. **Delete exposed configuration files** from public storage
5. **Enable Azure AD authentication** for all resources

### Short-term (High Priority)
6. **Implement encryption at rest** for all data
7. **Use Managed Identities** instead of service principals where possible
8. **Enable Azure Monitor** and security logging
9. **Implement proper RBAC** with least privilege
10. **Add MFA** for all administrative accounts

### Medium-term (Ongoing)
11. **Data classification and tagging**
12. **Implement data retention policies**
13. **Regular security assessments**
14. **Compliance gap analysis**
15. **Security awareness training**

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Status**: Complete Azure Resources and Data Mapping
