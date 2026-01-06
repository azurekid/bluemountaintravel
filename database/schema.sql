-- Blue Mountain Travel Database Schema
-- ⚠️ WARNING: This schema is intentionally vulnerable for training purposes

-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users] (
        [UserID] VARCHAR(10) PRIMARY KEY,
        [Email] VARCHAR(255) UNIQUE NOT NULL,
        [PasswordHash] VARCHAR(255) NOT NULL, -- ⚠️ Actually stores plain text
        [FirstName] VARCHAR(50),
        [LastName] VARCHAR(50),
        [Phone] VARCHAR(20),
        [DateOfBirth] DATE,
        [Address] VARCHAR(500),
        [City] VARCHAR(100),
        [State] VARCHAR(50),
        [ZipCode] VARCHAR(20),
        [Country] VARCHAR(50),
        [MembershipTier] VARCHAR(20) DEFAULT 'Silver',
        [CreatedDate] DATETIME DEFAULT GETDATE(),
        [LastLoginDate] DATETIME,
        [IsActive] BIT DEFAULT 1
    );
END;
GO

-- Create Flights table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Flights]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Flights] (
        [FlightID] VARCHAR(10) PRIMARY KEY,
        [Airline] VARCHAR(100) NOT NULL,
        [FlightNumber] VARCHAR(20) NOT NULL,
        [DepartureAirport] VARCHAR(10) NOT NULL,
        [ArrivalAirport] VARCHAR(10) NOT NULL,
        [DepartureTime] TIME,
        [ArrivalTime] TIME,
        [Duration] VARCHAR(20),
        [Class] VARCHAR(20),
        [Price] DECIMAL(10,2),
        [Currency] VARCHAR(3) DEFAULT 'USD',
        [AvailableSeats] INT,
        [Status] VARCHAR(20) DEFAULT 'Active'
    );
END;
GO

-- Create Hotels table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Hotels]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Hotels] (
        [HotelID] VARCHAR(10) PRIMARY KEY,
        [Name] VARCHAR(200) NOT NULL,
        [Location] VARCHAR(100),
        [Address] VARCHAR(500),
        [City] VARCHAR(100),
        [Country] VARCHAR(50),
        [Rating] DECIMAL(2,1),
        [PricePerNight] DECIMAL(10,2),
        [Currency] VARCHAR(3) DEFAULT 'USD',
        [Description] TEXT,
        [Amenities] TEXT,
        [ImageURL] VARCHAR(500),
        [AvailableRooms] INT
    );
END;
GO

-- Create Bookings table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Bookings]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Bookings] (
        [BookingID] VARCHAR(20) PRIMARY KEY,
        [UserID] VARCHAR(10) NOT NULL,
        [BookingType] VARCHAR(20) NOT NULL,
        [FlightID] VARCHAR(10),
        [HotelID] VARCHAR(10),
        [BookingDate] DATETIME DEFAULT GETDATE(),
        [TravelDate] DATE,
        [ReturnDate] DATE,
        [NumberOfGuests] INT DEFAULT 1,
        [TotalAmount] DECIMAL(10,2),
        [Currency] VARCHAR(3) DEFAULT 'USD',
        [Status] VARCHAR(20) DEFAULT 'Confirmed',
        [ConfirmationCode] VARCHAR(20),
        [SpecialRequests] TEXT,
        [BlobStorageURL] VARCHAR(500),
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
    );
END;
GO

PRINT 'Database schema created successfully';
PRINT '⚠️ WARNING: This schema contains intentional security vulnerabilities!';
