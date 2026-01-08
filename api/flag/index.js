const { downloadBlobText } = require('../shared/blob');

const CONTAINER = process.env.SECRETS_CONTAINER || 'secrets';

function isSafeBlobName(name) {
  // Keep this intentionally simple: no slashes or traversal.
  return typeof name === 'string' && /^[a-zA-Z0-9._-]+$/.test(name);
}

function toBase64(value) {
  return Buffer.from(String(value ?? ''), 'utf8').toString('base64');
}

module.exports = async function (context, req) {
  const name = context.bindingData?.name;

  if (!isSafeBlobName(name)) {
    context.res = {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'error', message: 'Invalid flag name' })
    };
    return;
  }

  const blobName = name.includes('.') ? name : `${name}.txt`;

  try {
    const text = await downloadBlobText(CONTAINER, blobName);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        container: CONTAINER,
        name: blobName,
        ctf_b64: toBase64(text.trimEnd())
      })
    };
  } catch (err) {
    const status = err.statusCode === 404 ? 404 : 500;
    context.log.error('flag get error:', err);
    context.res = {
      status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: status === 404 ? 'not_found' : 'error',
        message: status === 404 ? 'Flag blob not found' : err.message,
        name: blobName
      })
    };
  }
};
