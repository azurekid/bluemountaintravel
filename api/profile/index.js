const sql = require('mssql');

function buildConfig() {
    const connectionString = process.env.SQL_CONNECTION_STRING;
    if (connectionString) {
        return { connectionString };
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
        options: {
            encrypt: true,
            trustServerCertificate: false
        }
    };
}

module.exports = async function (context, req) {
    context.log('Profile API called');

    const email = req.query.email;
    if (!email) {
        context.res = {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Email parameter is required' })
        };
        return;
    }

    const cfg = buildConfig();
    try {
        context.log('Profile DB config', {
            usingConnectionString: !!cfg.connectionString,
            server: cfg.server,
            database: cfg.database,
            userConfigured: !!cfg.user
        });
    } catch (_) {}

    try {
        await sql.connect(cfg);

        const result = await sql.query`
            SELECT 
                u.UserID, u.Email, u.FirstName, u.LastName, u.Phone, 
                u.DateOfBirth, u.Address, u.City, u.State, u.ZipCode, 
                u.Country, u.MembershipTier, u.CreatedDate, u.LastLoginDate,
                p.PassportID, p.PassportNumber, p.IssuingCountry, p.Nationality,
                p.Surname, p.GivenNames, p.Sex, p.PlaceOfBirth,
                p.DateOfIssue, p.DateOfExpiry, p.IssuingAuthority, p.PlaceOfIssue,
                p.BlobStorageURL as PassportDocumentURL, p.PhotoURL as PassportPhotoURL
            FROM Users u
            LEFT JOIN Passports p ON u.UserID = p.UserID
            WHERE u.Email = ${email} AND u.IsActive = 1
        `;

        if (result.recordset.length === 0) {
            context.res = {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'User not found' })
            };
            return;
        }

        const userData = result.recordset[0];
        const profile = {
            userId: userData.UserID,
            email: userData.Email,
            firstName: userData.FirstName,
            lastName: userData.LastName,
            phone: userData.Phone,
            dateOfBirth: userData.DateOfBirth,
            address: userData.Address,
            city: userData.City,
            state: userData.State,
            zipCode: userData.ZipCode,
            country: userData.Country,
            membershipTier: userData.MembershipTier,
            createdDate: userData.CreatedDate,
            lastLoginDate: userData.LastLoginDate
        };

        if (userData.PassportID) {
            profile.passport = {
                passportId: userData.PassportID,
                passportNumber: userData.PassportNumber,
                issuingCountry: userData.IssuingCountry,
                nationality: userData.Nationality,
                surname: userData.Surname,
                givenNames: userData.GivenNames,
                sex: userData.Sex,
                placeOfBirth: userData.PlaceOfBirth,
                dateOfIssue: userData.DateOfIssue,
                dateOfExpiry: userData.DateOfExpiry,
                issuingAuthority: userData.IssuingAuthority,
                placeOfIssue: userData.PlaceOfIssue,
                documentUrl: userData.PassportDocumentURL,
                photoUrl: userData.PassportPhotoURL
            };
        }

        context.log('⚠️ Returning full profile with passport data for:', email);

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(profile)
        };
    } catch (err) {
        context.log.error('Database error:', err);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Database error', details: err.message })
        };
    } finally {
        sql.close();
    }
};
