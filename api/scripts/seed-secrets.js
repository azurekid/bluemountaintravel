/*
  Seeds the Function App storage account with a small set of flag blobs.

  Usage:
    node scripts/seed-secrets.js

  Requires:
    AzureWebJobsStorage (or AZURE_STORAGE_CONNECTION_STRING)
*/

const { BlobServiceClient } = require('@azure/storage-blob');

function getConnectionString() {
  return process.env.AzureWebJobsStorage || process.env.AZURE_STORAGE_CONNECTION_STRING;
}

function fromB64(b64) {
  return Buffer.from(b64, 'base64').toString('utf8');
}

async function main() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error('AzureWebJobsStorage (or AZURE_STORAGE_CONNECTION_STRING) is not set');
  }

  const containerName = process.env.SECRETS_CONTAINER || 'secrets';
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  await containerClient.createIfNotExists();

  const seeds = [
    {
      blobName: 'storage-browser.txt',
      ctf_b64: 'RkxBR3tzdG9yYWdlX2Jyb3dzZXJfbm9fYXV0aF9yZXF1aXJlZH0='
    },
    {
      blobName: 'download-sas.txt',
      ctf_b64: 'RkxBR3tkb3dubG9hZGluZ19maWxlc193aXRoX3Nhc190b2tlbn0='
    },
    {
      blobName: 'passport-container.txt',
      ctf_b64: 'RkxBR3twYXNzcG9ydF9jb250YWluZXJfbm9fYXV0aGVudGljYXRpb259'
    },
    {
      blobName: 'app-reg-public-storage.txt',
      ctf_b64: 'RkxBR3thcHBfcmVnaXN0cmF0aW9uX2NyZWRlbnRpYWxzX2luX3B1YmxpY19zdG9yYWdlfQ=='
    }
  ];

  for (const seed of seeds) {
    const content = fromB64(seed.ctf_b64);
    const blobClient = containerClient.getBlockBlobClient(seed.blobName);

    await blobClient.upload(content, Buffer.byteLength(content), {
      blobHTTPHeaders: {
        blobContentType: 'text/plain; charset=utf-8'
      }
    });

    // eslint-disable-next-line no-console
    console.log('Uploaded', seed.blobName);
  }

  // eslint-disable-next-line no-console
  console.log('Done. Container:', containerName);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed:', err);
  process.exitCode = 1;
});
