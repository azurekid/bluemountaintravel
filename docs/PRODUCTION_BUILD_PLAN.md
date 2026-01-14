# Production Build Plan for Blue Mountain Travel CTF

## Overview
This document outlines how to run Blue Mountain Travel as a **production-grade CTF platform**.

Goals:
- Keep the environment **intentionally vulnerable** for Azure + Entra learning.
- Prevent participants from **permanently breaking** the platform (no “drop the DB” style outcomes).
- Provide **enterprise telemetry** via Defender for Cloud, Microsoft Defender XDR, and Microsoft Sentinel.
- Keep **CTF management isolated** from participant-accessible resources.

Non-goals:
- Allowing participants to gain Azure subscription-wide ownership.
- Any challenge that requires destructive actions like dropping databases/tables.

Primary operating model:
- **Shared multi-user environment** (single Game Plane): all participants use the same deployed resources.
- “Reset” is still first-class: the environment is designed to be **reseeded/redeployed** quickly if needed.

Terminology:
- **Control Plane**: secure management + scoring + monitoring resources.
- **Game Plane**: participant-accessible application/resources containing the intentionally vulnerable configurations.

> Important: Participants should not be able to reach the Control Plane, even if they fully compromise the Game Plane.

## Architecture Evolution

### Current Architecture (Training)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Web    │    │   Azure SQL     │    │   Azure Storage │
│     App         │◄──►│   Database      │◄──►│   (Public)      │
│                 │    │   (Public)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Architecture (CTF-Ready)
```
                 ┌────────────────────────────────────────────────────┐
                 │                 CONTROL PLANE (SECURE)             │
                 │  - Flag validation + scoring API                   │
                 │  - Admin UI (not public)                           │
                 │  - Central Log Analytics Workspace                  │
                 │  - Microsoft Sentinel (SIEM)                        │
                 │  - Defender for Cloud + Defender XDR integration    │
                 └────────────────────────────────────────────────────┘
                                      ▲
                                      │ (one-way: telemetry + scoring)
                                      │
┌─────────────────┐    ┌──────────────────────────────────────────────┐
│ Azure Front Door│───►│            GAME PLANE (PER PLAYER)            │
│ + WAF + rate lim│    │  - Static Web App                              │
└─────────────────┘    │  - API (Functions/App Service)                │
                       │  - Storage (scoped containers/SAS)            │
                       │  - SQL (restricted roles)                     │
                       │  - Entra identities + RBAC misconfigurations  │
                       └──────────────────────────────────────────────┘
```

## Safety Model: Prevent “Full Break”

### Isolation model (this CTF)
This CTF runs as a **shared environment** (no per-player resource isolation).

What this implies:
- A single participant can accidentally impact others (e.g., noisy queries, storage writes) unless you add guardrails.
- “Break glass” recovery matters: prefer fast **reset** over manual repair.

If you later need stronger containment, add optional isolation (per-resource-group or per-subscription) as a future enhancement.

### Guardrails
- Use **Azure Policy** to deny high-impact operations in the Game Plane (e.g., deny deleting the Resource Group, deny disabling diagnostic settings).
- Add **resource locks** on “must-not-break” resources (or keep them in the Control Plane only).
- Enforce **quotas/budgets** to avoid cost blow-ups.
- Use Front Door/WAF + app-level limits to reduce noisy/abusive traffic.
- Prefer “non-destructive” challenge mechanics so participants can’t erase shared state.

### Non-destructive vulnerability design
- SQL injection challenges should be **read-only or write-limited** (no DDL). Run vulnerable endpoints under a DB principal that cannot `DROP/ALTER/CREATE`.
- Storage challenges should use **scoped SAS** and containers that can be reset (and enable **soft delete + versioning**).
- If you need “write” challenges, write into a **sandbox schema/container** that can be reseeded.

Shared-environment hard rule:
- Any “write” challenge must not allow a participant to corrupt or delete data required for other challenges.

## Phase 1: Infrastructure Security

### 1.0 Control Plane vs Game Plane
- Control Plane:
  - Central Log Analytics workspace + Sentinel
  - Scoring/flag validation service
  - Admin-only dashboard
  - Automation (deploy/reset)
- Game Plane (shared):
  - Application resources + intentionally vulnerable configurations
  - RBAC/identity challenges (scoped to the Game Plane)
  - Telemetry forwarding to Control Plane

### 1.1 Network Security
```bash
# Create Virtual Network and subnets
az network vnet create \
  --resource-group rg-bluemountain-prod \
  --name vnet-bluemountain \
  --address-prefix 10.0.0.0/16 \
  --subnet-name subnet-web \
  --subnet-prefix 10.0.1.0/24

# Create private subnet for database
az network vnet subnet create \
  --resource-group rg-bluemountain-prod \
  --vnet-name vnet-bluemountain \
  --name subnet-db \
  --address-prefixes 10.0.2.0/24 \
  --service-endpoints Microsoft.Sql

# Create private subnet for storage
az network vnet subnet create \
  --resource-group rg-bluemountain-prod \
  --vnet-name vnet-bluemountain \
  --name subnet-storage \
  --address-prefixes 10.0.3.0/24 \
  --service-endpoints Microsoft.Storage
```

### 1.2 Azure Front Door (WAF)
```bash
# Create Front Door profile
az afd profile create \
  --profile-name fd-bluemountain \
  --resource-group rg-bluemountain-prod \
  --sku Premium_AzureFrontDoor

# Create WAF policy
az network front-door waf-policy create \
  --name waf-bluemountain \
  --resource-group rg-bluemountain-prod \
  --mode Prevention \
  --custom-block-response-body "Access Denied - Security Violation"
```

### 1.3 Key Vault for Secrets
```bash
# Create Key Vault
az keyvault create \
  --name kv-bluemountain-prod \
  --resource-group rg-bluemountain-prod \
  --location eastus2 \
  --enabled-for-deployment true \
  --enabled-for-template-deployment true

# Store database credentials
az keyvault secret set \
  --vault-name kv-bluemountain-prod \
  --name db-admin-password \
  --value "$(openssl rand -base64 32)"

# Store storage SAS tokens
az keyvault secret set \
  --vault-name kv-bluemountain-prod \
  --name storage-sas-token \
  --value "GENERATED_SAS_TOKEN"
```

## Phase 2: Application Security

### 2.0 Identity + RBAC (Azure/Entra-focused)
Design the sandbox so players can discover and abuse **mis-scoped permissions** without gaining global control.

Recommended patterns for challenges (examples, not instructions):
- Over-permissive role assignment to a **compromisable identity** (e.g., a service principal credential leak that grants limited RBAC within the participant sandbox).
- Misconfigured Key Vault access (RBAC or access policies) that reveals a secret used by another resource.
- Managed identity with excess permissions on Storage/SQL.
- Excessive permissions on a single container (e.g., “documents”) that exposes configuration leading to the next hop.

Guardrail rule of thumb:
- Every identity used for a challenge should have permissions scoped to **only that participant’s Game Plane**.

### 2.1 Backend API (App Service)
```bash
# Create App Service Plan
az appservice plan create \
  --name asp-bluemountain-prod \
  --resource-group rg-bluemountain-prod \
  --location eastus2 \
  --sku P1V3 \
  --is-linux

# Create App Service
az webapp create \
  --name api-bluemountain-prod \
  --resource-group rg-bluemountain-prod \
  --plan asp-bluemountain-prod \
  --runtime "NODE:18-lts"

# Configure environment variables from Key Vault
az webapp config appsettings set \
  --name api-bluemountain-prod \
  --resource-group rg-bluemountain-prod \
  --setting DB_CONNECTION_STRING="@Microsoft.KeyVault(SecretUri=https://kv-bluemountain-prod.vault.azure.net/secrets/db-connection-string/)"
```

### 2.2 Database Security
```bash
# Create Azure SQL Server (Private)
az sql server create \
  --name sql-bluemountain-prod \
  --resource-group rg-bluemountain-prod \
  --location eastus2 \
  --admin-user dbadmin \
  --admin-password "$(az keyvault secret show --vault-name kv-bluemountain-prod --name db-admin-password --query value -o tsv)" \
  --enable-public-network false

# Create database
az sql db create \
  --server sql-bluemountain-prod \
  --name TravelDB \
  --resource-group rg-bluemountain-prod \
  --service-objective S0

# Configure VNet integration
az sql server vnet-rule create \
  --server sql-bluemountain-prod \
  --name vnet-rule \
  --resource-group rg-bluemountain-prod \
  --vnet-name vnet-bluemountain \
  --subnet subnet-db
```

### 2.3 Storage Security
```bash
# Create storage account (Private)
az storage account create \
  --name stbluemountainprod \
  --resource-group rg-bluemountain-prod \
  --location eastus2 \
  --sku Standard_LRS \
  --kind StorageV2 \
  --allow-blob-public-access false \
  --min-tls-version TLS1_2

# Create private containers
az storage container create \
  --name bookings \
  --account-name stbluemountainprod \
  --auth-mode login

az storage container create \
  --name documents \
  --account-name stbluemountainprod \
  --auth-mode login

# Configure network rules
az storage account network-rule add \
  --resource-group rg-bluemountain-prod \
  --account-name stbluemountainprod \
  --vnet-name vnet-bluemountain \
  --subnet subnet-storage
```

## Phase 3: Application Refactoring

### 3.1 Secure Backend Implementation (with CTF endpoints isolated)
Key rule: keep “normal app” endpoints stable; concentrate intentional weaknesses behind explicit `/api/ctf/*` routes.

- Non-CTF endpoints: standard authn/z, input validation, rate limits.
- CTF endpoints: intentionally weaker behavior, but constrained by:
  - DB principal that cannot do DDL.
  - Storage scoped SAS / sandbox container.
  - Timeouts and payload limits.

```javascript
// server-prod.js - Production backend
const express = require('express');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const { ConnectionPool } = require('mssql');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Authentication middleware
const authenticateRequest = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Validate JWT token
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Secure database connection
const getDbConfig = async () => {
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(process.env.KEY_VAULT_URL, credential);
  
  const dbPassword = await client.getSecret('db-admin-password');
  const connectionString = await client.getSecret('db-connection-string');
  
  return {
    connectionString: connectionString.value,
    options: {
      encrypt: true,
      trustServerCertificate: false,
      enableArithAbort: true
    }
  };
};

// Secure API endpoints
app.get('/api/users/:id', authenticateRequest, async (req, res) => {
  try {
    const pool = await getConnectionPool();
    const request = pool.request();
    request.input('userId', sql.VarChar, req.params.id);
    
    const result = await request.query(
      'SELECT UserID, Email, FirstName, LastName FROM Users WHERE UserID = @userId'
    );
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CTF-specific endpoints
app.get('/api/ctf/users', async (req, res) => {
  // ⚠️ CTF VULNERABILITY: User enumeration
  const pool = await getConnectionPool();
  const result = await pool.request().query('SELECT Email FROM Users');
  res.json(result.recordset);
});

app.post('/api/ctf/login', async (req, res) => {
  // ⚠️ CTF VULNERABILITY: Password in query string
  // Guardrail: ensure this endpoint uses a DB principal that cannot execute DDL.
  const { email, password } = req.query;
  const pool = await getConnectionPool();
  const request = pool.request();
  
  // ⚠️ CTF VULNERABILITY: SQL injection
  // Non-goal: destructive DB actions. Configure DB permissions so DDL fails.
  const query = `SELECT * FROM Users WHERE Email = '${email}' AND PasswordHash = '${password}'`;
  const result = await request.query(query);
  
  res.json(result.recordset);
});

module.exports = app;
```

### 3.2 Frontend Security
```javascript
// config-prod.js - Production configuration
window.BMT_CONFIG = {
  environment: 'production',
  api: {
    baseUrl: 'https://api-bluemountain-prod.azurewebsites.net',
    timeout: 30000
  },
  auth: {
    provider: 'AzureAD',
    // Note: clientId/tenant are injected at build/deploy time (not via process.env in the browser).
    clientId: '<injected-at-build-time>',
    authority: 'https://login.microsoftonline.com/<tenant-id>'
  },
  storage: {
    account: 'stbluemountainprod',
    // SAS tokens retrieved dynamically via API
  },
  features: {
    ctfMode: true, // Enable CTF challenges
    debugLogging: false
  }
};
```

## Phase 4: CTF Integration

### 4.0 Multi-user (shared) lifecycle
For a shared environment:
- Use a single deployment for the Game Plane.
- Run a scheduled or on-demand **reset** that reseeds data + restores blobs + rotates challenge credentials.

Recommended reset approach:
- Re-apply Bicep (idempotent) + run a seed step.
- Use Storage soft delete/versioning and SQL restore points for quick recovery.

### 4.1 CTF Flag Management
```javascript
// ctf-flags.js - Centralized flag management
const CTF_FLAGS = {
  // Authentication flags
  USER_ENUMERATION: 'FLAG{user_enumeration_vulnerable}',
  PASSWORD_IN_URL: 'FLAG{password_in_query_string}',
  SQL_INJECTION: 'FLAG{sql_injection_successful}',
  
  // Storage flags
  STORAGE_EXPOSURE: 'FLAG{azure_storage_exposed}',
  SAS_TOKEN_LEAK: 'FLAG{sas_token_compromised}',
  
  // Database flags
  DB_CREDENTIALS: 'FLAG{database_credentials_leaked}',
  SENSITIVE_DATA: 'FLAG{pii_data_exposed}'
};

// Flag validation endpoint
app.post('/api/ctf/validate', (req, res) => {
  const { flag } = req.body;
  
  for (const [key, value] of Object.entries(CTF_FLAGS)) {
    if (flag === value) {
      return res.json({ 
        valid: true, 
        challenge: key,
        points: getPointsForChallenge(key)
      });
    }
  }
  
  res.json({ valid: false });
});
```

### 4.2 CTF Dashboard
```html
<!-- ctf-dashboard.html -->
<div class="ctf-container">
  <h2>CTF Challenges</h2>
  <div class="challenge-list">
    <div class="challenge" data-challenge="user-enum">
      <h3>User Enumeration</h3>
      <p>Find all registered users in the system</p>
      <div class="flag-input">
        <input type="text" placeholder="Enter flag..." />
        <button onclick="submitFlag('user-enum')">Submit</button>
      </div>
    </div>
    
    <div class="challenge" data-challenge="sql-injection">
      <h3>SQL Injection</h3>
      <p>Extract sensitive data using SQL injection</p>
      <div class="flag-input">
        <input type="text" placeholder="Enter flag..." />
        <button onclick="submitFlag('sql-injection')">Submit</button>
      </div>
    </div>
  </div>
</div>
```

## Phase 5: Deployment & Monitoring

### 5.1 CI/CD Pipeline
```yaml
# .github/workflows/prod-deploy.yml
name: Production Deployment

on:
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'api/**'
      - 'infrastructure/**'

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Security Scan
        uses: securecodewarrior/github-action-gosec@master
        with:
          args: './...'
      
  deploy-infrastructure:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Infrastructure
        uses: azure/arm-deploy@v1
        with:
          subscriptionId: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
          resourceGroupName: rg-bluemountain-prod
          template: infrastructure/main.bicep
          parameters: prod.parameters.json

  deploy-application:
    needs: deploy-infrastructure
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy API
        uses: azure/webapps-deploy@v2
        with:
          app-name: api-bluemountain-prod
          package: api/
      
      - name: Deploy Frontend
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/public"
```

### 5.2 Monitoring & Alerting (Defender for Cloud + Sentinel + Defender XDR)
This CTF is Azure/Entra-focused, so the platform should expose real detection/telemetry:

- **Defender for Cloud**: enable plans relevant to the services you use (Storage, SQL, App Service/Functions, Key Vault).
- **Log Analytics Workspace** (Control Plane): centralize logs from Game Plane resources.
- **Microsoft Sentinel**: connect to the Control Plane workspace; enable data connectors (Azure Activity, Entra ID, Defender for Cloud alerts).
- **Microsoft Defender XDR**: integrate Defender for Cloud and Entra signals; use Sentinel for SIEM and XDR for correlated incidents.

Operational guardrails:
- Ensure Game Plane resources **cannot disable diagnostic settings** (Policy).
- Ensure cost control on logs (daily cap / retention policy).

```bash
# Create Application Insights
az monitor app-insights component create \
  --app ai-bluemountain-prod \
  --location eastus2 \
  --resource-group rg-bluemountain-prod \
  --application-type web

# Example: basic alerting (customize per challenge)
az monitor metrics alert create \
  --name "SQL Injection Attempts" \
  --resource /subscriptions/.../resourceGroups/rg-bluemountain-prod/providers/Microsoft.Sql/servers/sql-bluemountain-prod \
  --condition "count > 5 where Metric contains 'sql_injection'" \
  --action /subscriptions/.../resourceGroups/rg-bluemountain-prod/providers/microsoft.insights/actiongroups/ag-bluemountain-prod
```

## Phase 6: CTF Administration

### 6.0 Control Plane Isolation
Hard requirement: management must not be reachable from the Game Plane.

Recommendations:
- Host scoring/admin in a **separate subscription** (or at minimum separate RG + separate identities + private endpoints).
- Put admin UI behind **Entra ID** and conditional access.
- Never store Control Plane credentials in any Game Plane resource.

### 6.1 Challenge Management
```javascript
// admin/ctf-admin.js
class CTFAdmin {
  constructor() {
    this.challenges = new Map();
    this.participants = new Map();
  }
  
  addChallenge(name, config) {
    this.challenges.set(name, {
      ...config,
      solvedBy: new Set(),
      hints: config.hints || []
    });
  }
  
  registerParticipant(userId, team) {
    this.participants.set(userId, {
      team,
      solvedChallenges: new Set(),
      score: 0,
      startTime: Date.now()
    });
  }
  
  submitFlag(userId, challengeName, flag) {
    const challenge = this.challenges.get(challengeName);
    if (!challenge) return { valid: false };
    
    if (flag === challenge.flag) {
      const participant = this.participants.get(userId);
      if (participant && !participant.solvedChallenges.has(challengeName)) {
        participant.solvedChallenges.add(challengeName);
        participant.score += challenge.points;
        challenge.solvedBy.add(userId);
        
        return { 
          valid: true, 
          points: challenge.points,
          totalScore: participant.score
        };
      }
    }
    
    return { valid: false };
  }
  
  getLeaderboard() {
    return Array.from(this.participants.values())
      .sort((a, b) => b.score - a.score)
      .map(p => ({ team: p.team, score: p.score }));
  }
}
```

### 6.2 Scoring System
```javascript
// Scoring configuration
const SCORING_CONFIG = {
  challenges: {
    'user-enumeration': { points: 100, category: 'recon' },
    'sql-injection': { points: 200, category: 'injection' },
    'storage-exposure': { points: 150, category: 'cloud' },
    'admin-access': { points: 300, category: 'privilege' },
    'data-exfiltration': { points: 250, category: 'data' }
  },
  
  bonuses: {
    firstBlood: 50,    // First to solve a challenge
    speedBonus: 25,    // Solve within first hour
    chainBonus: 30     // Solve related challenges
  }
};
```

## Implementation Roadmap

### Week 1-2: Infrastructure Setup
- [ ] Create production resource group and networking
- [ ] Deploy Azure Front Door with WAF
- [ ] Set up Key Vault for secrets management
- [ ] Configure private Azure SQL Database
- [ ] Deploy private Azure Storage Account

### Week 3-4: Application Refactoring
- [ ] Refactor backend API with security middleware
- [ ] Implement proper authentication (Azure AD)
- [ ] Add rate limiting and input validation
- [ ] Secure database connections
- [ ] Implement proper error handling

### Week 5-6: CTF Integration
- [ ] Create CTF flag management system
- [ ] Implement challenge validation endpoints
- [ ] Build CTF dashboard for participants
- [ ] Add scoring and leaderboard functionality
- [ ] Create admin interface for challenge management

### Week 7-8: Testing & Deployment
- [ ] Comprehensive security testing
- [ ] Performance testing and optimization
- [ ] CTF challenge testing and balancing
- [ ] Production deployment with blue-green strategy
- [ ] Monitoring and alerting setup

## Security Considerations

### Maintained Vulnerabilities (CTF)
- User enumeration endpoints
- SQL injection in specific CTF endpoints
- Storage exposure challenges (controlled scope)
- Weak authentication in CTF areas
- Information disclosure in error messages

### Removed Vulnerabilities (Production)
- Public database access
- Exposed credentials in client code
- Unrestricted CORS
- Missing rate limiting on critical endpoints
- Plain text password storage

## CTF-Specific Guardrails Checklist
- Every “found credential” should grant **only** limited Game Plane-scoped access.
- Deny deletion of resource groups and critical resources via **Policy**.
- Use **restricted DB roles** for vulnerable endpoints (no DDL).
- Use Storage **soft delete + versioning**.
- Centralize logs in Control Plane; prevent disabling diagnostics.
- Automated reset: idempotent IaC + seed.

## Cost Optimization

### Azure Cost Management
```bash
# Set up cost alerts
az monitor action-group create \
  --name ag-cost-alerts \
  --resource-group rg-bluemountain-prod \
  --short-name "CostAlert"

az consumption budget create \
  --budget-name monthly-budget \
  --amount 500 \
  --time-grain Monthly \
  --start-date 2024-01-01 \
  --end-date 2024-12-31 \
  --notifications "Actual_GreaterThan_80_Percent=ag-cost-alerts"
```

This production build maintains the educational value of the CTF while providing enterprise-grade security, scalability, and maintainability.