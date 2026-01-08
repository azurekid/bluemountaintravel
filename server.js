// Blue Mountain Travel - Backend Server
// ⚠️ WARNING: This server contains INTENTIONAL security vulnerabilities for training purposes

const express = require('express');
const sql = require('mssql');
const { BlobServiceClient } = require('@azure/storage-blob');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ VULNERABILITY: Exposed database credentials in code
const dbConfig = {
    server: process.env.DB_SERVER || 'bluemountaintravel.database.windows.net',
    database: process.env.DB_NAME || 'TravelDB',
    user: process.env.DB_USER || 'dbadmin',
    password: process.env.DB_PASSWORD || 'P@ssw0rd123!',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// ⚠️ VULNERABILITY: Exposed Azure Storage credentials
const storageAccountName = process.env.STORAGE_ACCOUNT || 'bluemountaintravel';
const sasToken = process.env.SAS_TOKEN || '?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D';

// Middleware
app.use(cors()); // ⚠️ VULNERABILITY: Allow all origins
app.use(express.json());
app.use(express.static('public'));

// ⚠️ VULNERABILITY: Log all requests with sensitive data
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Database connection pool
let pool;

// ⚠️ VULNERABILITY: In-memory user storage as fallback (insecure)
let inMemoryUsers = [];

// Initialize database connection
async function initializeDatabase() {
    try {
        pool = await sql.connect(dbConfig);
        console.log('Connected to Azure SQL Database');
        
        // ⚠️ VULNERABILITY: Log connection details
        console.log('Database:', dbConfig.database);
        console.log('Server:', dbConfig.server);
        
        return pool;
    } catch (err) {
        console.error('Database connection error:', err);
        console.log('⚠️ Using in-memory storage as fallback');
        // Continue without database for demo purposes
        return null;
    }
}

// ⚠️ VULNERABILITY: SQL Injection - Direct string concatenation
app.get('/api/users', async (req, res) => {
    try {
        const { email, password } = req.query;
        
        if (!pool) {
            // ⚠️ VULNERABILITY: Fallback to in-memory storage
            console.log('Using in-memory user storage');
            let users = inMemoryUsers;
            
            if (email || password) {
                users = users.filter(user => {
                    let match = true;
                    if (email && user.Email !== email) {
                        match = false;
                    }
                    if (password && user.PasswordHash !== password) {
                        match = false;
                    }
                    return match;
                });
            }
            
            console.log('Found users:', users.length);
            return res.json(users);
        }
        
        // ⚠️ VULNERABILITY: SQL Injection vulnerability
        let query = 'SELECT * FROM Users';
        if (email || password) {
            query += ' WHERE 1=1';
            if (email) {
                query += ` AND Email = '${email}'`;
            }
            if (password) {
                query += ` AND PasswordHash = '${password}'`;
            }
        }
        
        console.log('Executing query:', query); // ⚠️ VULNERABILITY: Log SQL queries
        
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        // ⚠️ VULNERABILITY: Expose detailed error messages
        res.status(500).json({ 
            error: err.message,
            stack: err.stack,
            query: req.url
        });
    }
});

// ⚠️ VULNERABILITY: No authentication required
app.get('/api/flights', async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Database not connected' });
        }
        
        const { from, to } = req.query;
        
        // ⚠️ VULNERABILITY: SQL Injection vulnerability
        let query = 'SELECT * FROM Flights WHERE 1=1';
        if (from) {
            query += ` AND DepartureAirport LIKE '%${from}%'`;
        }
        if (to) {
            query += ` AND ArrivalAirport LIKE '%${to}%'`;
        }
        
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// ⚠️ VULNERABILITY: No authentication required
app.get('/api/hotels', async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Database not connected' });
        }
        
        const { city } = req.query;
        
        // ⚠️ VULNERABILITY: SQL Injection vulnerability
        let query = 'SELECT * FROM Hotels';
        if (city) {
            query += ` WHERE City LIKE '%${city}%'`;
        }
        
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// ⚠️ VULNERABILITY: No authentication, stores passwords in plain text
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        
        if (!pool) {
            // ⚠️ VULNERABILITY: Fallback to in-memory storage
            console.log('Using in-memory user storage for registration');
            
            // Check if user already exists
            const existingUser = inMemoryUsers.find(u => u.Email === email);
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }
            
            // Generate UserID
            const nextId = inMemoryUsers.length + 1;
            const userId = `USR${String(nextId).padStart(3, '0')}`;
            
            // ⚠️ VULNERABILITY: Store password in plain text
            const newUser = {
                UserID: userId,
                Email: email,
                PasswordHash: password,
                FirstName: firstName,
                LastName: lastName,
                Phone: phone || '+1-555-0000',
                CreatedDate: new Date().toISOString(),
                IsActive: 1
            };
            
            inMemoryUsers.push(newUser);
            
            console.log('User registered:', newUser);
            console.log('⚠️ Password stored in plain text:', password);
            
            return res.json({ 
                success: true, 
                userId,
                message: 'User registered successfully'
            });
        }
        
        // Generate UserID
        const userIdQuery = 'SELECT MAX(CAST(SUBSTRING(UserID, 4, 3) AS INT)) as MaxId FROM Users';
        const idResult = await pool.request().query(userIdQuery);
        const nextId = (idResult.recordset[0].MaxId || 0) + 1;
        const userId = `USR${String(nextId).padStart(3, '0')}`;
        
        // ⚠️ VULNERABILITY: Store password in plain text
        const insertQuery = `
            INSERT INTO Users (UserID, Email, PasswordHash, FirstName, LastName, Phone, CreatedDate, IsActive)
            VALUES ('${userId}', '${email}', '${password}', '${firstName}', '${lastName}', '${phone}', GETDATE(), 1)
        `;
        
        console.log('Executing:', insertQuery); // ⚠️ VULNERABILITY
        
        await pool.request().query(insertQuery);
        
        res.json({ 
            success: true, 
            userId,
            message: 'User registered successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// ⚠️ VULNERABILITY: No authentication required, IDOR vulnerability
app.get('/api/bookings/:userId', async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Database not connected' });
        }
        
        const { userId } = req.params;
        
        // ⚠️ VULNERABILITY: No authorization check, anyone can access any user's bookings
        const query = `SELECT * FROM Bookings WHERE UserID = '${userId}'`;
        
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// ⚠️ VULNERABILITY: Create booking without authentication
app.post('/api/bookings', async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Database not connected' });
        }
        
        const { userId, bookingType, flightId, hotelId, travelDate, returnDate, totalAmount } = req.body;
        
        // Generate BookingID
        const bookingId = `${bookingType === 'flight' ? 'BK' : 'HB'}${Date.now()}`;
        const confirmationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        
        // ⚠️ VULNERABILITY: SQL Injection
        const insertQuery = `
            INSERT INTO Bookings (BookingID, UserID, BookingType, FlightID, HotelID, BookingDate, TravelDate, ReturnDate, TotalAmount, Status, ConfirmationCode)
            VALUES ('${bookingId}', '${userId}', '${bookingType}', ${flightId ? `'${flightId}'` : 'NULL'}, ${hotelId ? `'${hotelId}'` : 'NULL'}, GETDATE(), '${travelDate}', ${returnDate ? `'${returnDate}'` : 'NULL'}, ${totalAmount}, 'Confirmed', '${confirmationCode}')
        `;
        
        await pool.request().query(insertQuery);
        
        res.json({
            success: true,
            bookingId,
            confirmationCode,
            message: 'Booking created successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// ⚠️ VULNERABILITY: Expose all environment variables and configuration
app.get('/api/config', (req, res) => {
    res.json({
        database: {
            server: dbConfig.server,
            database: dbConfig.database,
            user: dbConfig.user,
            password: dbConfig.password // ⚠️ CRITICAL: Exposing password
        },
        storage: {
            accountName: storageAccountName,
            sasToken: sasToken // ⚠️ CRITICAL: Exposing SAS token
        },
        environment: process.env // ⚠️ CRITICAL: Exposing all env vars
    });
});

// ⚠️ VULNERABILITY: Allow arbitrary SQL execution
app.post('/api/execute', async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Database not connected' });
        }
        
        const { query } = req.body;
        
        console.log('Executing arbitrary query:', query); // ⚠️ VULNERABILITY
        
        // ⚠️ CRITICAL VULNERABILITY: Execute any SQL query
        const result = await pool.request().query(query);
        
        res.json({
            success: true,
            recordset: result.recordset,
            rowsAffected: result.rowsAffected
        });
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'running',
        database: pool ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`⚠️  WARNING: This server contains intentional security vulnerabilities!`);
    console.log(`📊 Database: ${dbConfig.server}/${dbConfig.database}`);
    console.log(`🔑 User: ${dbConfig.user} / Password: ${dbConfig.password}`);
    console.log(`☁️  Storage: ${storageAccountName}`);
    
    // Initialize database connection
    await initializeDatabase();
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    if (pool) {
        await pool.close();
    }
    process.exit(0);
});
