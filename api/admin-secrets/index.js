const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

function buildHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-functions-key, X-API-Key'
  };
}

function getKeyVaultUrl() {
  if (process.env.KEY_VAULT_URL) {
    return process.env.KEY_VAULT_URL;
  }
  if (process.env.KEY_VAULT_NAME) {
    return `https://${process.env.KEY_VAULT_NAME}.vault.azure.net/`;
  }
  return null;
}

async function getSecretValue(client, secretName, fallback = null) {
  if (!client || !secretName) return fallback;
  try {
    const result = await client.getSecret(secretName);
    return result?.value ?? fallback;
  } catch (err) {
    return fallback;
  }
}

module.exports = async function (context, req) {
  const headers = buildHeaders();

  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers };
    return;
  }

  const includeKeys = String(req.query?.includeKeys || '').toLowerCase() === 'true';

  const keyVaultUrl = getKeyVaultUrl();
  let client = null;

  if (keyVaultUrl) {
    try {
      const credential = new DefaultAzureCredential();
      client = new SecretClient(keyVaultUrl, credential);
    } catch (err) {
      context.log.warn('Key Vault client init failed', err?.message || err);
    }
  }

  const secretNames = {
    functionKey: process.env.KV_SECRET_FUNCTION_KEY || 'function-key',
    ctfFlag: process.env.KV_SECRET_CTF_FLAG || 'ctf-admin-secondary-key',
    readerUsername: process.env.KV_SECRET_BMT_READER_USERNAME || 'bmt-reader-username',
    readerPassword: process.env.KV_SECRET_BMT_READER_PASSWORD || 'bmt-reader-password',
    spAppId: process.env.KV_SECRET_SP_APP_ID || 'sp-app-id',
    spObjectId: process.env.KV_SECRET_SP_OBJECT_ID || 'sp-object-id',
    spClientSecret: process.env.KV_SECRET_SP_CLIENT_SECRET || 'sp-client-secret',
    subscriptionId: process.env.KV_SECRET_SUBSCRIPTION_ID || 'subscription-id',
    tenantId: process.env.KV_SECRET_TENANT_ID || 'tenant-id',
    resourceGroup: process.env.KV_SECRET_RESOURCE_GROUP || 'resource-group'
  };

  const fallback = {
    functionKey: process.env.FALLBACK_FUNCTION_KEY || null,
    ctfFlag: process.env.FALLBACK_CTF_FLAG || 'FLAG{api_keys_exposed_in_admin_panel}',
    readerUsername: process.env.FALLBACK_BMT_READER_USERNAME || 'bmt_reader',
    readerPassword: process.env.FALLBACK_BMT_READER_PASSWORD || 'R3ad0nly2024!',
    spAppId: process.env.FALLBACK_SP_APP_ID || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    spObjectId: process.env.FALLBACK_SP_OBJECT_ID || '12345678-abcd-ef12-3456-789012345678',
    spClientSecret: process.env.FALLBACK_SP_CLIENT_SECRET || 'SuperSecret123!@#$%',
    subscriptionId: process.env.FALLBACK_SUBSCRIPTION_ID || '12345678-1234-1234-1234-123456789012',
    tenantId: process.env.FALLBACK_TENANT_ID || '87654321-4321-4321-4321-210987654321',
    resourceGroup: process.env.FALLBACK_RESOURCE_GROUP || 'bluemountain-rg'
  };

  const response = {
    source: keyVaultUrl ? 'key-vault' : 'fallback',
    bmtReader: {
      username: await getSecretValue(client, secretNames.readerUsername, fallback.readerUsername),
      password: await getSecretValue(client, secretNames.readerPassword, fallback.readerPassword)
    },
    servicePrincipal: {
      appId: await getSecretValue(client, secretNames.spAppId, fallback.spAppId),
      objectId: await getSecretValue(client, secretNames.spObjectId, fallback.spObjectId),
      clientSecret: await getSecretValue(client, secretNames.spClientSecret, fallback.spClientSecret)
    },
    subscriptionId: await getSecretValue(client, secretNames.subscriptionId, fallback.subscriptionId),
    tenantId: await getSecretValue(client, secretNames.tenantId, fallback.tenantId),
    resourceGroup: await getSecretValue(client, secretNames.resourceGroup, fallback.resourceGroup)
  };

  if (includeKeys) {
    response.functionKey = await getSecretValue(client, secretNames.functionKey, fallback.functionKey);
    response.ctfFlag = await getSecretValue(client, secretNames.ctfFlag, fallback.ctfFlag);
  }

  context.res = {
    status: 200,
    headers,
    body: JSON.stringify(response)
  };
};
