# Login Troubleshooting Guide

## Issue: Unable to Login
**Email**: sarah.johnson@globalind.com  
**Password**: Sarah@2024

## Root Cause Analysis

The login failure is likely due to one of these reasons:

### 1. ❌ Database Not Deployed (Most Likely)
The seed data containing the user credentials hasn't been deployed to Azure SQL Database yet.

**Solution**: Deploy the database changes:

```sql
-- Step 1: Connect to your Azure SQL Database
-- In Azure Portal:
-- 1. Go to SQL Databases → TravelDB
-- 2. Click "Query editor (preview)"
-- 3. Login with your Azure credentials
-- 4. Copy and paste the contents of: database/schema.sql
-- 5. Execute the query (Add Passports table if not already added)
-- 6. Copy and paste the contents of: database/seed-data.sql  
-- 7. Execute the query (Add user records and passport data)
```

Or using **SQL Server Management Studio (SSMS)**:
```
Server: bluemountaintravel-sql.database.windows.net
Database: TravelDB
User: dbadmin
Password: [Your admin password]

Then execute:
- database/schema.sql
- database/seed-data.sql
```

### 2. ✅ Database Already Has Data
If you've already deployed the seed data, verify the user exists:

**Query to check**:
```sql
SELECT UserID, Email, PasswordHash, FirstName, LastName, IsActive 
FROM Users 
WHERE Email = 'sarah.johnson@globalind.com';
```

**Expected Result**:
| UserID | Email | PasswordHash | FirstName | LastName | IsActive |
|--------|-------|--------------|-----------|----------|----------|
| USR002 | sarah.johnson@globalind.com | Sarah@2024 | Sarah | Johnson | 1 |

### 3. ✅ Function App Not Deployed
The `/api/users` endpoint must be deployed to Azure Function App.

**Check status**:
```powershell
# List your Function App endpoints
az functionapp function list --name bluemountaintravel-func --resource-group <your-rg>
```

**If not present, deploy**:
```powershell
cd /Users/rogier/GitHub/bluemountaintravel
func azure functionapp publish bluemountaintravel-func
```

---

## Quick Test: Try These Users

All passwords match the usernames and are in plain text (intentional vulnerability):

| Email | Password | Status |
|-------|----------|--------|
| john.smith@techcorp.com | password123 | ✅ Should work |
| sarah.johnson@globalind.com | Sarah@2024 | ⚠️ Testing |
| michael.chen@innovlab.io | Chen#2024 | ✅ Should work |
| emma.williams@stratcon.com | Emma!Williams99 | ✅ Should work |

---

## Step-by-Step Deployment Checklist

### Step 1: Deploy Database (Required First)
```
[ ] Open Azure Portal
[ ] Navigate to SQL Database "TravelDB"  
[ ] Click "Query editor"
[ ] Run database/schema.sql
[ ] Run database/seed-data.sql
[ ] Verify: SELECT COUNT(*) FROM Users; (should be 11)
```

### Step 2: Verify SQL Server Firewall
```
[ ] Azure Portal → TravelDB → Connection strings
[ ] Check "Firewall and virtual networks"
[ ] Enable "Allow Azure services and resources to access this server"
```

### Step 3: Deploy Function App (if not done)
```
[ ] Open terminal in VS Code
[ ] cd /Users/rogier/GitHub/bluemountaintravel
[ ] func azure functionapp publish bluemountaintravel-func
[ ] Verify: https://bluemountaintravel-func.azurewebsites.net/api/users
```

### Step 4: Test Login
```
[ ] Go to https://calm-beach-041f9ca0f.2.azurestaticapps.net/login.html
[ ] Enter: sarah.johnson@globalind.com / Sarah@2024
[ ] Should see "Login Successful" message
[ ] Should redirect to profile page
```

---

## Browser Developer Tools Debugging

If login still fails, check browser console:

**Press F12 and go to Console tab, then try login. Look for:**

1. **Network Error** (Red ❌):
   - "Failed to fetch" → Function App not deployed or not accessible
   - Check: https://bluemountaintravel-func.azurewebsites.net/api/users

2. **CORS Error**:
   - "Access to XMLHttpRequest has been blocked by CORS policy"
   - Need to enable CORS in Function App settings

3. **Database Error** (500 Internal Server Error):
   - Function App can't connect to SQL Database
   - Check SQL firewall allows Azure services

4. **Empty Response** (200 OK but empty array `[]`):
   - Database is accessible but user not found in database
   - Need to run seed-data.sql

---

## Password Note

⚠️ **Important**: The password is case-sensitive!
- ✅ Correct: `Sarah@2024`
- ❌ Wrong: `sarah@2024`
- ❌ Wrong: `SARAH@2024`

---

## Still Having Issues?

Run these diagnostic commands:

```powershell
# 1. Check Function App is running
curl https://bluemountaintravel-func.azurewebsites.net/api/users?email=test@test.com

# 2. Check if user exists in database (if you have SQL access)
sqlcmd -S bluemountaintravel-sql.database.windows.net -d TravelDB -U dbadmin -P "password" 
> SELECT COUNT(*) FROM Users WHERE Email = 'sarah.johnson@globalind.com'

# 3. Check Function App logs
az functionapp logs tail --name bluemountaintravel-func --resource-group <your-resource-group>
```

---

## Test Logins (After Deployment)

Once database is deployed, these credentials should work:

1. **john.smith@techcorp.com** / `password123`
2. **sarah.johnson@globalind.com** / `Sarah@2024`
3. **michael.chen@innovlab.io** / `Chen#2024`

