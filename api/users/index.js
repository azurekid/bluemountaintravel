const sql = require('mssql');

let poolPromise;

function buildConfig() {
  const connectionString = process.env.SQL_CONNECTION_STRING;
  if (connectionString) {
    return { connectionString }; // allows full connection string usage
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
    const email = (req.query && req.query.email) || (req.body && req.body.email);
    const password = (req.query && req.query.password) || (req.body && req.body.password);

    if (!email || !password) {
      context.res = {
        status: 400,
        body: { error: 'Email and password are required' }
      };
      return;
    }

    const pool = await getPool();
    const request = pool.request();
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, password);

    const result = await request.query(
      'SELECT * FROM Users WHERE Email = @email AND PasswordHash = @password'
    );

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: result.recordset || []
    };
  } catch (err) {
    context.log('Login function error', err);
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
};
