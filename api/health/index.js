let sql;
let sqlLoadError;
try {
  sql = require('mssql');
} catch (err) {
  sqlLoadError = err;
}

const { buildSqlConfig } = require('../shared/sql-config');

function buildConfig() {
  return buildSqlConfig('read');
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

    const pool = await new sql.ConnectionPool(cfg).connect();
    try {
      const result = await pool.request().query('SELECT 1 AS ok');

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
    } finally {
      try {
        await pool.close();
      } catch (_) {}
    }
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
  }
};
