-- Blue Mountain Travel - Sample Data Seed Script
-- ⚠️ WARNING: This data is intentionally insecure for training purposes
-- Contains plain text passwords, realistic but fake PII data

-- ============================================
-- USERS - Realistic sample users
-- ============================================
INSERT INTO Users (UserID, Email, PasswordHash, FirstName, LastName, Phone, DateOfBirth, Address, City, State, ZipCode, Country, MembershipTier, CreatedDate, IsActive)
VALUES
('USR001', 'john.smith@techcorp.com', 'password123', 'John', 'Smith', '+1-555-0123', '1985-03-15', '123 Main St', 'New York', 'NY', '10001', 'USA', 'Platinum', '2023-01-15', 1),
('USR002', 'sarah.johnson@globalind.com', 'Sarah@2024', 'Sarah', 'Johnson', '+1-555-0234', '1990-07-22', '456 Oak Ave', 'Chicago', 'IL', '60601', 'USA', 'Gold', '2023-02-20', 1),
('USR003', 'michael.chen@innovlab.io', 'Chen#2024', 'Michael', 'Chen', '+1-555-0345', '1988-11-30', '789 Tech Blvd', 'San Francisco', 'CA', '94102', 'USA', 'Diamond', '2023-03-10', 1),
('USR004', 'emma.williams@stratcon.com', 'Emma!Williams99', 'Emma', 'Williams', '+1-555-0456', '1992-05-18', '321 Corporate Dr', 'Boston', 'MA', '02101', 'USA', 'Platinum', '2023-04-05', 1),
('USR005', 'david.martinez@invbank.com', 'DavidM@rtinez2024', 'David', 'Martinez', '+1-555-0567', '1987-09-25', '555 Wall St', 'New York', 'NY', '10005', 'USA', 'Gold', '2023-05-12', 1),
('USR006', 'lisa.anderson@medtech.com', 'Lisa2024Pass!', 'Lisa', 'Anderson', '+1-555-0678', '1991-02-14', '234 Health Plaza', 'Seattle', 'WA', '98101', 'USA', 'Silver', '2023-06-18', 1),
('USR007', 'robert.brown@lawfirm.com', 'RobertB#2024', 'Robert', 'Brown', '+1-555-0789', '1983-12-08', '678 Justice Ave', 'Washington', 'DC', '20001', 'USA', 'Platinum', '2023-07-22', 1),
('USR008', 'jennifer.davis@edu.edu', 'JenDavis2024!', 'Jennifer', 'Davis', '+1-555-0890', '1989-08-19', '890 Campus Dr', 'Austin', 'TX', '78701', 'USA', 'Gold', '2023-08-30', 1),
('USR009', 'james.wilson@startup.io', 'JamesW!2024', 'James', 'Wilson', '+1-555-0901', '1993-04-27', '123 Innovation St', 'Denver', 'CO', '80201', 'USA', 'Silver', '2023-09-15', 1),
('USR010', 'maria.garcia@retail.com', 'Maria@Garcia24', 'Maria', 'Garcia', '+1-555-1012', '1986-06-11', '456 Market St', 'Miami', 'FL', '33101', 'USA', 'Gold', '2023-10-08', 1),
('ADMIN001', 'admin@bluemountaintravel.com', 'Admin@BlueMountain2024!', 'System', 'Administrator', '+1-555-9999', '1980-01-01', '1 Blue Mountain Plaza', 'Seattle', 'WA', '98101', 'USA', 'Admin', '2022-01-01', 1);
GO

-- ============================================
-- FLIGHTS - Realistic flight inventory
-- ============================================
INSERT INTO Flights (FlightID, Airline, FlightNumber, DepartureAirport, ArrivalAirport, DepartureTime, ArrivalTime, Duration, Class, Price, Currency, AvailableSeats, Status)
VALUES
-- North America to Europe
('FL001', 'Delta Airlines', 'DL1234', 'JFK', 'LHR', '08:00', '20:30', '7h 30m', 'Business', 749.00, 'USD', 12, 'Active'),
('FL002', 'American Airlines', 'AA9012', 'ORD', 'CDG', '17:00', '07:00', '8h 00m', 'Business', 699.00, 'USD', 15, 'Active'),
('FL003', 'United Airlines', 'UA3456', 'SFO', 'LHR', '14:00', '10:00', '10h 00m', 'Business', 829.00, 'USD', 8, 'Active'),
('FL004', 'Lufthansa', 'LH6789', 'LAX', 'FRA', '15:00', '11:00', '11h 00m', 'Business', 899.00, 'USD', 10, 'Active'),
('FL005', 'British Airways', 'BA1890', 'BOS', 'LHR', '21:00', '09:00', '6h 30m', 'Business', 679.00, 'USD', 14, 'Active'),

-- North America to Asia
('FL006', 'United Airlines', 'UA5678', 'SFO', 'NRT', '11:00', '14:30', '11h 30m', 'Business', 999.00, 'USD', 8, 'Active'),
('FL007', 'Singapore Airlines', 'SQ1122', 'SFO', 'SIN', '23:30', '07:00', '16h 30m', 'Business', 1099.00, 'USD', 6, 'Active'),
('FL008', 'ANA', 'NH7890', 'LAX', 'NRT', '13:00', '17:30', '11h 30m', 'Business', 989.00, 'USD', 11, 'Active'),
('FL009', 'Cathay Pacific', 'CX8801', 'JFK', 'HKG', '01:30', '05:30', '15h 45m', 'Business', 1149.00, 'USD', 7, 'Active'),
('FL010', 'Korean Air', 'KE082', 'LAX', 'ICN', '11:00', '17:00', '13h 00m', 'Business', 1029.00, 'USD', 9, 'Active'),

-- North America to Middle East
('FL011', 'Emirates', 'EK2345', 'JFK', 'DXB', '22:30', '19:00', '12h 30m', 'First Class', 1299.00, 'USD', 4, 'Active'),
('FL012', 'Qatar Airways', 'QR701', 'LAX', 'DOH', '16:00', '20:00', '16h 00m', 'Business', 1249.00, 'USD', 5, 'Active'),

-- Europe to Asia
('FL013', 'British Airways', 'BA0009', 'LHR', 'SIN', '22:00', '17:30', '13h 30m', 'Business', 1089.00, 'USD', 8, 'Active'),
('FL014', 'Lufthansa', 'LH716', 'FRA', 'NRT', '13:30', '08:30', '11h 00m', 'Business', 1049.00, 'USD', 10, 'Active'),
('FL015', 'Air France', 'AF292', 'CDG', 'HKG', '23:00', '17:30', '12h 30m', 'Business', 1069.00, 'USD', 7, 'Active'),

-- US Domestic
('FL016', 'Delta Airlines', 'DL2891', 'JFK', 'LAX', '07:00', '10:30', '5h 30m', 'First Class', 599.00, 'USD', 16, 'Active'),
('FL017', 'United Airlines', 'UA1545', 'ORD', 'SFO', '08:30', '11:00', '4h 30m', 'Business', 449.00, 'USD', 20, 'Active'),
('FL018', 'American Airlines', 'AA2134', 'MIA', 'JFK', '06:00', '09:00', '3h 00m', 'Business', 349.00, 'USD', 18, 'Active'),
('FL019', 'JetBlue', 'B6618', 'BOS', 'SFO', '09:00', '12:30', '6h 30m', 'Business', 479.00, 'USD', 12, 'Active'),
('FL020', 'Southwest', 'WN1234', 'DEN', 'LAX', '10:00', '11:30', '2h 30m', 'Economy', 199.00, 'USD', 45, 'Active');
GO

-- ============================================
-- HOTELS - Realistic hotel inventory
-- ============================================
INSERT INTO Hotels (HotelID, Name, Location, Address, City, Country, Rating, PricePerNight, Currency, Description, Amenities, AvailableRooms)
VALUES
('HT001', 'Grand Hyatt New York', 'New York, USA', '109 E 42nd St', 'New York', 'USA', 5.0, 299.00, 'USD', 
'Luxurious midtown Manhattan hotel with stunning city views and world-class amenities.', 
'WiFi,Breakfast,Gym,Pool,Business Center,Spa,Restaurant,Bar,Valet Parking,Room Service', 45),

('HT002', 'The Ritz-Carlton London', 'London, UK', '150 Piccadilly', 'London', 'UK', 5.0, 399.00, 'USD',
'Iconic luxury hotel in Piccadilly offering quintessential British elegance and service.',
'WiFi,Breakfast,Spa,Concierge,Restaurant,Bar,Afternoon Tea,Fitness Center', 38),

('HT003', 'Park Hyatt Tokyo', 'Tokyo, Japan', '3-7-1-2 Nishi Shinjuku, Shinjuku-ku', 'Tokyo', 'Japan', 5.0, 449.00, 'USD',
'Sophisticated hotel in Shinjuku with breathtaking city views and Japanese-inspired design.',
'WiFi,Breakfast,Gym,City View,Spa,Pool,Restaurant,Bar,Library', 42),

('HT004', 'Four Seasons George V', 'Paris, France', '31 Avenue George V', 'Paris', 'France', 5.0, 499.00, 'USD',
'Historic palace hotel steps from the Champs-Élysées with three Michelin-starred restaurants.',
'WiFi,Breakfast,Spa,Restaurant,Bar,Concierge,Michelin Dining,Art Gallery', 32),

('HT005', 'Burj Al Arab Jumeirah', 'Dubai, UAE', 'Jumeirah St', 'Dubai', 'UAE', 5.0, 899.00, 'USD',
'World''s most luxurious hotel on a private island with unparalleled service and opulence.',
'WiFi,Butler Service,Private Beach,Chauffeur,Spa,Pool,Restaurant,Helipad,Jacuzzi', 28),

('HT006', 'Marina Bay Sands', 'Singapore', '10 Bayfront Ave', 'Singapore', 'Singapore', 5.0, 349.00, 'USD',
'Iconic hotel with the world''s largest rooftop infinity pool and stunning skyline views.',
'WiFi,Infinity Pool,Casino,Sky Park,Shopping,Restaurant,Bar,Spa,Conference Rooms', 52),

('HT007', 'The Peninsula Hong Kong', 'Hong Kong', 'Salisbury Rd, Tsim Sha Tsui', 'Hong Kong', 'Hong Kong', 5.0, 429.00, 'USD',
'Historic luxury hotel with Victoria Harbour views and legendary afternoon tea service.',
'WiFi,Breakfast,Spa,Rooftop Bar,Shopping Arcade,Restaurant,Afternoon Tea,Rolls Royce Fleet', 35),

('HT008', 'Mandarin Oriental Bangkok', 'Bangkok, Thailand', '48 Oriental Avenue', 'Bangkok', 'Thailand', 5.0, 289.00, 'USD',
'Legendary riverside hotel offering traditional Thai hospitality and modern luxury.',
'WiFi,Breakfast,Spa,River View,Thai Cooking Classes,Pool,Restaurant,River Shuttle', 48),

('HT009', 'The Langham Sydney', 'Sydney, Australia', '89-113 Kent St, Millers Point', 'Sydney', 'Australia', 5.0, 379.00, 'USD',
'Elegant hotel in The Rocks with stunning harbour views and refined service.',
'WiFi,Breakfast,Pool,Spa,Fine Dining,Observatory Bar,Harbor View,Fitness Center', 41),

('HT010', 'Atlantis The Palm', 'Dubai, UAE', 'Crescent Rd', 'Dubai', 'UAE', 5.0, 459.00, 'USD',
'Iconic resort on Palm Jumeirah with waterpark, aquarium and underwater suites.',
'WiFi,Breakfast,Water Park,Aquarium,Private Beach,Spa,Restaurant,Club Lounge', 55),

('HT011', 'The St. Regis New York', 'New York, USA', '2 E 55th St', 'New York', 'USA', 5.0, 549.00, 'USD',
'Legendary Beaux-Arts landmark on Fifth Avenue with unparalleled butler service.',
'WiFi,Butler Service,Fine Dining,Bar,Fitness Center,Business Services,Marble Bath', 29),

('HT012', 'Aman Tokyo', 'Tokyo, Japan', 'The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku', 'Tokyo', 'Japan', 5.0, 699.00, 'USD',
'Zen-inspired urban sanctuary occupying top floors of Otemachi Tower with spa.',
'WiFi,Spa,Fine Dining,Library,City Views,Pool,Tea Ceremony,Cigar Lounge', 26);
GO

-- ============================================
-- BOOKINGS - Realistic booking history
-- ============================================
INSERT INTO Bookings (BookingID, UserID, BookingType, FlightID, HotelID, BookingDate, TravelDate, ReturnDate, NumberOfGuests, TotalAmount, Currency, Status, ConfirmationCode, SpecialRequests)
VALUES
-- Recent bookings
('BK1704096000001', 'USR001', 'flight', 'FL001', NULL, '2024-01-15 10:30:00', '2024-02-01', '2024-02-08', 1, 749.00, 'USD', 'Confirmed', 'JFK8H2M9', 'Window seat preferred'),
('HB1704096000002', 'USR001', 'hotel', NULL, 'HT002', '2024-01-15 10:35:00', '2024-02-01', '2024-02-08', 1, 2793.00, 'USD', 'Confirmed', 'LND3K5P7', 'Late checkout if possible'),

('BK1704182400003', 'USR002', 'flight', 'FL003', NULL, '2024-01-16 14:20:00', '2024-03-15', '2024-03-22', 1, 829.00, 'USD', 'Confirmed', 'SFO9R2T4', 'Vegetarian meal'),
('HB1704182400004', 'USR002', 'hotel', NULL, 'HT002', '2024-01-16 14:25:00', '2024-03-15', '2024-03-22', 1, 2793.00, 'USD', 'Confirmed', 'LND7W8X2', 'King bed please'),

('BK1704268800005', 'USR003', 'flight', 'FL006', NULL, '2024-01-18 09:15:00', '2024-04-10', '2024-04-20', 1, 999.00, 'USD', 'Confirmed', 'TYO4N6M1', 'Aisle seat'),
('HB1704268800006', 'USR003', 'hotel', NULL, 'HT003', '2024-01-18 09:20:00', '2024-04-10', '2024-04-20', 1, 4490.00, 'USD', 'Confirmed', 'TYO2B8V5', 'High floor preferred'),

('BK1704355200007', 'USR004', 'flight', 'FL002', NULL, '2024-01-20 16:45:00', '2024-05-05', '2024-05-12', 1, 699.00, 'USD', 'Confirmed', 'PAR5Y3K9', 'Business lounge access'),
('HB1704355200008', 'USR004', 'hotel', NULL, 'HT004', '2024-01-20 16:50:00', '2024-05-05', '2024-05-12', 1, 3493.00, 'USD', 'Confirmed', 'PAR1H4L6', 'Hypoallergenic pillows'),

('BK1704441600009', 'USR005', 'flight', 'FL011', NULL, '2024-01-22 11:30:00', '2024-06-01', '2024-06-10', 1, 1299.00, 'USD', 'Confirmed', 'DXB7F2P3', 'First class lounge'),
('HB1704441600010', 'USR005', 'hotel', NULL, 'HT005', '2024-01-22 11:35:00', '2024-06-01', '2024-06-10', 1, 8091.00, 'USD', 'Confirmed', 'DXB9K5R8', 'Butler service required'),

-- Domestic travel
('BK1704528000011', 'USR006', 'flight', 'FL016', NULL, '2024-01-25 08:00:00', '2024-02-28', '2024-03-02', 1, 599.00, 'USD', 'Confirmed', 'LAX3M7N2', NULL),
('HB1704528000012', 'USR006', 'hotel', NULL, 'HT001', '2024-01-25 08:05:00', '2024-02-28', '2024-03-02', 1, 897.00, 'USD', 'Confirmed', 'NYC8P4T1', 'Early check-in'),

('BK1704614400013', 'USR007', 'flight', 'FL017', NULL, '2024-01-28 13:20:00', '2024-03-20', '2024-03-23', 1, 449.00, 'USD', 'Confirmed', 'SFO2W6K5', 'Extra legroom'),

('BK1704700800014', 'USR008', 'flight', 'FL007', NULL, '2024-02-01 10:15:00', '2024-04-15', '2024-04-25', 2, 2198.00, 'USD', 'Confirmed', 'SIN4L9M3', 'Two seats together'),
('HB1704700800015', 'USR008', 'hotel', NULL, 'HT006', '2024-02-01 10:20:00', '2024-04-15', '2024-04-25', 2, 3490.00, 'USD', 'Confirmed', 'SIN7R2Y8', 'Connecting rooms'),

('BK1704787200016', 'USR009', 'flight', 'FL018', NULL, '2024-02-03 15:40:00', '2024-03-10', NULL, 1, 349.00, 'USD', 'Confirmed', 'NYC5T8B1', 'One way ticket'),

('BK1704873600017', 'USR010', 'flight', 'FL013', NULL, '2024-02-05 09:30:00', '2024-05-20', '2024-05-30', 1, 1089.00, 'USD', 'Confirmed', 'SIN3H6K9', NULL),
('HB1704873600018', 'USR010', 'hotel', NULL, 'HT006', '2024-02-05 09:35:00', '2024-05-20', '2024-05-30', 1, 3490.00, 'USD', 'Confirmed', 'SIN1P7M4', 'Airport transfer'),

-- Past bookings (completed)
('BK1701504000019', 'USR001', 'flight', 'FL004', NULL, '2023-12-01 14:20:00', '2023-12-20', '2023-12-27', 1, 899.00, 'USD', 'Completed', 'FRA8K3L2', NULL),
('BK1701590400020', 'USR002', 'flight', 'FL019', NULL, '2023-12-05 11:15:00', '2023-12-15', NULL, 1, 479.00, 'USD', 'Completed', 'SFO4N9P7', NULL),

-- Cancelled bookings
('BK1704960000021', 'USR003', 'flight', 'FL010', NULL, '2024-02-08 16:00:00', '2024-04-01', '2024-04-08', 1, 1029.00, 'USD', 'Cancelled', 'ICN2M5T6', 'Plans changed'),
('BK1705046400022', 'USR007', 'flight', 'FL020', NULL, '2024-02-10 12:30:00', '2024-03-01', NULL, 1, 199.00, 'USD', 'Cancelled', 'LAX7B3K1', 'Found better price');
GO

-- ============================================
-- PASSPORTS - User passport information
-- ============================================
INSERT INTO Passports (PassportID, UserID, PassportNumber, IssuingCountry, Nationality, Surname, GivenNames, Sex, DateOfBirth, PlaceOfBirth, DateOfIssue, DateOfExpiry, IssuingAuthority, PlaceOfIssue, BlobStorageURL, PhotoURL)
VALUES
('PASS001', 'USR001', 'US123456789', 'United States of America', 'USA', 'SMITH', 'JOHN MICHAEL', 'M', '1985-03-15', 'Boston, Massachusetts, USA', '2022-01-15', '2032-01-14', 'U.S. Department of State', 'New York Passport Agency', 'https://bluemountaintravel.blob.core.windows.net/passports/US123456789-passport.pdf', 'https://bluemountaintravel.blob.core.windows.net/passports/US123456789-photo.jpg'),
('PASS002', 'USR002', 'US234567890', 'United States of America', 'USA', 'JOHNSON', 'SARAH ELIZABETH', 'F', '1990-07-22', 'Seattle, Washington, USA', '2021-06-10', '2031-06-09', 'U.S. Department of State', 'Chicago Passport Agency', 'https://bluemountaintravel.blob.core.windows.net/passports/US234567890-passport.pdf', 'https://bluemountaintravel.blob.core.windows.net/passports/US234567890-photo.jpg'),
('PASS003', 'USR003', 'US345678901', 'United States of America', 'USA', 'CHEN', 'MICHAEL JAMES', 'M', '1988-11-30', 'Los Angeles, California, USA', '2021-03-22', '2031-03-21', 'U.S. Department of State', 'San Francisco Passport Agency', 'https://bluemountaintravel.blob.core.windows.net/passports/US345678901-passport.pdf', 'https://bluemountaintravel.blob.core.windows.net/passports/US345678901-photo.jpg'),
('PASS004', 'USR004', 'US456789012', 'United States of America', 'USA', 'WILLIAMS', 'EMMA GRACE', 'F', '1992-05-18', 'Houston, Texas, USA', '2022-09-15', '2032-09-14', 'U.S. Department of State', 'Boston Passport Agency', 'https://bluemountaintravel.blob.core.windows.net/passports/US456789012-passport.pdf', 'https://bluemountaintravel.blob.core.windows.net/passports/US456789012-photo.jpg'),
('PASS005', 'USR005', 'US567890123', 'United States of America', 'USA', 'MARTINEZ', 'DAVID ALEJANDRO', 'M', '1987-09-25', 'Miami, Florida, USA', '2020-11-08', '2030-11-07', 'U.S. Department of State', 'Miami Passport Agency', 'https://bluemountaintravel.blob.core.windows.net/passports/US567890123-passport.pdf', 'https://bluemountaintravel.blob.core.windows.net/passports/US567890123-photo.jpg'),
('PASS006', 'USR006', 'US678901234', 'United States of America', 'USA', 'ANDERSON', 'LISA MARIE', 'F', '1991-02-14', 'Portland, Oregon, USA', '2023-04-12', '2033-04-11', 'U.S. Department of State', 'Seattle Passport Agency', 'https://bluemountaintravel.blob.core.windows.net/passports/US678901234-passport.pdf', 'https://bluemountaintravel.blob.core.windows.net/passports/US678901234-photo.jpg'),
('PASS007', 'USR007', 'US789012345', 'United States of America', 'USA', 'BROWN', 'ROBERT JAMES', 'M', '1983-12-08', 'Philadelphia, Pennsylvania, USA', '2021-08-20', '2031-08-19', 'U.S. Department of State', 'Washington DC Passport Agency', 'https://bluemountaintravel.blob.core.windows.net/passports/US789012345-passport.pdf', 'https://bluemountaintravel.blob.core.windows.net/passports/US789012345-photo.jpg'),
('PASS008', 'USR008', 'US890123456', 'United States of America', 'USA', 'DAVIS', 'JENNIFER LYNN', 'F', '1989-08-19', 'Austin, Texas, USA', '2022-07-05', '2032-07-04', 'U.S. Department of State', 'Houston Passport Agency', 'https://bluemountaintravel.blob.core.windows.net/passports/US890123456-passport.pdf', 'https://bluemountaintravel.blob.core.windows.net/passports/US890123456-photo.jpg'),
('PASS009', 'USR009', 'US901234567', 'United States of America', 'USA', 'WILSON', 'JAMES ALEXANDER', 'M', '1993-04-27', 'Denver, Colorado, USA', '2023-01-18', '2033-01-17', 'U.S. Department of State', 'Denver Passport Agency', 'https://bluemountaintravel.blob.core.windows.net/passports/US901234567-passport.pdf', 'https://bluemountaintravel.blob.core.windows.net/passports/US901234567-photo.jpg'),
('PASS010', 'USR010', 'US012345678', 'United States of America', 'USA', 'GARCIA', 'MARIA ISABEL', 'F', '1986-06-11', 'San Diego, California, USA', '2021-12-09', '2031-12-08', 'U.S. Department of State', 'Los Angeles Passport Agency', 'https://bluemountaintravel.blob.core.windows.net/passports/US012345678-passport.pdf', 'https://bluemountaintravel.blob.core.windows.net/passports/US012345678-photo.jpg');
GO

PRINT 'Sample data inserted successfully';
PRINT 'Total records:';
PRINT '  Users: 11 (including 1 admin)';
PRINT '  Flights: 20';
PRINT '  Hotels: 12';
PRINT '  Bookings: 22';
PRINT '  Passports: 10';
PRINT '';
PRINT '⚠️ WARNING: All data is intentionally vulnerable for training!';
PRINT '  - Passwords are in plain text';
PRINT '  - PII data is exposed';
PRINT '  - Passport details stored without encryption';
PRINT '  - No encryption or security controls';
