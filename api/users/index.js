let sql;
let sqlLoadError;
try {
  sql = require('mssql');
} catch (err) {
  sqlLoadError = err;
}

let poolPromise;

function buildConfig() {
  const connectionString = process.env.SQL_CONNECTION_STRING;
  if (connectionString) {
    return connectionString; // mssql supports passing a connection string directly
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
    port: 1433,
    options: {
      encrypt: true,
      trustServerCertificate: false
    }
  };
}

async function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(buildConfig());
  }
  return poolPromise;
}

module.exports = async function (context, req) {
  try {
    if (sqlLoadError) {
      context.res = {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'mssql module not loaded', details: sqlLoadError.message }
      };
      return;
    }

    const email = (req.query && req.query.email) || (req.body && req.body.email);
    const password = (req.query && req.query.password) || (req.body && req.body.password);

    if (!email || !password) {
      context.res = {
        status: 400,
        body: { error: 'Email and password are required' }
      };
      return;
    }

    // Basic diagnostics (logs only)
    const cfg = buildConfig();
    const usingConnectionString = typeof cfg === 'string';
    try {
      context.log('Login attempt', {
        email,
        usingConnectionString,
        server: usingConnectionString ? null : cfg.server,
        database: usingConnectionString ? null : cfg.database,
        userConfigured: usingConnectionString ? null : !!cfg.user
      });
    } catch (_) {
      // Ignore logging errors
    }

    const pool = await getPool();
    const request = pool.request();
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, password);

    // Use trimmed/case-insensitive email match and trimmed password to avoid whitespace/collation surprises
    const result = await request.query(`
      SELECT *
      FROM Users
      WHERE LTRIM(RTRIM(LOWER(Email))) = LTRIM(RTRIM(LOWER(@email)))
        AND LTRIM(RTRIM(PasswordHash)) = LTRIM(RTRIM(@password))
        AND IsActive = 1
    `);

    context.log('Login query executed', { rows: result?.recordset?.length || 0 });

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: result.recordset || []
    };
  } catch (err) {
    context.log('Login function error', err);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: { error: err.message }
    };
  }
};
