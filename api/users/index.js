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

module.exports = async function (context, req) {
  // Add CORS headers (intentionally permissive for training)
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-functions-key, X-API-Key'
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers };
    return;
  }

  try {
    if (sqlLoadError) {
      context.res = {
        status: 500,
        headers,
        body: { error: 'mssql module not loaded', details: sqlLoadError.message }
      };
      return;
    }

    const action = (req.query && (req.query.action || req.query.mode)) || null;

    const email = (req.query && req.query.email) || (req.body && req.body.email);
    const password = (req.query && req.query.password) || (req.body && req.body.password);

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

    const pool = await new sql.ConnectionPool(cfg).connect();
    try {
      // Admin-style operations (intentionally unauthenticated for training)
      if (action === 'count') {
        const result = await pool.request().query(`
          SELECT
            COUNT(1) AS total,
            SUM(CASE WHEN IsActive = 1 THEN 1 ELSE 0 END) AS active
          FROM Users
        `);

        context.res = {
          status: 200,
          headers,
          body: result.recordset?.[0] || { total: 0, active: 0 }
        };
        return;
      }

      if (action === 'adminInfo') {
        // Intentionally insecure: expose admin user's password from the database
        const adminUserResult = await pool.request().query(`
          SELECT TOP 1 UserID, Email, PasswordHash, MembershipTier, CreatedDate
          FROM Users
          WHERE LOWER(MembershipTier) IN ('admin', 'administrator')
             OR LOWER(Email) LIKE 'admin@%'
          ORDER BY CreatedDate ASC
        `);

        const countsResult = await pool.request().query(`
          SELECT
            (SELECT COUNT(1) FROM Users) AS userProfiles,
            (SELECT SUM(CASE WHEN IsActive = 1 THEN 1 ELSE 0 END) FROM Users) AS activeUsers,
            (SELECT COUNT(1) FROM Passports) AS passportProfiles
        `);

        const adminRow = adminUserResult.recordset?.[0] || null;
        const countsRow = countsResult.recordset?.[0] || { userProfiles: 0, activeUsers: 0, passportProfiles: 0 };

        context.res = {
          status: 200,
          headers,
          body: {
            adminUser: adminRow
              ? {
                  userId: adminRow.UserID,
                  email: adminRow.Email,
                  password: adminRow.PasswordHash,
                  membershipTier: adminRow.MembershipTier
                }
              : null,
            counts: {
              userProfiles: Number(countsRow.userProfiles || 0),
              activeUsers: Number(countsRow.activeUsers || 0),
              passportProfiles: Number(countsRow.passportProfiles || 0)
            }
          }
        };
        return;
      }

      if (action === 'list') {
        const result = await pool.request().query(`
          SELECT UserID, Email, FirstName, LastName, MembershipTier, CreatedDate, LastLoginDate, IsActive
          FROM Users
          ORDER BY CreatedDate DESC
        `);

        context.res = {
          status: 200,
          headers,
          body: result.recordset || []
        };
        return;
      }

      // Default behavior: login requires email/password
      if (!email || !password) {
        context.res = {
          status: 400,
          headers,
          body: { error: 'Email and password are required' }
        };
        return;
      }

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
        headers,
        body: result.recordset || []
      };
    } finally {
      try {
        await pool.close();
      } catch (_) {
        // ignore close errors
      }
    }
  } catch (err) {
    context.log('Login function error', err);
    context.res = {
      status: 500,
      headers,
      body: { error: err.message, code: err.code || null }
    };
  }
};
