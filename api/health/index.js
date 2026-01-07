let sql;
let sqlLoadError;
try {
  sql = require('mssql');
} catch (err) {
  sqlLoadError = err;
}

function buildConfig() {
  const connectionString = process.env.SQL_CONNECTION_STRING;
  if (connectionString) {
    return connectionString;
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
  if (sqlLoadError) {
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'error',
        message: 'mssql module not loaded: ' + sqlLoadError.message
      })
    };
    return;
  }

  const cfg = buildConfig();
  try {
    const usingConnectionString = typeof cfg === 'string';
    context.log('Health check: connecting to SQL', {
      usingConnectionString,
      server: usingConnectionString ? null : cfg.server,
      database: usingConnectionString ? null : cfg.database,
      userConfigured: usingConnectionString ? null : !!cfg.user
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
        server: usingConnectionString ? 'connectionString' : cfg.server,
        database: usingConnectionString ? null : cfg.database,
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
