let sql;
let sqlLoadError;
try {
  sql = require('mssql');
} catch (err) {
  sqlLoadError = err;
}

const { buildSqlConfig } = require('../shared/sql-config');

function buildConfig(req) {
  const access = req?.method === 'POST' ? 'write' : 'read';
  return buildSqlConfig(access);
}

module.exports = async function (context, req) {
  // Add CORS headers
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

    const cfg = buildConfig(req);
    const pool = await new sql.ConnectionPool(cfg).connect();

    try {
      if (req.method === 'GET') {
        // GET: Retrieve bookings for a user
        const userId = req.query.userId;
        
        if (!userId) {
          context.res = {
            status: 400,
            headers,
            body: { error: 'userId is required' }
          };
          return;
        }

        const request = pool.request();
        request.input('userId', sql.VarChar, userId);
        
        // ⚠️ VULNERABILITY: Returning all booking details including sensitive info
        const result = await request.query(`
          SELECT b.*, u.Email, u.FirstName, u.LastName
          FROM Bookings b
          JOIN Users u ON b.UserID = u.UserID
          WHERE b.UserID = @userId
          ORDER BY b.BookingDate DESC
        `);

        context.log('Bookings retrieved for user:', userId, 'Count:', result.recordset.length);

        context.res = {
          status: 200,
          headers,
          body: result.recordset || []
        };
      } else if (req.method === 'POST') {
        // POST: Create a new booking
        const booking = req.body;

        if (!booking || !booking.bookingId || !booking.userId) {
          context.res = {
            status: 400,
            headers,
            body: { error: 'bookingId and userId are required' }
          };
          return;
        }

        const request = pool.request();
        request.input('bookingId', sql.VarChar, booking.bookingId);
        request.input('userId', sql.VarChar, booking.userId);
        request.input('bookingType', sql.VarChar, booking.bookingType || (booking.flightId ? 'Flight' : 'Hotel'));
        request.input('flightId', sql.VarChar, booking.flightId || null);
        request.input('hotelId', sql.VarChar, booking.hotelId || null);
        request.input('travelDate', sql.Date, booking.travelDate ? new Date(booking.travelDate) : null);
        request.input('returnDate', sql.Date, booking.returnDate ? new Date(booking.returnDate) : null);
        request.input('numberOfGuests', sql.Int, booking.numberOfGuests || 1);
        request.input('totalAmount', sql.Decimal(10, 2), booking.totalAmount || booking.payment?.amount || 0);
        request.input('status', sql.VarChar, booking.status || 'Confirmed');
        request.input('confirmationCode', sql.VarChar, booking.confirmationCode || booking.bookingId);
        request.input('specialRequests', sql.Text, booking.specialRequests || null);
        request.input('blobStorageUrl', sql.VarChar, booking.documentUrl || booking.blobStorageUrl || null);

        // ⚠️ VULNERABILITY: No validation of booking data
        const result = await request.query(`
          INSERT INTO Bookings (
            BookingID, UserID, BookingType, FlightID, HotelID, 
            TravelDate, ReturnDate, NumberOfGuests, TotalAmount,
            Status, ConfirmationCode, SpecialRequests, BlobStorageURL
          ) VALUES (
            @bookingId, @userId, @bookingType, @flightId, @hotelId,
            @travelDate, @returnDate, @numberOfGuests, @totalAmount,
            @status, @confirmationCode, @specialRequests, @blobStorageUrl
          )
        `);

        context.log('Booking created:', booking.bookingId, 'for user:', booking.userId);
        context.log('Document URL stored:', booking.documentUrl);

        context.res = {
          status: 201,
          headers,
          body: { 
            success: true, 
            bookingId: booking.bookingId,
            message: 'Booking created successfully',
            documentUrl: booking.documentUrl
          }
        };
      }
    } finally {
      try {
        await pool.close();
      } catch (_) {
        // ignore close errors
      }
    }
  } catch (err) {
    context.log('Bookings function error', err);
    context.res = {
      status: 500,
      headers,
      body: { error: 'Database error', details: err.message }
    };
  }
};
