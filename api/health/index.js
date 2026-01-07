const sql = require('mssql');

function buildConfig() {
  const connectionString = process.env.SQL_CONNECTION_STRING;
  if (connectionString) {
    return { connectionString };
  }
  const server = process.env.SQL_SERVER || 'bluemountaintravel-sql.database.windows.net';
  const database = process.env.SQL_DB || 'TravelDB';
  const user = process.env.SQL_USER || 'dbadmin';
  const password = process.env.SQL_PASSWORD || 'P@ssw0rd123!';

  return {
    server,
    database,
    user,
    password,
    options: {
      encrypt: true,
      trustServerCertificate: false
    }
  };
}

module.exports = async function (context, req) {
  const cfg = buildConfig();
  try {
    context.log('Health check: connecting to SQL', {
      usingConnectionString: !!cfg.connectionString,
      server: cfg.server,
      database: cfg.database,
      userConfigured: !!cfg.user
    });

    await sql.connect(cfg);
    const result = await sql.query('SELECT 1 AS ok');

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        status: 'ok',
        server: cfg.server || 'connectionString',
        database: cfg.database || null,
        time: new Date().toISOString(),
        ok: result?.recordset?.[0]?.ok === 1
      })
    };
  } catch (err) {
    context.log.error('Health check error:', err);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'error',
        message: err.message,
        code: err.code || null
      })
    };
  } finally {
    sql.close();
  }
};
