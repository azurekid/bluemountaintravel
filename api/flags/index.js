const { listBlobNames } = require('../shared/blob');

const CONTAINER = process.env.SECRETS_CONTAINER || 'secrets';

module.exports = async function (context, req) {
  try {
    const names = await listBlobNames(CONTAINER);

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
        count: names.length,
        blobs: names
      })
    };
  } catch (err) {
    context.log.error('flags list error:', err);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'error',
        message: err.message
      })
    };
  }
};
