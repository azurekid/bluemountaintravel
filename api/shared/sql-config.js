function buildSqlConfig(access = 'read') {
  // Backward compatible defaults
  // - Prefer per-access connection strings / credentials when provided
  // - Fall back to existing SQL_CONNECTION_STRING / SQL_USER / SQL_PASSWORD

  const normalizedAccess = (access || 'read').toString().toLowerCase();
  const wantsWrite = normalizedAccess === 'write' || normalizedAccess === 'rw' || normalizedAccess === 'readwrite';

  const connectionString = wantsWrite
    ? (process.env.SQL_CONNECTION_STRING_WRITE || process.env.SQL_CONNECTION_STRING)
    : (process.env.SQL_CONNECTION_STRING_READ || process.env.SQL_CONNECTION_STRING);

  if (connectionString) {
    return connectionString; // mssql supports passing a connection string directly
  }

  const server = process.env.SQL_SERVER || 'bluemountaintravel-sql.database.windows.net';
  const database = process.env.SQL_DB || 'TravelDB';

  const user = wantsWrite
    ? (process.env.SQL_USER_WRITE || process.env.SQL_USER || 'dbadmin')
    : (process.env.SQL_USER_READ || process.env.SQL_USER || 'dbadmin');

  const password = wantsWrite
    ? (process.env.SQL_PASSWORD_WRITE || process.env.SQL_PASSWORD || 'P@ssw0rd123!')
    : (process.env.SQL_PASSWORD_READ || process.env.SQL_PASSWORD || 'P@ssw0rd123!');

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

module.exports = {
  buildSqlConfig
};
