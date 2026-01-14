function buildSqlConfig(access = 'read') {
  // Backward compatible defaults
  // - Prefer per-access connection strings / credentials when provided
  // - Fall back to existing SQL_CONNECTION_STRING / SQL_USER / SQL_PASSWORD

  // Treat common placeholder values as "unset" so local.settings.json templates
  // don't accidentally break connectivity.
  const readEnv = (name) => {
    const raw = process.env[name];
    if (raw === undefined || raw === null) return undefined;
    const value = String(raw).trim();
    if (!value) return undefined;
    if (value.toUpperCase() === 'REPLACE_ME') return undefined;
    return value;
  };

  const normalizedAccess = (access || 'read').toString().toLowerCase();
  const wantsWrite = normalizedAccess === 'write' || normalizedAccess === 'rw' || normalizedAccess === 'readwrite';

  const connectionString = wantsWrite
    ? (readEnv('SQL_CONNECTION_STRING_WRITE') || readEnv('SQL_CONNECTION_STRING'))
    : (readEnv('SQL_CONNECTION_STRING_READ') || readEnv('SQL_CONNECTION_STRING'));

  if (connectionString) {
    return connectionString; // mssql supports passing a connection string directly
  }

  const server = readEnv('SQL_SERVER') || 'bluemountaintravel-sql.database.windows.net';
  const database = readEnv('SQL_DB') || 'TravelDB';

  // Only use per-access credentials when BOTH user+password are set.
  const userRead = readEnv('SQL_USER_READ');
  const passwordRead = readEnv('SQL_PASSWORD_READ');
  const userWrite = readEnv('SQL_USER_WRITE');
  const passwordWrite = readEnv('SQL_PASSWORD_WRITE');

  const fallbackUser = readEnv('SQL_USER') || 'dbadmin';
  const fallbackPassword = readEnv('SQL_PASSWORD') || 'P@ssw0rd123!';

  const user = wantsWrite
    ? ((userWrite && passwordWrite) ? userWrite : fallbackUser)
    : ((userRead && passwordRead) ? userRead : fallbackUser);

  const password = wantsWrite
    ? ((userWrite && passwordWrite) ? passwordWrite : fallbackPassword)
    : ((userRead && passwordRead) ? passwordRead : fallbackPassword);

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
