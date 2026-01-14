// main.bicep - Production infrastructure template
param location string = 'eastus2'
param environment string = 'prod'
param sqlAdministratorLogin string = 'dbadmin'

// Generate unique names
var uniqueSuffix = uniqueString(resourceGroup().id)
var storageAccountName = 'stbluemountain${environment}${uniqueSuffix}'
var sqlServerName = 'sql-bluemountain-${environment}-${uniqueSuffix}'
var keyVaultName = 'kv-bluemountain-${environment}-${uniqueSuffix}'
var appServiceName = 'api-bluemountain-${environment}-${uniqueSuffix}'
var frontDoorName = 'fd-bluemountain-${environment}'

// Resource tags
var tags = {
  Environment: environment
  Project: 'BlueMountainTravel'
  Purpose: 'CTF-Platform'
}

// Virtual Network
resource vnet 'Microsoft.Network/virtualNetworks@2023-04-01' = {
  name: 'vnet-bluemountain-${environment}'
  location: location
  tags: tags
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'subnet-web'
        properties: {
          addressPrefix: '10.0.1.0/24'
          serviceEndpoints: []
        }
      }
      {
        name: 'subnet-db'
        properties: {
          addressPrefix: '10.0.2.0/24'
          serviceEndpoints: [
            {
              service: 'Microsoft.Sql'
            }
          ]
          delegations: [
            {
              name: 'sql-delegation'
              properties: {
                serviceName: 'Microsoft.Sql/managedInstances'
              }
            }
          ]
        }
      }
      {
        name: 'subnet-storage'
        properties: {
          addressPrefix: '10.0.3.0/24'
          serviceEndpoints: [
            {
              service: 'Microsoft.Storage'
            }
          ]
        }
      }
    ]
  }
}

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enableRbacAuthorization: true
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: []
  }
}

// Generate and store database password
resource dbPassword 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  name: '${keyVault.name}/db-admin-password'
  properties: {
    value: uniqueString(resourceGroup().id, 'dbpass')
  }
  dependsOn: [
    keyVault
  ]
}

// Azure SQL Server
resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: sqlServerName
  location: location
  tags: tags
  properties: {
    administratorLogin: sqlAdministratorLogin
    administratorLoginPassword: dbPassword.properties.value
    version: '12.0'
    publicNetworkAccess: 'Disabled'
    minimalTlsVersion: '1.2'
  }
}

// SQL Database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  name: '${sqlServer.name}/TravelDB'
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'S0'
      tier: 'Standard'
    }
    maxSizeBytes: 1073741824 // 1GB
    zoneRedundant: false
    collation: 'SQL_Latin1_General_CP1_CI_AS'
  }
  dependsOn: [
    sqlServer
  ]
}

// Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    isHnsEnabled: false
    networkAcls: {
      defaultAction: 'Deny'
      virtualNetworkRules: [
        {
          virtualNetworkResourceId: vnet.id
          action: 'Allow'
          state: 'Succeeded'
        }
      ]
      ipRules: []
      resourceAccessRules: []
    }
  }
}

// Storage Containers
resource bookingsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: '${storageAccount.name}/default/bookings'
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccount
  ]
}

resource documentsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: '${storageAccount.name}/default/documents'
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccount
  ]
}

resource profilesContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: '${storageAccount.name}/default/profiles'
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccount
  ]
}

resource passportsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: '${storageAccount.name}/default/passports'
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccount
  ]
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: 'asp-bluemountain-${environment}'
  location: location
  tags: tags
  sku: {
    name: 'P1V3'
    tier: 'PremiumV3'
    size: 'P1V3'
    capacity: 1
  }
  properties: {
    reserved: true // Linux
  }
}

// App Service
resource appService 'Microsoft.Web/sites@2022-09-01' = {
  name: appServiceName
  location: location
  tags: tags
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      alwaysOn: true
      http20Enabled: true
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'CTF_MODE'
          value: 'true'
        }
        {
          name: 'KEY_VAULT_URL'
          value: keyVault.properties.vaultUri
        }
        {
          name: 'JWT_SECRET'
          value: uniqueString(resourceGroup().id, 'jwt')
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
  dependsOn: [
    appServicePlan
    keyVault
  ]
}

// Key Vault Access Policy for App Service
resource keyVaultAccessPolicy 'Microsoft.KeyVault/vaults/accessPolicies@2023-02-01' = {
  name: '${keyVault.name}/add'
  properties: {
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: appService.identity.principalId
        permissions: {
          secrets: [
            'get'
            'list'
          ]
          certificates: []
          keys: []
        }
      }
    ]
  }
  dependsOn: [
    keyVault
    appService
  ]
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'ai-bluemountain-${environment}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Flow_Type: 'Bluefield'
    Request_Source: 'rest'
  }
}

// Front Door Profile
resource frontDoorProfile 'Microsoft.Cdn/profiles@2023-05-01' = {
  name: frontDoorName
  location: 'Global'
  tags: tags
  sku: {
    name: 'Premium_AzureFrontDoor'
  }
}

// Front Door Endpoint
resource frontDoorEndpoint 'Microsoft.Cdn/profiles/afdEndpoints@2023-05-01' = {
  name: '${frontDoorProfile.name}/endpoint'
  properties: {
    enabledState: 'Enabled'
  }
  dependsOn: [
    frontDoorProfile
  ]
}

// WAF Policy
resource wafPolicy 'Microsoft.Network/frontdoorWebApplicationFirewallPolicies@2020-11-01' = {
  name: 'waf-bluemountain-${environment}'
  location: 'Global'
  properties: {
    policySettings: {
      enabledState: 'Enabled'
      mode: 'Prevention'
      customBlockResponseStatusCode: 403
      customBlockResponseBody: base64('Access Denied - Security Violation Detected')
    }
    customRules: [
      {
        name: 'RateLimit'
        enabledState: 'Enabled'
        priority: 1
        ruleType: 'RateLimitRule'
        rateLimitThreshold: 100
        rateLimitDurationInMinutes: 5
        matchConditions: [
          {
            matchVariable: 'RemoteAddr'
            operator: 'IPMatch'
            matchValue: [
              '0.0.0.0/0'
            ]
          }
        ]
        action: 'Block'
      }
    ]
    managedRules: {
      managedRuleSets: [
        {
          ruleSetType: 'Microsoft_DefaultRuleSet'
          ruleSetVersion: '2.1'
          ruleSetAction: 'Block'
        }
      ]
    }
  }
}

// Outputs
output keyVaultName string = keyVault.name
output keyVaultUrl string = keyVault.properties.vaultUri
output sqlServerName string = sqlServer.name
output sqlDatabaseName string = sqlDatabase.name
output storageAccountName string = storageAccount.name
output appServiceName string = appService.name
output appServiceUrl string = appService.properties.defaultHostname
output frontDoorEndpoint string = frontDoorEndpoint.properties.hostName