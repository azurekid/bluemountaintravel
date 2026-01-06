# Azure Deployment Guide

This guide explains how to deploy the Blue Mountain Travel vulnerable web application to Azure for security training purposes.

## ⚠️ WARNING

This deployment creates intentionally vulnerable infrastructure. Only deploy in isolated training environments, never in production.

## Prerequisites

- Azure subscription
- Azure CLI installed
- Appropriate permissions to create resources
- Understanding of Azure security implications

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Azure Subscription                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │        Azure Static Web Apps                  │  │
│  │        (Host the static website)              │  │
│  └──────────────────────────────────────────────┘  │
│                       │                              │
│                       ▼                              │
│  ┌──────────────────────────────────────────────┐  │
│  │        Azure Storage Account                  │  │
│  │  ⚠️ Public Blob Access Enabled                │  │
│  │                                                │  │
│  │  Containers:                                   │  │
│  │  - bookings (public)                          │  │
│  │  - profiles (public)                          │  │
│  │  - documents (public)                         │  │
│  │                                                │  │
│  │  ⚠️ Long-lived SAS tokens                     │  │
│  └──────────────────────────────────────────────┘  │
│                       │                              │
│                       ▼                              │
│  ┌──────────────────────────────────────────────┐  │
│  │        Azure SQL Database                     │  │
│  │  ⚠️ Default admin credentials                 │  │
│  │  ⚠️ Public endpoint enabled                   │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Option 1: Manual Deployment

### Step 1: Create Resource Group

```bash
az login

# Create resource group
az group create \
  --name rg-bluemountain-training \
  --location eastus \
  --tags "Environment=Training" "Purpose=SecurityDemo"
```

### Step 2: Create Storage Account

```bash
# Create storage account
az storage account create \
  --name bluemountaintravel \
  --resource-group rg-bluemountain-training \
  --location eastus \
  --sku Standard_LRS \
  --allow-blob-public-access true

# Get connection string
az storage account show-connection-string \
  --name bluemountaintravel \
  --resource-group rg-bluemountain-training

# Create containers with public access (VULNERABLE)
az storage container create \
  --name bookings \
  --account-name bluemountaintravel \
  --public-access blob

az storage container create \
  --name profiles \
  --account-name bluemountaintravel \
  --public-access blob

az storage container create \
  --name documents \
  --account-name bluemountaintravel \
  --public-access blob

# Generate SAS token (long-lived - VULNERABLE)
az storage account generate-sas \
  --account-name bluemountaintravel \
  --resource-group rg-bluemountain-training \
  --services bfqt \
  --resource-types sco \
  --permissions rwdlacupiytfx \
  --expiry 2025-12-31T23:59:59Z \
  --https-only
```

### Step 3: Create Azure SQL Database

```bash
# Create SQL Server (with weak credentials - VULNERABLE)
az sql server create \
  --name bluemountaintravel-sql \
  --resource-group rg-bluemountain-training \
  --location eastus \
  --admin-user admin \
  --admin-password "P@ssw0rd123!"

# Allow Azure services (VULNERABLE)
az sql server firewall-rule create \
  --resource-group rg-bluemountain-training \
  --server bluemountaintravel-sql \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow all IPs (EXTREMELY VULNERABLE - for training only)
az sql server firewall-rule create \
  --resource-group rg-bluemountain-training \
  --server bluemountaintravel-sql \
  --name AllowAll \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255

# Create database
az sql db create \
  --resource-group rg-bluemountain-training \
  --server bluemountaintravel-sql \
  --name TravelDB \
  --service-objective Basic
```

### Step 4: Deploy Static Web App

```bash
# Create static web app
az staticwebapp create \
  --name bluemountain-travel \
  --resource-group rg-bluemountain-training \
  --location eastus2 \
  --source https://github.com/azurekid/bluemountaintravel \
  --branch main \
  --app-location "/public" \
  --login-with-github
```

### Step 5: Update Configuration

After creating the resources, update the configuration files with your actual resource names:

1. Edit `config/azure-config.json` with your storage account name and keys
2. Edit `public/js/main.js` with your actual SAS token
3. Update database connection strings

## Option 2: ARM Template Deployment

```bash
# Deploy using ARM template
az deployment group create \
  --resource-group rg-bluemountain-training \
  --template-file deploy/azuredeploy.json \
  --parameters deploy/azuredeploy.parameters.json
```

## Option 3: Local Development Only

If you just want to run the site locally for training:

```bash
# Install dependencies
npm install

# Start local server
npm start

# Open browser to http://localhost:8080
```

## Post-Deployment Steps

### 1. Verify Vulnerabilities

After deployment, verify the intentional vulnerabilities:

```bash
# Check blob public access
curl https://bluemountaintravel.blob.core.windows.net/bookings?restype=container&comp=list

# Check if SQL is accessible
sqlcmd -S bluemountaintravel-sql.database.windows.net -U admin -P "P@ssw0rd123!" -d TravelDB -Q "SELECT @@VERSION"
```

### 2. Access the Application

Navigate to your Static Web App URL:
```
https://bluemountain-travel.azurestaticapps.net
```

### 3. Test Vulnerabilities

1. Open browser developer tools (F12)
2. Navigate through the site
3. Check the Console tab for exposed credentials
4. Check the Application > Local Storage for sensitive data
5. View the Network tab to see API calls with exposed tokens

## Training Exercises

### Exercise 1: Find Exposed Credentials
- Open the site and press F12
- Find the SAS token in the JavaScript files
- Use the token to access blob storage directly

### Exercise 2: Access Public Blob Storage
- Copy a blob URL from the console
- Try to access it directly in your browser
- Notice no authentication is required

### Exercise 3: Local Storage Exploitation
- Make a booking or view profile
- Open Application > Local Storage in DevTools
- Export all the sensitive data stored there

### Exercise 4: Database Access
- Find the connection string in the console
- Use it to connect to the database
- Notice the weak credentials

## Security Remediation Guide

After identifying vulnerabilities, practice fixing them:

### Fix 1: Remove SAS Tokens from Client
```javascript
// Instead of:
const SAS_TOKEN = "?sv=2021...";

// Use server-side token generation:
async function getSasToken() {
  const response = await fetch('/api/get-sas-token');
  return response.json();
}
```

### Fix 2: Disable Public Blob Access
```bash
az storage account update \
  --name bluemountaintravel \
  --allow-blob-public-access false
```

### Fix 3: Use Azure Key Vault
```bash
# Create Key Vault
az keyvault create \
  --name bluemountain-kv \
  --resource-group rg-bluemountain-training

# Store secrets
az keyvault secret set \
  --vault-name bluemountain-kv \
  --name "DatabasePassword" \
  --value "YourSecurePassword"
```

### Fix 4: Enable Managed Identity
```bash
# Enable managed identity for Static Web App
az staticwebapp identity assign \
  --name bluemountain-travel \
  --resource-group rg-bluemountain-training
```

### Fix 5: Implement Authentication
Add Azure AD authentication to the Static Web App:
```json
{
  "routes": [{
    "route": "/profile",
    "allowedRoles": ["authenticated"]
  }],
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "clientIdSettingName": "AZURE_AD_CLIENT_ID",
          "openIdIssuer": "https://login.microsoftonline.com/{tenant-id}"
        }
      }
    }
  }
}
```

## Clean Up Resources

When finished with the training:

```bash
# Delete the entire resource group
az group delete \
  --name rg-bluemountain-training \
  --yes \
  --no-wait
```

## Cost Estimation

Running this demo for a month:
- Azure Storage: ~$1-2
- Azure SQL (Basic): ~$5
- Static Web App (Free tier): $0
- **Total: ~$6-7 per month**

## Important Notes

1. **Never deploy this in production**
2. **Use isolated subscriptions/resource groups**
3. **Set up cost alerts**
4. **Delete resources when not in use**
5. **Document this as a training environment**
6. **Restrict network access to training participants only**

## Support

For deployment issues, please open an issue on GitHub.

## References

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Storage Security](https://docs.microsoft.com/en-us/azure/storage/common/storage-security-guide)
- [Azure SQL Security](https://docs.microsoft.com/en-us/azure/azure-sql/database/security-overview)
