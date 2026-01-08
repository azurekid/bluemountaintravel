# Profile Page Database Migration - Implementation Summary

## Overview
Migrated the profile page from a localStorage-based multi-profile system to a database-driven single-user profile system with passport information integration.

## Date: January 7, 2026

---

## 1. Database Changes

### A. Added Passports Table (database/schema.sql)
Created new `Passports` table with the following columns:
- `PassportID` (VARCHAR(20), PRIMARY KEY)
- `UserID` (VARCHAR(20), FOREIGN KEY → Users.UserID)
- `PassportNumber` (VARCHAR(20), UNIQUE, NOT NULL)
- `IssuingCountry` (VARCHAR(50))
- `Nationality` (VARCHAR(50))
- `Surname` (NVARCHAR(100))
- `GivenNames` (NVARCHAR(100))
- `Sex` (CHAR(1))
- `DateOfBirth` (DATE)
- `PlaceOfBirth` (NVARCHAR(100))
- `DateOfIssue` (DATE)
- `DateOfExpiry` (DATE)
- `IssuingAuthority` (NVARCHAR(100))
- `PlaceOfIssue` (NVARCHAR(100))
- `BlobStorageURL` (NVARCHAR(500))
- `PhotoURL` (NVARCHAR(500))
- `CreatedDate` (DATETIME, DEFAULT GETDATE())

### B. Added Passport Seed Data (database/seed-data.sql)
Inserted 10 passport records (PASS001 - PASS010) for users USR001-USR010:
- Realistic US passport numbers (US123456789 - US012345678)
- Full names matching user records
- Issue dates: 2020-2022
- Expiry dates: 2030-2032 (10-year validity)
- Blob storage URLs in passports container

**Next Step**: Deploy these SQL changes to Azure SQL Database:
```powershell
# Connect to Azure SQL and run:
# 1. Execute database/schema.sql (Passports table creation)
# 2. Execute database/seed-data.sql (INSERT passport records)
```

---

## 2. Backend API Changes

### Created Profile API Endpoint (api/profile/)

#### api/profile/function.json
- HTTP Trigger: GET method
- Route: `profile`
- Anonymous authentication
- Returns single user profile with passport data

#### api/profile/index.js
- Accepts `?email=` query parameter
- Connects to Azure SQL using environment variables:
  - SQL_SERVER
  - SQL_DB
  - SQL_USER
  - SQL_PASSWORD
- SQL Query: `LEFT JOIN Passports ON UserID`
- Returns JSON object with nested passport data:
```json
{
  "userId": "USR001",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@techcorp.com",
  "phone": "+1-555-0123",
  "company": "Tech Corp",
  "membershipTier": "Platinum",
  "passport": {
    "passportNumber": "US123456789",
    "nationality": "United States",
    "dateOfBirth": "1985-03-15",
    "dateOfIssue": "2020-05-10",
    "dateOfExpiry": "2030-05-10",
    ...
  }
}
```

**Next Step**: Deploy Function App code to Azure:
```powershell
# Option 1: VS Code Azure Functions Extension
# Right-click on 'api' folder → Deploy to Function App

# Option 2: Azure Functions Core Tools
func azure functionapp publish bluemountaintravel-func
```

---

## 3. Frontend Changes

### A. Cleaned profile.js (public/js/profile.js)
**Reduced from 728 lines to 325 lines** (-403 lines, -55%)

#### Removed Functions (Old Multi-Profile System):
- ❌ `initializeUserProfiles()` - localStorage multi-profile setup
- ❌ `generateDefaultProfiles()` - Sample profile generation
- ❌ `getAllProfiles()` - Fetch all profiles from localStorage
- ❌ `loadProfilesList()` - Display profile grid
- ❌ `selectProfile()` - Switch active profile
- ❌ `switchProfile()` - Dropdown profile switcher
- ❌ `showCreateProfileModal()` - Show create profile form
- ❌ `hideCreateProfileModal()` - Hide modal
- ❌ `deleteCurrentProfile()` - Delete profile feature
- ❌ `setupCreateProfileForm()` - Form submission handler
- ❌ `updateUserProfile()` - Update profile data
- ❌ `DOMContentLoaded` event for multi-profile initialization

#### New Functions (Database-Driven Single Profile):
- ✅ `loadProfileFromAPI(email)` - Fetch profile from `/api/profile`
- ✅ `displayProfile(profile)` - Render profile data
- ✅ `displayPassportInfo(passport)` - Render passport section
- ✅ `loadProfileFromLocalStorage()` - Fallback if API fails

#### Kept Functions (Vulnerability Demonstrations):
- ⚠️ `showRawUserData()` - Console logging vulnerability
- ⚠️ `showAzureConfig()` - Exposed Azure config
- ⚠️ `uploadProfilePicture()` - SAS token exposure
- ⚠️ `downloadUserData()` - Data export vulnerability

### B. Updated profile.html (public/profile.html)

#### Removed Elements:
- ❌ `<div id="profile-card">` - "Manage Profiles" section
- ❌ `<select id="profile-selector">` - Profile dropdown
- ❌ `<button onclick="switchProfile()">` - Switch button
- ❌ `<div id="profiles-list">` - Profile grid display
- ❌ `<button onclick="showCreateProfileModal()">` - Create profile button
- ❌ `<button onclick="deleteCurrentProfile()">` - Delete profile button
- ❌ `<div id="create-profile-modal">` - Create profile modal (entire form with 30+ lines)

#### Result:
- Clean single-user profile display
- Profile loads directly from database API
- No profile switching UI
- Current user's data only

---

## 4. File Structure Summary

### Modified Files:
```
database/
  ├── schema.sql              # Added Passports table
  └── seed-data.sql           # Added 10 passport records

api/
  └── profile/
      ├── function.json       # NEW: GET /api/profile endpoint
      └── index.js            # NEW: Profile endpoint with passport JOIN

public/
  ├── profile.html            # CLEANED: Removed multi-profile UI (-70 lines)
  └── js/
      └── profile.js          # CLEANED: Removed multi-profile code (-403 lines)
```

### Backup Files Created:
```
public/js/profile.js.backup   # Original 728-line version
```

---

## 5. Testing Checklist

### Before Testing:
- [ ] Deploy database changes (schema.sql + seed-data.sql)
- [ ] Deploy Function App code (api/profile endpoint)
- [ ] Verify SQL firewall allows Azure services
- [ ] Verify Function App environment variables set:
  - SQL_SERVER
  - SQL_DB
  - SQL_USER
  - SQL_PASSWORD

### Test Scenarios:
1. **Login and Profile Load**
  - [ ] Login as john.smith@techcorp.com (Password: TechCorp@2026)
   - [ ] Navigate to profile page
   - [ ] Verify profile loads from API (not localStorage)
   - [ ] Check browser console shows "Profile loaded from API"

2. **Passport Display**
   - [ ] Verify passport section appears on profile page
   - [ ] Check passport number: US123456789
   - [ ] Verify dates display correctly
   - [ ] Check "View Passport Document" link works

3. **Multiple Users**
   - [ ] Test with sarah.johnson@globalind.com
  - [ ] Test with michael.chen@innovlab.io
   - [ ] Verify each user sees their own passport data

4. **Error Handling**
   - [ ] Test with user without passport (ADMIN001)
   - [ ] Verify page loads without passport section
   - [ ] Test API error (disconnect network)
   - [ ] Verify fallback to localStorage works

5. **UI Verification**
   - [ ] Confirm no profile selector dropdown
   - [ ] Confirm no "Switch Profile" button
   - [ ] Confirm no "Create Profile" button
   - [ ] Confirm no profile grid display
   - [ ] Confirm no create profile modal

---

## 6. API Endpoint Documentation

### GET /api/profile
Returns user profile data with passport information.

**Endpoint**: `https://bluemountaintravel-func.azurewebsites.net/api/profile`

**Method**: `GET`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User's email address |

**Response Format** (200 OK):
```json
{
  "userId": "USR001",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@techcorp.com",
  "phone": "+1-555-0123",
  "company": "Tech Corp",
  "membershipTier": "Platinum",
  "passport": {
    "passportId": "PASS001",
    "passportNumber": "US123456789",
    "issuingCountry": "United States",
    "nationality": "United States",
    "surname": "SMITH",
    "givenNames": "JOHN MICHAEL",
    "sex": "M",
    "dateOfBirth": "1985-03-15T00:00:00.000Z",
    "placeOfBirth": "New York, USA",
    "dateOfIssue": "2020-05-10T00:00:00.000Z",
    "dateOfExpiry": "2030-05-10T00:00:00.000Z",
    "issuingAuthority": "U.S. Department of State",
    "placeOfIssue": "Washington, DC",
    "blobStorageUrl": "https://bluemountaintravel.blob.core.windows.net/passports/US123456789.jpg",
    "photoUrl": null
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing email parameter
- `404 Not Found`: User not found
- `500 Internal Server Error`: Database connection error

**Example Usage**:
```javascript
const response = await fetch(
  'https://bluemountaintravel-func.azurewebsites.net/api/profile?email=john.smith@techcorp.com'
);
const profile = await response.json();
console.log(profile);
```

---

## 7. Database Query Details

### SQL Query Used by Profile API:
```sql
SELECT 
    u.UserID,
    u.FirstName,
    u.LastName,
    u.Email,
    u.Phone,
    u.Company,
    u.MembershipTier,
    p.PassportID,
    p.PassportNumber,
    p.IssuingCountry,
    p.Nationality,
    p.Surname,
    p.GivenNames,
    p.Sex,
    p.DateOfBirth,
    p.PlaceOfBirth,
    p.DateOfIssue,
    p.DateOfExpiry,
    p.IssuingAuthority,
    p.PlaceOfIssue,
    p.BlobStorageURL,
    p.PhotoURL
FROM [dbo].[Users] u
LEFT JOIN [dbo].[Passports] p ON u.UserID = p.UserID
WHERE u.Email = @email 
  AND u.IsActive = 1
```

**Key Points**:
- Uses LEFT JOIN to handle users without passports
- Parameterized query prevents SQL injection
- Filters by IsActive = 1 (active users only)
- Returns NULL passport fields if no passport exists

---

## 8. Security Considerations

### Improvements:
✅ Single user profile (no unauthorized profile switching)
✅ API-driven data (not exposed in localStorage)
✅ Parameterized SQL queries (SQL injection prevention)
✅ Fallback to localStorage only on API failure

### Remaining Vulnerabilities (Intentional for CTF):
⚠️ Plain text passwords in database
⚠️ SAS tokens exposed in client code
⚠️ Azure config accessible via `window.AzureConfig`
⚠️ Console logging functions expose sensitive data
⚠️ Profile picture upload uses client-side SAS token

---

## 9. Next Steps

### Immediate (Required):
1. **Deploy Database Changes**
   ```sql
   -- Connect to Azure SQL Database
   -- Run: database/schema.sql
   -- Run: database/seed-data.sql
   ```

2. **Deploy Function App**
   ```powershell
   # Using Azure Functions Core Tools:
   cd /Users/rogier/GitHub/bluemountaintravel
   func azure functionapp publish bluemountaintravel-func
   ```

3. **Test Profile Page**
   - Login and verify profile loads from API
   - Check passport section displays correctly
   - Test with multiple users

### Future Enhancements:
- [ ] Add profile photo upload to passports container
- [ ] Create passport scan viewer page
- [ ] Add passport expiry notifications
- [ ] Implement profile editing (via API, not localStorage)
- [ ] Add audit logging for profile views

---

## 10. Code Metrics

### Before:
- profile.js: **728 lines**
- profile.html: **277 lines**
- Total multi-profile code: ~1000 lines

### After:
- profile.js: **325 lines** (-403 lines, -55%)
- profile.html: **207 lines** (-70 lines, -25%)
- New API code: **117 lines** (api/profile/index.js)

### Summary:
- **Removed**: 473 lines of old code
- **Added**: 117 lines of API code
- **Net Change**: -356 lines (-35% total code)
- **Improved**: Cleaner architecture, database-driven, single responsibility

---

## 11. Rollback Plan

If issues occur during deployment:

### Restore Old Files:
```powershell
# Restore profile.js
Copy-Item public/js/profile.js.backup public/js/profile.js -Force

# Revert profile.html (use git)
git checkout public/profile.html
```

### Database Rollback:
```sql
-- Remove Passports table
DROP TABLE IF EXISTS [dbo].[Passports];
```

### Function App Rollback:
```powershell
# Remove profile endpoint
Remove-Item -Recurse -Force api/profile
```

---

## Completion Status: ✅ READY FOR DEPLOYMENT

All code changes complete. Awaiting:
1. Database deployment (schema + seed data)
2. Function App deployment (api/profile endpoint)
3. End-to-end testing

---

**Prepared by**: GitHub Copilot  
**Date**: January 7, 2026  
**Project**: Blue Mountain Travel - Profile System Refactor
