# Azure Function App Deployment (Login API)

> Warning: This app is intentionally vulnerable. Deploy only to isolated training resources.

## What This Deploys
- An Azure Function App (Node.js) that exposes `GET/POST /api/users` to validate credentials against the `Users` table in `TravelDB`.
- Works with the Static Web App front end because it already calls `/api/users`.

## Prerequisites
- Azure CLI and Azure Functions Core Tools installed
- Resource group and SQL Server/DB already created (`bluemountaintravel-sql` / `TravelDB`)
- The `Users` table seeded with the sample data

## 1) Create Storage + Function App (Consumption)
```bash
# Variables
RG=rg-bluemountain-training
LOC=eastus
STORAGE=bluemountaintravelfuncsa
FUNCAPP=bluemountaintravel-func
PLAN=bluemountaintravel-func-plan

az group create --name $RG --location $LOC
az storage account create --name $STORAGE --location $LOC --resource-group $RG --sku Standard_LRS
az functionapp plan create --name $PLAN --resource-group $RG --location $LOC --sku Y1 --is-linux
az functionapp create \
  --name $FUNCAPP \
  --resource-group $RG \
  --plan $PLAN \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --storage-account $STORAGE
```

## 2) Configure App Settings (SQL connectivity)
```bash
az functionapp config appsettings set \
  --name $FUNCAPP \
  --resource-group $RG \
  --settings \
    SQL_SERVER="bluemountaintravel-sql.database.windows.net" \
    SQL_DB="TravelDB" \
    SQL_USER="admin" \
    SQL_PASSWORD="P@ssw0rd123!"
```

> Optional: instead of individual settings, you can set `SQL_CONNECTION_STRING` to the full connection string.

## 3) Deploy the Function Code (from repo root)
```bash
cd api
npm install
func azure functionapp publish $FUNCAPP
```

After publish, the login endpoint will be at:
```
https://$FUNCAPP.azurewebsites.net/api/users
```

## 4) Point the Static Site to the Function
- If deploying with Azure Static Web Apps (with this repo structure), `/api/users` will automatically proxy to the Functions in the `api` folder when you set `apiLocation: "api"` in your SWA workflow.
- If using a standalone Static Web App already live at `https://calm-beach-041f9ca0f.2.azurestaticapps.net`, set `API_BASE_URL` in `public/js/api-client.js` to `https://$FUNCAPP.azurewebsites.net/api` (or add a config fetch) so login calls reach the new Function App.

## 5) Smoke Test
```bash
curl "https://$FUNCAPP.azurewebsites.net/api/users?email=sarah.johnson@globalind.com&password=Sarah@2024"
```
Expected: JSON array with Sarah’s user record.

## 6) Clean Up
```bash
az group delete --name $RG --yes --no-wait
```
