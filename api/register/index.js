const sql = require('mssql');

let poolPromise;

function buildConfig() {
  const connectionString = process.env.SQL_CONNECTION_STRING;
  if (connectionString) {
    return { connectionString };
  }

  const server = process.env.SQL_SERVER || 'bluemountaintravel-sql.database.windows.net';
  const database = process.env.SQL_DB || 'TravelDB';
  const user = process.env.SQL_USER || 'admin';
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
    const { email, password, firstName, lastName, phone } = req.body || {};

    if (!email || !password || !firstName || !lastName) {
      context.res = {
        status: 400,
        body: { error: 'Email, password, firstName, and lastName are required' }
      };
      return;
    }

    const pool = await getPool();

    // Check if user already exists
    const checkRequest = pool.request();
    checkRequest.input('email', sql.VarChar, email);
    const existingUser = await checkRequest.query('SELECT UserID FROM Users WHERE Email = @email');

    if (existingUser.recordset.length > 0) {
      context.res = {
        status: 400,
        body: { error: 'User with this email already exists' }
      };
      return;
    }

    // Generate UserID
    const idRequest = pool.request();
    const idResult = await idRequest.query('SELECT MAX(CAST(SUBSTRING(UserID, 4, 3) AS INT)) as MaxId FROM Users');
    const nextId = (idResult.recordset[0].MaxId || 0) + 1;
    const userId = `USR${String(nextId).padStart(3, '0')}`;

    // Insert new user (⚠️ stores plain text password)
    const insertRequest = pool.request();
    insertRequest.input('userId', sql.VarChar, userId);
    insertRequest.input('email', sql.VarChar, email);
    insertRequest.input('password', sql.VarChar, password);
    insertRequest.input('firstName', sql.VarChar, firstName);
    insertRequest.input('lastName', sql.VarChar, lastName);
    insertRequest.input('phone', sql.VarChar, phone || '+1-555-0000');

    await insertRequest.query(
      `INSERT INTO Users (UserID, Email, PasswordHash, FirstName, LastName, Phone, CreatedDate, IsActive)
       VALUES (@userId, @email, @password, @firstName, @lastName, @phone, GETDATE(), 1)`
    );

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { success: true, userId, message: 'User registered successfully' }
    };
  } catch (err) {
    context.log('Register function error', err);
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
};
