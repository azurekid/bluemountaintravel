const { listBlobNames, downloadBlobText } = require('../shared/blob');

const CONTAINER = process.env.SECRETS_CONTAINER || 'secrets';

function toBase64(value) {
  return Buffer.from(String(value ?? ''), 'utf8').toString('base64');
}

module.exports = async function (context, req) {
  try {
    const names = await listBlobNames(CONTAINER);
    if (!names.length) {
      context.res = {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'not_found', message: 'No blobs found in secrets container' })
      };
      return;
    }

    const chosen = names[Math.floor(Math.random() * names.length)];
    const text = await downloadBlobText(CONTAINER, chosen);

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
        name: chosen,
        ctf_b64: toBase64(text.trimEnd())
      })
    };
  } catch (err) {
    context.log.error('flags random error:', err);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'error', message: err.message })
    };
  }
};
