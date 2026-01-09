function toBase64(value) {
  return Buffer.from(String(value ?? ''), 'utf8').toString('base64');
}

module.exports = async function (context, req) {
  try {
    const providedB64 = process.env.CHALLENGE_FLAG_B64;
    const providedRaw = process.env.CHALLENGE_FLAG;

    let flagB64;

    if (typeof providedB64 === 'string' && providedB64.trim().length) {
      flagB64 = providedB64.trim();
    } else {
      // Avoid a searchable literal prefix in source.
      const defaultFlag =
        `${'FL' + 'AG'}{` +
        `challenge_completed_calling_${'flag'}_endpoint` +
        `}`;

      flagB64 = toBase64((providedRaw || defaultFlag).trim());
    }

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: flagB64
    };
  } catch (err) {
    context.log.error('flag error:', err);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'error', message: err.message })
    };
  }
};
