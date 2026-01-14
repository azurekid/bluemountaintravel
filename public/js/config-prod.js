// config-prod.js - Production configuration
window.BMT_CONFIG = {
  environment: 'production',
  ctfMode: true, // Enable CTF challenges

  api: {
    baseUrl: window.location.hostname === 'localhost'
      ? 'http://localhost:8080/api'
      : 'https://api-bluemountain-prod.azurewebsites.net/api',
    timeout: 30000,
    retries: 3
  },

  auth: {
    provider: 'AzureAD', // Use Azure AD in production
    clientId: 'YOUR_AZURE_AD_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin
  },

  storage: {
    account: 'stbluemountainprod',
    // SAS tokens retrieved dynamically via secure API calls
    containers: {
      bookings: 'bookings',
      documents: 'documents',
      profiles: 'profiles',
      passports: 'passports'
    }
  },

  features: {
    ctfMode: true,
    debugLogging: false,
    analytics: true,
    errorReporting: true
  },

  security: {
    enableCSP: true,
    enableHSTS: true,
    enableXFrameOptions: true,
    enableXContentTypeOptions: true
  },

  ctf: {
    enabled: true,
    endpoints: {
      userEnumeration: '/api/ctf/users',
      sqlInjection: '/api/ctf/login',
      arbitrarySql: '/api/ctf/execute',
      flagValidation: '/api/ctf/validate'
    },
    challenges: [
      {
        id: 'user-enumeration',
        title: 'User Enumeration',
        description: 'Find all registered users in the system',
        points: 100,
        category: 'reconnaissance'
      },
      {
        id: 'sql-injection',
        title: 'SQL Injection',
        description: 'Extract sensitive data using SQL injection',
        points: 200,
        category: 'injection'
      },
      {
        id: 'arbitrary-sql',
        title: 'Arbitrary SQL Execution',
        description: 'Execute arbitrary SQL commands',
        points: 300,
        category: 'injection'
      },
      {
        id: 'storage-exposure',
        title: 'Storage Exposure',
        description: 'Access sensitive files in cloud storage',
        points: 150,
        category: 'cloud'
      },
      {
        id: 'admin-access',
        title: 'Administrator Access',
        description: 'Gain administrator privileges',
        points: 500,
        category: 'privilege-escalation'
      }
    ]
  }
};

// Load configuration based on environment
(function() {
  const hostname = window.location.hostname;

  // Development overrides
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    window.BMT_CONFIG.environment = 'development';
    window.BMT_CONFIG.api.baseUrl = 'http://localhost:8080/api';
    window.BMT_CONFIG.auth.provider = 'local'; // Use local auth for development
  }

  // Production overrides
  if (hostname.includes('bluemountaintravel.uk') || hostname.includes('azurestaticapps.net')) {
    window.BMT_CONFIG.environment = 'production';
    window.BMT_CONFIG.api.baseUrl = 'https://api-bluemountain-prod.azurewebsites.net/api';
  }

  console.log('Configuration loaded:', window.BMT_CONFIG.environment, {
    ctfMode: window.BMT_CONFIG.ctfMode,
    apiUrl: window.BMT_CONFIG.api.baseUrl
  });
})();