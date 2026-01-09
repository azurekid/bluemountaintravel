let BlobServiceClient;
let storageLoadError;

try {
  ({ BlobServiceClient } = require('@azure/storage-blob'));
} catch (err) {
  storageLoadError = err;
}

function getConnectionString() {
  return process.env.AzureWebJobsStorage || process.env.AZURE_STORAGE_CONNECTION_STRING;
}

function getBlobServiceClient() {
  if (storageLoadError) {
    throw storageLoadError;
  }

  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error('AzureWebJobsStorage (or AZURE_STORAGE_CONNECTION_STRING) is not configured');
  }

  return BlobServiceClient.fromConnectionString(connectionString);
}

function getContainerClient(containerName) {
  const blobServiceClient = getBlobServiceClient();
  return blobServiceClient.getContainerClient(containerName);
}

async function listBlobNames(containerName, options = {}) {
  const containerClient = getContainerClient(containerName);
  const prefix = options.prefix;

  const names = [];
  for await (const blob of containerClient.listBlobsFlat({ prefix })) {
    names.push(blob.name);
  }
  return names;
}

async function downloadBlobText(containerName, blobName) {
  const containerClient = getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const downloadResponse = await blobClient.download();
  const readable = downloadResponse.readableStreamBody;

  if (!readable) {
    return '';
  }

  return await streamToString(readable);
}

function streamToString(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
    readable.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    readable.on('error', reject);
  });
}

module.exports = {
  listBlobNames,
  downloadBlobText
};
