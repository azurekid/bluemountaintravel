let DefaultAzureCredential;
let SecretClient;
try {
  ({ DefaultAzureCredential } = require('@azure/identity'));
  ({ SecretClient } = require('@azure/keyvault-secrets'));
} catch (_) {
  // Module load failures will be handled at runtime
}

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

async function getSecretValue(client, secretName) {
  if (!client || !secretName) {
    throw new Error('Key Vault client or secret name missing');
  }
  const result = await client.getSecret(secretName);
  return result?.value ?? null;
}

async function safeGetSecretValue(context, client, secretName) {
  try {
    return await getSecretValue(client, secretName);
  } catch (err) {
    context.log.warn('Key Vault secret fetch failed', {
      name: secretName,
      message: err?.message || err
    });
    return null;
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

  if (!keyVaultUrl) {
    context.res = {
      status: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Key Vault is not configured (KEY_VAULT_URL or KEY_VAULT_NAME missing)'
      })
    };
    return;
  }

  try {
    if (!DefaultAzureCredential || !SecretClient) {
      throw new Error('Key Vault SDK not available');
    }
    const credential = new DefaultAzureCredential();
    client = new SecretClient(keyVaultUrl, credential);
  } catch (err) {
    context.log.warn('Key Vault client init failed', err?.message || err);
    context.res = {
      status: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Key Vault client initialization failed'
      })
    };
    return;
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

  const response = {
    source: 'key-vault',
    bmtReader: {
      username: await safeGetSecretValue(context, client, secretNames.readerUsername),
      password: await safeGetSecretValue(context, client, secretNames.readerPassword)
    },
    servicePrincipal: {
      appId: await safeGetSecretValue(context, client, secretNames.spAppId),
      objectId: await safeGetSecretValue(context, client, secretNames.spObjectId),
      clientSecret: await safeGetSecretValue(context, client, secretNames.spClientSecret)
    },
    subscriptionId: await safeGetSecretValue(context, client, secretNames.subscriptionId),
    tenantId: await safeGetSecretValue(context, client, secretNames.tenantId),
    resourceGroup: await safeGetSecretValue(context, client, secretNames.resourceGroup)
  };

  if (includeKeys) {
    response.functionKey = await safeGetSecretValue(context, client, secretNames.functionKey);
    response.ctfFlag = await safeGetSecretValue(context, client, secretNames.ctfFlag);
  }

  context.res = {
    status: 200,
    headers,
    body: JSON.stringify(response)
  };
};
