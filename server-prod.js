// server-prod.js - Production backend with CTF capabilities
const express = require('express');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const { ConnectionPool } = require('mssql');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const isCTFMode = process.env.CTF_MODE === 'true';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'", isProduction ? "https://api-bluemountain-prod.azurewebsites.net" : "http://localhost:7071"]
    }
  }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: isProduction
    ? ['https://bluemountaintravel.uk', 'https://calm-beach-041f9ca0f.2.azurestaticapps.net']
    : ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
};
app.use(cors(corsOptions));

// Rate limiting
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false
});

// General API rate limiting
app.use('/api/', createRateLimit(15 * 60 * 1000, 100, 'Too many requests'));

// Stricter rate limiting for auth endpoints
app.use('/api/auth/', createRateLimit(5 * 60 * 1000, 5, 'Too many authentication attempts'));

// Database connection management
let poolPromise;

const getDbConfig = async () => {
  if (isProduction) {
    // Use Key Vault in production
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(process.env.KEY_VAULT_URL, credential);

    const dbPassword = await client.getSecret('db-admin-password');
    const dbConnectionString = await client.getSecret('db-connection-string');

    return {
      connectionString: dbConnectionString.value,
      options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
      }
    };
  } else {
    // Development configuration
    return {
      server: process.env.DB_SERVER || 'localhost',
      database: process.env.DB_NAME || 'TravelDB',
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || 'YourStrong!Passw0rd',
      port: parseInt(process.env.DB_PORT) || 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
      }
    };
  }
};

const getConnectionPool = async () => {
  if (!poolPromise) {
    const config = await getDbConfig();
    poolPromise = new ConnectionPool(config).connect();
  }
  return poolPromise;
};

// Authentication middleware
const authenticateRequest = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret-key');

    // Verify user still exists and is active
    const pool = await getConnectionPool();
    const request = pool.request();
    request.input('userId', decoded.userId);

    const result = await request.query(
      'SELECT UserID, IsActive FROM Users WHERE UserID = @userId AND IsActive = 1'
    );

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = { ...decoded, ...result.recordset[0] };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Secure API endpoints
app.get('/api/users/:id', authenticateRequest, async (req, res) => {
  try {
    const pool = await getConnectionPool();
    const request = pool.request();
    request.input('userId', req.params.id);

    const result = await request.query(`
      SELECT UserID, Email, FirstName, LastName, MembershipTier, CreatedDate
      FROM Users
      WHERE UserID = @userId AND IsActive = 1
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/bookings', authenticateRequest, async (req, res) => {
  try {
    const pool = await getConnectionPool();
    const request = pool.request();
    request.input('userId', req.user.UserID);

    const result = await request.query(`
      SELECT b.BookingID, b.BookingType, b.TravelDate, b.ReturnDate,
             b.TotalAmount, b.Status, b.BookingDate, b.ConfirmationCode,
             f.Airline, f.FlightNumber, f.DepartureAirport, f.ArrivalAirport,
             h.Name as HotelName, h.Location as HotelLocation
      FROM Bookings b
      LEFT JOIN Flights f ON b.FlightID = f.FlightID
      LEFT JOIN Hotels h ON b.HotelID = h.HotelID
      WHERE b.UserID = @userId
      ORDER BY b.BookingDate DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CTF-specific vulnerable endpoints (intentionally insecure)
if (isCTFMode) {
  console.log('🚩 CTF Mode Enabled - Vulnerable endpoints active');

  // ⚠️ CTF VULNERABILITY: User enumeration
  app.get('/api/ctf/users', async (req, res) => {
    try {
      const pool = await getConnectionPool();
      const result = await pool.request().query('SELECT Email, FirstName, LastName FROM Users WHERE IsActive = 1');

      res.json(result.recordset);
    } catch (error) {
      console.error('CTF endpoint error:', error);
      res.status(500).json({ error: 'CTF challenge error' });
    }
  });

  // ⚠️ CTF VULNERABILITY: Password in query string + SQL injection
  app.get('/api/ctf/login', async (req, res) => {
    try {
      const { email, password } = req.query;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const pool = await getConnectionPool();
      const request = pool.request();

      // ⚠️ CTF VULNERABILITY: Direct SQL injection
      const query = `SELECT UserID, Email, FirstName, LastName FROM Users WHERE Email = '${email}' AND PasswordHash = '${password}' AND IsActive = 1`;
      console.log('CTF SQL Query:', query); // ⚠️ Logging sensitive query

      const result = await request.query(query);

      res.json(result.recordset);
    } catch (error) {
      console.error('CTF login error:', error);
      res.status(500).json({ error: 'CTF challenge error' });
    }
  });

  // ⚠️ CTF VULNERABILITY: Arbitrary SQL execution
  app.post('/api/ctf/execute', async (req, res) => {
    try {
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({ error: 'Query required' });
      }

      const pool = await getConnectionPool();
      const result = await pool.request().query(query);

      res.json(result.recordset);
    } catch (error) {
      console.error('CTF execute error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // CTF flag validation
  app.post('/api/ctf/validate', (req, res) => {
    const { flag } = req.body;

    const CTF_FLAGS = {
      'user-enumeration': 'FLAG{user_enumeration_successful}',
      'sql-injection': 'FLAG{sql_injection_mastered}',
      'arbitrary-sql': 'FLAG{database_compromised}',
      'storage-exposure': 'FLAG{azure_storage_exposed}',
      'admin-access': 'FLAG{administrator_privileges}'
    };

    for (const [challenge, correctFlag] of Object.entries(CTF_FLAGS)) {
      if (flag === correctFlag) {
        return res.json({
          valid: true,
          challenge,
          points: getPointsForChallenge(challenge)
        });
      }
    }

    res.json({ valid: false });
  });
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const pool = await getConnectionPool();
    await pool.request().query('SELECT 1 as health_check');

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: isProduction ? 'production' : 'development',
      ctfMode: isCTFMode
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);

  // Don't leak sensitive information in production
  const errorResponse = isProduction
    ? { error: 'Internal server error' }
    : { error: error.message, stack: error.stack };

  res.status(500).json(errorResponse);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (poolPromise) {
    const pool = await poolPromise;
    await pool.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  if (poolPromise) {
    const pool = await poolPromise;
    await pool.close();
  }
  process.exit(0);
});

// Helper functions
function getPointsForChallenge(challenge) {
  const pointsMap = {
    'user-enumeration': 100,
    'sql-injection': 200,
    'arbitrary-sql': 300,
    'storage-exposure': 150,
    'admin-access': 500
  };
  return pointsMap[challenge] || 0;
}

// Start server
async function startServer() {
  try {
    // Initialize database connection
    await getConnectionPool();
    console.log('Database connection established');

    app.listen(PORT, () => {
      console.log(`🚀 Blue Mountain Travel API Server running on port ${PORT}`);
      console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
      console.log(`CTF Mode: ${isCTFMode ? 'enabled' : 'disabled'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;