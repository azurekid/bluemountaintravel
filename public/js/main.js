// Blue Mountain Travel - Main JavaScript
// WARNING: This code contains intentional security vulnerabilities for training purposes

// ⚠️ VULNERABILITY: Exposed Azure Storage SAS Token
const AZURE_STORAGE_SAS_TOKEN = "?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=FakeSignatureForDemo123456789==";
const STORAGE_ACCOUNT_NAME = "bluemountaintravel";

// ⚠️ VULNERABILITY: Hardcoded API Keys
const API_CONFIG = {
    primaryKey: "fake-api-key-12345",
    secondaryKey: "fake-api-key-67890",
    endpoint: "https://bluemountaintravel.azurewebsites.net/api"
};

// ⚠️ VULNERABILITY: Database Connection String in Client Code
const DATABASE_CONFIG = {
    server: "bluemountaintravel.database.windows.net",
    database: "TravelDB",
    username: "dbadmin",  // SQL admin account name
    password: "P@ssw0rd123!",
    connectionString: "Server=tcp:bluemountaintravel.database.windows.net,1433;Initial Catalog=TravelDB;User ID=dbadmin;Password=P@ssw0rd123!;"
};

// ⚠️ VULNERABILITY: Public Blob Storage URLs
const STORAGE_URLS = {
    bookings: `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/bookings${AZURE_STORAGE_SAS_TOKEN}`,
    profiles: `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/profiles${AZURE_STORAGE_SAS_TOKEN}`,
    documents: `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/documents${AZURE_STORAGE_SAS_TOKEN}`
};

// ⚠️ VULNERABILITY: Hidden flag in comments
// FLAG{exposed_flight_data_in_client_side_code}

// Sample flight data - Expanded list with 50+ destinations
const flightData = [
    // North America to Europe
    {
        id: "FL001",
        airline: "Delta Airlines",
        flightNumber: "DL1234",
        from: "New York (JFK)",
        fromCity: "New York",
        fromCode: "JFK",
        to: "London (LHR)",
        toCity: "London",
        toCode: "LHR",
        departure: "08:00 AM",
        arrival: "08:30 PM",
        duration: "7h 30m",
        class: "Business",
        price: 749,
        availableSeats: 12
    },
    {
        id: "FL002",
        airline: "American Airlines",
        flightNumber: "AA9012",
        from: "Chicago (ORD)",
        fromCity: "Chicago",
        fromCode: "ORD",
        to: "Paris (CDG)",
        toCity: "Paris",
        toCode: "CDG",
        departure: "5:00 PM",
        arrival: "7:00 AM +1",
        duration: "8h 00m",
        class: "Business",
        price: 699,
        availableSeats: 15
    },
    {
        id: "FL003",
        airline: "United Airlines",
        flightNumber: "UA3456",
        from: "San Francisco (SFO)",
        fromCity: "San Francisco",
        fromCode: "SFO",
        to: "London (LHR)",
        toCity: "London",
        toCode: "LHR",
        departure: "2:00 PM",
        arrival: "10:00 AM +1",
        duration: "10h 00m",
        class: "Business",
        price: 829,
        availableSeats: 8
    },
    {
        id: "FL004",
        airline: "Lufthansa",
        flightNumber: "LH6789",
        from: "Los Angeles (LAX)",
        fromCity: "Los Angeles",
        fromCode: "LAX",
        to: "Frankfurt (FRA)",
        toCity: "Frankfurt",
        toCode: "FRA",
        departure: "3:00 PM",
        arrival: "11:00 AM +1",
        duration: "11h 00m",
        class: "Business",
        price: 899,
        availableSeats: 10
    },
    {
        id: "FL005",
        airline: "British Airways",
        flightNumber: "BA1890",
        from: "Boston (BOS)",
        fromCity: "Boston",
        fromCode: "BOS",
        to: "London (LHR)",
        toCity: "London",
        toCode: "LHR",
        departure: "9:00 PM",
        arrival: "9:00 AM +1",
        duration: "6h 30m",
        class: "Business",
        price: 679,
        availableSeats: 14
    },
    // North America to Asia
    {
        id: "FL006",
        airline: "United Airlines",
        flightNumber: "UA5678",
        from: "San Francisco (SFO)",
        fromCity: "San Francisco",
        fromCode: "SFO",
        to: "Tokyo (NRT)",
        toCity: "Tokyo",
        toCode: "NRT",
        departure: "11:00 AM",
        arrival: "2:30 PM +1",
        duration: "11h 30m",
        class: "Business",
        price: 999,
        availableSeats: 8
    },
    {
        id: "FL007",
        airline: "Singapore Airlines",
        flightNumber: "SQ1122",
        from: "San Francisco (SFO)",
        fromCity: "San Francisco",
        fromCode: "SFO",
        to: "Singapore (SIN)",
        toCity: "Singapore",
        toCode: "SIN",
        departure: "11:30 PM",
        arrival: "7:00 AM +2",
        duration: "16h 30m",
        class: "Business",
        price: 1099,
        availableSeats: 6
    },
    {
        id: "FL008",
        airline: "ANA",
        flightNumber: "NH7890",
        from: "Los Angeles (LAX)",
        fromCity: "Los Angeles",
        fromCode: "LAX",
        to: "Tokyo (NRT)",
        toCity: "Tokyo",
        toCode: "NRT",
        departure: "1:00 PM",
        arrival: "5:30 PM +1",
        duration: "11h 30m",
        class: "Business",
        price: 989,
        availableSeats: 11
    },
    {
        id: "FL009",
        airline: "Cathay Pacific",
        flightNumber: "CX8801",
        from: "New York (JFK)",
        fromCity: "New York",
        fromCode: "JFK",
        to: "Hong Kong (HKG)",
        toCity: "Hong Kong",
        toCode: "HKG",
        departure: "1:30 AM",
        arrival: "5:30 AM +1",
        duration: "15h 45m",
        class: "Business",
        price: 1149,
        availableSeats: 7
    },
    {
        id: "FL010",
        airline: "Korean Air",
        flightNumber: "KE082",
        from: "Los Angeles (LAX)",
        fromCity: "Los Angeles",
        fromCode: "LAX",
        to: "Seoul (ICN)",
        toCity: "Seoul",
        toCode: "ICN",
        departure: "11:00 AM",
        arrival: "5:00 PM +1",
        duration: "13h 00m",
        class: "Business",
        price: 1029,
        availableSeats: 9
    },
    // North America to Middle East
    {
        id: "FL011",
        airline: "Emirates",
        flightNumber: "EK2345",
        from: "New York (JFK)",
        fromCity: "New York",
        fromCode: "JFK",
        to: "Dubai (DXB)",
        toCity: "Dubai",
        toCode: "DXB",
        departure: "10:30 PM",
        arrival: "7:00 PM +1",
        duration: "12h 30m",
        class: "First Class",
        price: 1299,
        availableSeats: 4
    },
    {
        id: "FL012",
        airline: "Qatar Airways",
        flightNumber: "QR701",
        from: "Los Angeles (LAX)",
        fromCity: "Los Angeles",
        fromCode: "LAX",
        to: "Doha (DOH)",
        toCity: "Doha",
        toCode: "DOH",
        departure: "4:00 PM",
        arrival: "8:00 PM +1",
        duration: "16h 00m",
        class: "Business",
        price: 1249,
        availableSeats: 5
    },
    {
        id: "FL013",
        airline: "Emirates",
        flightNumber: "EK201",
        from: "San Francisco (SFO)",
        fromCity: "San Francisco",
        fromCode: "SFO",
        to: "Dubai (DXB)",
        toCity: "Dubai",
        toCode: "DXB",
        departure: "3:30 PM",
        arrival: "8:00 PM +1",
        duration: "15h 30m",
        class: "Business",
        price: 1199,
        availableSeats: 6
    },
    // Europe to Asia
    {
        id: "FL014",
        airline: "British Airways",
        flightNumber: "BA0009",
        from: "London (LHR)",
        fromCity: "London",
        fromCode: "LHR",
        to: "Singapore (SIN)",
        toCity: "Singapore",
        toCode: "SIN",
        departure: "10:00 PM",
        arrival: "5:30 PM +1",
        duration: "13h 30m",
        class: "Business",
        price: 1089,
        availableSeats: 8
    },
    {
        id: "FL015",
        airline: "Lufthansa",
        flightNumber: "LH716",
        from: "Frankfurt (FRA)",
        fromCity: "Frankfurt",
        fromCode: "FRA",
        to: "Tokyo (NRT)",
        toCity: "Tokyo",
        toCode: "NRT",
        departure: "1:30 PM",
        arrival: "8:30 AM +1",
        duration: "11h 00m",
        class: "Business",
        price: 1049,
        availableSeats: 10
    },
    {
        id: "FL016",
        airline: "Air France",
        flightNumber: "AF292",
        from: "Paris (CDG)",
        fromCity: "Paris",
        fromCode: "CDG",
        to: "Hong Kong (HKG)",
        toCity: "Hong Kong",
        toCode: "HKG",
        departure: "11:00 PM",
        arrival: "5:30 PM +1",
        duration: "12h 30m",
        class: "Business",
        price: 1069,
        availableSeats: 7
    },
    // Additional US Domestic & Regional
    {
        id: "FL017",
        airline: "Delta Airlines",
        flightNumber: "DL2891",
        from: "New York (JFK)",
        fromCity: "New York",
        fromCode: "JFK",
        to: "Los Angeles (LAX)",
        toCity: "Los Angeles",
        toCode: "LAX",
        departure: "7:00 AM",
        arrival: "10:30 AM",
        duration: "5h 30m",
        class: "First Class",
        price: 599,
        availableSeats: 16
    },
    {
        id: "FL018",
        airline: "United Airlines",
        flightNumber: "UA1545",
        from: "Chicago (ORD)",
        fromCity: "Chicago",
        fromCode: "ORD",
        to: "San Francisco (SFO)",
        toCity: "San Francisco",
        toCode: "SFO",
        departure: "8:30 AM",
        arrival: "11:00 AM",
        duration: "4h 30m",
        class: "Business",
        price: 449,
        availableSeats: 20
    },
    {
        id: "FL019",
        airline: "American Airlines",
        flightNumber: "AA2134",
        from: "Miami (MIA)",
        fromCity: "Miami",
        fromCode: "MIA",
        to: "New York (JFK)",
        toCity: "New York",
        toCode: "JFK",
        departure: "6:00 AM",
        arrival: "9:00 AM",
        duration: "3h 00m",
        class: "Business",
        price: 349,
        availableSeats: 18
    },
    {
        id: "FL020",
        airline: "JetBlue",
        flightNumber: "B6618",
        from: "Boston (BOS)",
        fromCity: "Boston",
        fromCode: "BOS",
        to: "San Francisco (SFO)",
        toCity: "San Francisco",
        toCode: "SFO",
        departure: "9:00 AM",
        arrival: "12:30 PM",
        duration: "6h 30m",
        class: "Business",
        price: 479,
        availableSeats: 12
    },
    // More International Routes
    {
        id: "FL021",
        airline: "KLM",
        flightNumber: "KL642",
        from: "Amsterdam (AMS)",
        fromCity: "Amsterdam",
        fromCode: "AMS",
        to: "New York (JFK)",
        toCity: "New York",
        toCode: "JFK",
        departure: "10:30 AM",
        arrival: "1:00 PM",
        duration: "8h 30m",
        class: "Business",
        price: 769,
        availableSeats: 11
    },
    {
        id: "FL022",
        airline: "Swiss",
        flightNumber: "LX17",
        from: "Zurich (ZRH)",
        fromCity: "Zurich",
        fromCode: "ZRH",
        to: "Los Angeles (LAX)",
        toCity: "Los Angeles",
        toCode: "LAX",
        departure: "1:00 PM",
        arrival: "4:00 PM",
        duration: "12h 00m",
        class: "Business",
        price: 879,
        availableSeats: 9
    },
    {
        id: "FL023",
        airline: "Iberia",
        flightNumber: "IB6251",
        from: "Madrid (MAD)",
        fromCity: "Madrid",
        fromCode: "MAD",
        to: "Miami (MIA)",
        toCity: "Miami",
        toCode: "MIA",
        departure: "12:00 PM",
        arrival: "4:00 PM",
        duration: "9h 30m",
        class: "Business",
        price: 729,
        availableSeats: 13
    },
    {
        id: "FL024",
        airline: "Turkish Airlines",
        flightNumber: "TK1",
        from: "Istanbul (IST)",
        fromCity: "Istanbul",
        fromCode: "IST",
        to: "New York (JFK)",
        toCity: "New York",
        toCode: "JFK",
        departure: "2:00 PM",
        arrival: "6:00 PM",
        duration: "11h 00m",
        class: "Business",
        price: 819,
        availableSeats: 10
    },
    // Asia Pacific Routes
    {
        id: "FL025",
        airline: "Qantas",
        flightNumber: "QF12",
        from: "Sydney (SYD)",
        fromCity: "Sydney",
        fromCode: "SYD",
        to: "Los Angeles (LAX)",
        toCity: "Los Angeles",
        toCode: "LAX",
        departure: "10:00 AM",
        arrival: "6:00 AM",
        duration: "13h 00m",
        class: "Business",
        price: 1179,
        availableSeats: 6
    },
    {
        id: "FL026",
        airline: "Air New Zealand",
        flightNumber: "NZ1",
        from: "Auckland (AKL)",
        fromCity: "Auckland",
        fromCode: "AKL",
        to: "San Francisco (SFO)",
        toCity: "San Francisco",
        toCode: "SFO",
        departure: "8:00 PM",
        arrival: "12:00 PM",
        duration: "12h 00m",
        class: "Business",
        price: 1099,
        availableSeats: 8
    },
    {
        id: "FL027",
        airline: "Thai Airways",
        flightNumber: "TG794",
        from: "Bangkok (BKK)",
        fromCity: "Bangkok",
        fromCode: "BKK",
        to: "Los Angeles (LAX)",
        toCity: "Los Angeles",
        toCode: "LAX",
        departure: "11:00 PM",
        arrival: "7:00 PM",
        duration: "17h 00m",
        class: "Business",
        price: 1199,
        availableSeats: 5
    },
    {
        id: "FL028",
        airline: "Japan Airlines",
        flightNumber: "JL061",
        from: "Tokyo (NRT)",
        fromCity: "Tokyo",
        fromCode: "NRT",
        to: "New York (JFK)",
        toCity: "New York",
        toCode: "JFK",
        departure: "6:00 PM",
        arrival: "4:00 PM",
        duration: "13h 00m",
        class: "Business",
        price: 1089,
        availableSeats: 7
    },
    // South America Routes
    {
        id: "FL029",
        airline: "LATAM",
        flightNumber: "LA505",
        from: "Sao Paulo (GRU)",
        fromCity: "Sao Paulo",
        fromCode: "GRU",
        to: "New York (JFK)",
        toCity: "New York",
        toCode: "JFK",
        departure: "11:00 PM",
        arrival: "7:00 AM +1",
        duration: "10h 00m",
        class: "Business",
        price: 849,
        availableSeats: 12
    },
    {
        id: "FL030",
        airline: "Copa Airlines",
        flightNumber: "CM401",
        from: "Panama City (PTY)",
        fromCity: "Panama City",
        fromCode: "PTY",
        to: "Los Angeles (LAX)",
        toCity: "Los Angeles",
        toCode: "LAX",
        departure: "8:00 AM",
        arrival: "12:00 PM",
        duration: "7h 00m",
        class: "Business",
        price: 629,
        availableSeats: 15
    },
    // More European Routes
    {
        id: "FL031",
        airline: "SAS",
        flightNumber: "SK943",
        from: "Stockholm (ARN)",
        fromCity: "Stockholm",
        fromCode: "ARN",
        to: "New York (JFK)",
        toCity: "New York",
        toCode: "JFK",
        departure: "5:00 PM",
        arrival: "8:00 PM",
        duration: "9h 00m",
        class: "Business",
        price: 779,
        availableSeats: 10
    },
    {
        id: "FL032",
        airline: "Finnair",
        flightNumber: "AY5",
        from: "Helsinki (HEL)",
        fromCity: "Helsinki",
        fromCode: "HEL",
        to: "New York (JFK)",
        toCity: "New York",
        toCode: "JFK",
        departure: "4:00 PM",
        arrival: "7:00 PM",
        duration: "9h 00m",
        class: "Business",
        price: 759,
        availableSeats: 11
    },
    {
        id: "FL033",
        airline: "TAP Air Portugal",
        flightNumber: "TP237",
        from: "Lisbon (LIS)",
        fromCity: "Lisbon",
        fromCode: "LIS",
        to: "Boston (BOS)",
        toCity: "Boston",
        toCode: "BOS",
        departure: "11:00 AM",
        arrival: "2:00 PM",
        duration: "8h 00m",
        class: "Business",
        price: 689,
        availableSeats: 14
    },
    {
        id: "FL034",
        airline: "Aer Lingus",
        flightNumber: "EI105",
        from: "Dublin (DUB)",
        fromCity: "Dublin",
        fromCode: "DUB",
        to: "San Francisco (SFO)",
        toCity: "San Francisco",
        toCode: "SFO",
        departure: "12:00 PM",
        arrival: "3:00 PM",
        duration: "11h 00m",
        class: "Business",
        price: 839,
        availableSeats: 9
    },
    // Middle East to Asia
    {
        id: "FL035",
        airline: "Emirates",
        flightNumber: "EK354",
        from: "Dubai (DXB)",
        fromCity: "Dubai",
        fromCode: "DXB",
        to: "Singapore (SIN)",
        toCity: "Singapore",
        toCode: "SIN",
        departure: "2:00 AM",
        arrival: "1:00 PM",
        duration: "7h 00m",
        class: "Business",
        price: 729,
        availableSeats: 8
    },
    {
        id: "FL036",
        airline: "Qatar Airways",
        flightNumber: "QR942",
        from: "Doha (DOH)",
        fromCity: "Doha",
        fromCode: "DOH",
        to: "Tokyo (NRT)",
        toCity: "Tokyo",
        toCode: "NRT",
        departure: "8:00 PM",
        arrival: "10:00 AM +1",
        duration: "10h 00m",
        class: "Business",
        price: 979,
        availableSeats: 7
    },
    {
        id: "FL037",
        airline: "Etihad Airways",
        flightNumber: "EY878",
        from: "Abu Dhabi (AUH)",
        fromCity: "Abu Dhabi",
        fromCode: "AUH",
        to: "Hong Kong (HKG)",
        toCity: "Hong Kong",
        toCode: "HKG",
        departure: "9:00 AM",
        arrival: "9:00 PM",
        duration: "8h 00m",
        class: "Business",
        price: 849,
        availableSeats: 9
    },
    // African Routes
    {
        id: "FL038",
        airline: "South African Airways",
        flightNumber: "SA203",
        from: "Johannesburg (JNB)",
        fromCity: "Johannesburg",
        fromCode: "JNB",
        to: "New York (JFK)",
        toCity: "New York",
        toCode: "JFK",
        departure: "7:00 PM",
        arrival: "7:00 AM +1",
        duration: "16h 00m",
        class: "Business",
        price: 1299,
        availableSeats: 5
    },
    {
        id: "FL039",
        airline: "Ethiopian Airlines",
        flightNumber: "ET500",
        from: "Addis Ababa (ADD)",
        fromCity: "Addis Ababa",
        fromCode: "ADD",
        to: "Washington (IAD)",
        toCity: "Washington",
        toCode: "IAD",
        departure: "10:00 PM",
        arrival: "6:00 AM +1",
        duration: "14h 00m",
        class: "Business",
        price: 1149,
        availableSeats: 6
    },
    {
        id: "FL040",
        airline: "Kenya Airways",
        flightNumber: "KQ002",
        from: "Nairobi (NBO)",
        fromCity: "Nairobi",
        fromCode: "NBO",
        to: "London (LHR)",
        toCity: "London",
        toCode: "LHR",
        departure: "9:00 PM",
        arrival: "5:00 AM +1",
        duration: "9h 00m",
        class: "Business",
        price: 1029,
        availableSeats: 8
    },
    // Additional Premium Routes
    {
        id: "FL041",
        airline: "Virgin Atlantic",
        flightNumber: "VS3",
        from: "London (LHR)",
        fromCity: "London",
        fromCode: "LHR",
        to: "New York (JFK)",
        toCity: "New York",
        toCode: "JFK",
        departure: "10:30 AM",
        arrival: "1:30 PM",
        duration: "8h 00m",
        class: "Upper Class",
        price: 869,
        availableSeats: 10
    },
    {
        id: "FL042",
        airline: "Air Canada",
        flightNumber: "AC7",
        from: "Toronto (YYZ)",
        fromCity: "Toronto",
        fromCode: "YYZ",
        to: "Tokyo (NRT)",
        toCity: "Tokyo",
        toCode: "NRT",
        departure: "1:30 PM",
        arrival: "4:00 PM +1",
        duration: "13h 30m",
        class: "Business",
        price: 1059,
        availableSeats: 7
    },
    {
        id: "FL043",
        airline: "Air China",
        flightNumber: "CA981",
        from: "Beijing (PEK)",
        fromCity: "Beijing",
        fromCode: "PEK",
        to: "Los Angeles (LAX)",
        toCity: "Los Angeles",
        toCode: "LAX",
        departure: "3:00 PM",
        arrival: "11:00 AM",
        duration: "12h 00m",
        class: "Business",
        price: 1019,
        availableSeats: 8
    },
    {
        id: "FL044",
        airline: "Asiana Airlines",
        flightNumber: "OZ202",
        from: "Seoul (ICN)",
        fromCity: "Seoul",
        fromCode: "ICN",
        to: "San Francisco (SFO)",
        toCity: "San Francisco",
        toCode: "SFO",
        departure: "12:00 PM",
        arrival: "7:00 AM",
        duration: "11h 00m",
        class: "Business",
        price: 989,
        availableSeats: 9
    },
    {
        id: "FL045",
        airline: "EVA Air",
        flightNumber: "BR26",
        from: "Taipei (TPE)",
        fromCity: "Taipei",
        fromCode: "TPE",
        to: "Los Angeles (LAX)",
        toCity: "Los Angeles",
        toCode: "LAX",
        departure: "11:30 PM",
        arrival: "8:00 PM",
        duration: "12h 30m",
        class: "Business",
        price: 1039,
        availableSeats: 7
    },
    // More US to Asia routes
    {
        id: "FL046",
        airline: "United Airlines",
        flightNumber: "UA879",
        from: "Chicago (ORD)",
        fromCity: "Chicago",
        fromCode: "ORD",
        to: "Hong Kong (HKG)",
        toCity: "Hong Kong",
        toCode: "HKG",
        departure: "1:00 PM",
        arrival: "6:00 PM +1",
        duration: "16h 00m",
        class: "Business",
        price: 1129,
        availableSeats: 6
    },
    {
        id: "FL047",
        airline: "Delta Airlines",
        flightNumber: "DL159",
        from: "Seattle (SEA)",
        fromCity: "Seattle",
        fromCode: "SEA",
        to: "Tokyo (NRT)",
        toCity: "Tokyo",
        toCode: "NRT",
        departure: "12:00 PM",
        arrival: "3:00 PM +1",
        duration: "10h 00m",
        class: "Business",
        price: 979,
        availableSeats: 10
    },
    {
        id: "FL048",
        airline: "American Airlines",
        flightNumber: "AA175",
        from: "Dallas (DFW)",
        fromCity: "Dallas",
        fromCode: "DFW",
        to: "Seoul (ICN)",
        toCity: "Seoul",
        toCode: "ICN",
        departure: "11:00 AM",
        arrival: "3:00 PM +1",
        duration: "14h 00m",
        class: "Business",
        price: 1099,
        availableSeats: 8
    },
    {
        id: "FL049",
        airline: "United Airlines",
        flightNumber: "UA857",
        from: "San Francisco (SFO)",
        fromCity: "San Francisco",
        fromCode: "SFO",
        to: "Shanghai (PVG)",
        toCity: "Shanghai",
        toCode: "PVG",
        departure: "2:00 PM",
        arrival: "6:00 PM +1",
        duration: "13h 00m",
        class: "Business",
        price: 1069,
        availableSeats: 7
    },
    {
        id: "FL050",
        airline: "Hainan Airlines",
        flightNumber: "HU481",
        from: "Beijing (PEK)",
        fromCity: "Beijing",
        fromCode: "PEK",
        to: "San Francisco (SFO)",
        toCity: "San Francisco",
        toCode: "SFO",
        departure: "5:00 PM",
        arrival: "12:00 PM",
        duration: "12h 00m",
        class: "Business",
        price: 1009,
        availableSeats: 9
    }
];

// ⚠️ FLAG: Hidden in hotel data structure
// Sample hotel data with detailed facilities - FLAG{hotel_details_exposed_client_side}
const hotelData = [
    {
        id: "HT001",
        name: "Grand Hyatt New York",
        location: "New York, USA",
        city: "New York",
        country: "USA",
        rating: 5,
        roomType: "Executive Suite",
        amenities: ["WiFi", "Breakfast", "Gym", "Pool", "Business Center"],
        price: 299,
        available: true,
        description: "Luxurious midtown Manhattan hotel with stunning city views and world-class amenities.",
        address: "109 E 42nd St, New York, NY 10017",
        phone: "+1-212-883-1234",
        roomFacilities: ["King Bed", "Marble Bathroom", "Mini Bar", "Safe", "Work Desk", "Coffee Maker"],
        hotelFacilities: ["24hr Concierge", "Valet Parking", "Room Service", "Conference Rooms", "Restaurant", "Bar"],
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        cancellationPolicy: "Free cancellation up to 48 hours before check-in"
    },
    {
        id: "HT002",
        name: "The Ritz-Carlton London",
        location: "London, UK",
        city: "London",
        country: "UK",
        rating: 5,
        roomType: "Deluxe Room",
        amenities: ["WiFi", "Breakfast", "Spa", "Concierge"],
        price: 399,
        available: true,
        description: "Iconic luxury hotel in Piccadilly offering quintessential British elegance and service.",
        address: "150 Piccadilly, London W1J 9BR, UK",
        phone: "+44-20-7493-8181",
        roomFacilities: ["Queen Bed", "Luxury Linens", "Premium Toiletries", "Turndown Service", "Bathrobes"],
        hotelFacilities: ["Michelin Star Restaurant", "Spa & Wellness Center", "Palm Court Tea", "Fitness Center"],
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        cancellationPolicy: "Free cancellation up to 24 hours before check-in"
    },
    {
        id: "HT003",
        name: "Park Hyatt Tokyo",
        location: "Tokyo, Japan",
        city: "Tokyo",
        country: "Japan",
        rating: 5,
        roomType: "Park King Room",
        amenities: ["WiFi", "Breakfast", "Gym", "City View"],
        price: 449,
        available: true,
        description: "Sophisticated hotel in Shinjuku with breathtaking city views and Japanese-inspired design.",
        address: "3-7-1-2 Nishi Shinjuku, Shinjuku-ku, Tokyo 163-1055",
        phone: "+81-3-5322-1234",
        roomFacilities: ["King Bed", "Deep Soaking Tub", "City View", "Nespresso Machine", "Smart TV"],
        hotelFacilities: ["Peak Lounge & Bar", "New York Grill", "Spa", "Indoor Pool", "Library"],
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        cancellationPolicy: "Free cancellation up to 72 hours before check-in"
    },
    {
        id: "HT004",
        name: "Four Seasons George V",
        location: "Paris, France",
        city: "Paris",
        country: "France",
        rating: 5,
        roomType: "Superior Room",
        amenities: ["WiFi", "Breakfast", "Spa", "Restaurant"],
        price: 499,
        available: true,
        description: "Historic palace hotel steps from the Champs-Élysées with three Michelin-starred restaurants.",
        address: "31 Avenue George V, 75008 Paris, France",
        phone: "+33-1-49-52-70-00",
        roomFacilities: ["King Bed", "Marble Bathroom", "Hermes Toiletries", "Private Bar", "Silk Fabrics"],
        hotelFacilities: ["3 Michelin Star Dining", "Le Spa", "Flower Arrangements", "Art Collection"],
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        cancellationPolicy: "Non-refundable rate selected"
    },
    {
        id: "HT005",
        name: "Burj Al Arab Jumeirah",
        location: "Dubai, UAE",
        city: "Dubai",
        country: "UAE",
        rating: 5,
        roomType: "Deluxe Suite",
        amenities: ["WiFi", "Butler Service", "Private Beach", "Chauffeur"],
        price: 899,
        available: true,
        description: "World's most luxurious hotel on a private island with unparalleled service and opulence.",
        address: "Jumeirah St, Dubai, United Arab Emirates",
        phone: "+971-4-301-7777",
        roomFacilities: ["King Bed", "Panoramic Views", "Gold iPad", "Pillow Menu", "Jacuzzi"],
        hotelFacilities: ["Private Beach", "Helicopter Pad", "Chauffeur Service", "Personal Butler", "9 Restaurants"],
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        cancellationPolicy: "No refunds on cancellation"
    },
    {
        id: "HT006",
        name: "Marina Bay Sands",
        location: "Singapore",
        city: "Singapore",
        country: "Singapore",
        rating: 5,
        roomType: "Premier Room",
        amenities: ["WiFi", "Infinity Pool", "Casino", "Sky Park"],
        price: 349,
        available: true,
        description: "Iconic hotel with the world's largest rooftop infinity pool and stunning skyline views.",
        address: "10 Bayfront Ave, Singapore 018956",
        phone: "+65-6688-8868",
        roomFacilities: ["King Bed", "Bay View", "Rain Shower", "Coffee/Tea", "Smart Room Controls"],
        hotelFacilities: ["Infinity Pool", "SkyPark", "Casino", "Shopping Mall", "Multiple Restaurants"],
        checkIn: "3:00 PM",
        checkOut: "11:00 AM",
        cancellationPolicy: "Free cancellation up to 48 hours before check-in"
    },
    {
        id: "HT007",
        name: "The Peninsula Hong Kong",
        location: "Hong Kong",
        city: "Hong Kong",
        country: "Hong Kong",
        rating: 5,
        roomType: "Deluxe Harbour View",
        amenities: ["WiFi", "Breakfast", "Spa", "Rooftop Bar", "Shopping Arcade"],
        price: 429,
        available: true,
        description: "Historic luxury hotel with Victoria Harbour views and legendary afternoon tea service.",
        address: "Salisbury Rd, Tsim Sha Tsui, Hong Kong",
        phone: "+852-2920-2888",
        roomFacilities: ["King Bed", "Harbour View", "Technology Butler", "Tablet Controls", "Premium Linens"],
        hotelFacilities: ["Rooftop Bar", "Spa", "Fleet of Rolls Royce", "Afternoon Tea", "Shopping Arcade"],
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        cancellationPolicy: "Free cancellation up to 24 hours before check-in"
    },
    {
        id: "HT008",
        name: "Mandarin Oriental Bangkok",
        location: "Bangkok, Thailand",
        city: "Bangkok",
        country: "Thailand",
        rating: 5,
        roomType: "Premier Room",
        amenities: ["WiFi", "Breakfast", "Spa", "River View", "Thai Cooking Classes"],
        price: 289,
        available: true,
        description: "Legendary riverside hotel offering traditional Thai hospitality and modern luxury.",
        address: "48 Oriental Avenue, Bangkok 10500, Thailand",
        phone: "+66-2-659-9000",
        roomFacilities: ["King Bed", "River View", "Thai Silk Decor", "Deep Tub", "Premium Amenities"],
        hotelFacilities: ["Award-Winning Spa", "Cooking School", "River Shuttle", "9 Restaurants", "Pool"],
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        cancellationPolicy: "Free cancellation up to 48 hours before check-in"
    },
    {
        id: "HT009",
        name: "The Langham Sydney",
        location: "Sydney, Australia",
        city: "Sydney",
        country: "Australia",
        rating: 5,
        roomType: "Harbour View Room",
        amenities: ["WiFi", "Breakfast", "Pool", "Spa", "Fine Dining"],
        price: 379,
        available: true,
        description: "Elegant hotel in The Rocks with stunning harbour views and refined service.",
        address: "89-113 Kent St, Millers Point NSW 2000, Australia",
        phone: "+61-2-9256-2222",
        roomFacilities: ["King Bed", "Harbour View", "Marble Bathroom", "Chaise Lounge", "Tea Selection"],
        hotelFacilities: ["Day Spa", "Fine Dining", "Observatory Bar", "Indoor Pool", "Fitness Center"],
        checkIn: "3:00 PM",
        checkOut: "11:00 AM",
        cancellationPolicy: "Free cancellation up to 72 hours before check-in"
    },
    {
        id: "HT010",
        name: "Atlantis The Palm",
        location: "Dubai, UAE",
        city: "Dubai",
        country: "UAE",
        rating: 5,
        roomType: "Imperial Club Room",
        amenities: ["WiFi", "Breakfast", "Water Park", "Aquarium", "Private Beach"],
        price: 459,
        available: true,
        description: "Iconic resort on Palm Jumeirah with waterpark, aquarium and underwater suites.",
        address: "Crescent Rd, Dubai, United Arab Emirates",
        phone: "+971-4-426-0000",
        roomFacilities: ["King Bed", "Sea View", "Club Lounge Access", "Luxury Amenities", "Terrace"],
        hotelFacilities: ["Aquaventure Waterpark", "Lost Chambers Aquarium", "20+ Restaurants", "Spa", "Beach"],
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        cancellationPolicy: "Free cancellation up to 48 hours before check-in"
    },
    {
        id: "HT011",
        name: "The St. Regis New York",
        location: "New York, USA",
        city: "New York",
        country: "USA",
        rating: 5,
        roomType: "Grand Deluxe",
        amenities: ["WiFi", "Butler Service", "Fine Dining", "Bar", "Fitness Center"],
        price: 549,
        available: true,
        description: "Legendary Beaux-Arts landmark on Fifth Avenue with unparalleled butler service.",
        address: "2 E 55th St, New York, NY 10022",
        phone: "+1-212-753-4500",
        roomFacilities: ["King Bed", "Custom Bed", "Marble Bath", "Butler Service", "Chandeliers"],
        hotelFacilities: ["Astor Court", "King Cole Bar", "Fitness Studio", "Business Services"],
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        cancellationPolicy: "Non-refundable rate selected"
    },
    {
        id: "HT012",
        name: "Aman Tokyo",
        location: "Tokyo, Japan",
        city: "Tokyo",
        country: "Japan",
        rating: 5,
        roomType: "Premier Room",
        amenities: ["WiFi", "Spa", "Fine Dining", "Library", "City Views"],
        price: 699,
        available: true,
        description: "Zen-inspired urban sanctuary occupying top floors of Otemachi Tower with spa.",
        address: "The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo",
        phone: "+81-3-5224-3333",
        roomFacilities: ["King Bed", "Soaking Tub", "Shoji Screens", "City View", "Tea Ceremony Set"],
        hotelFacilities: ["Aman Spa", "Pool", "Italian Restaurant", "Cigar Lounge", "Library"],
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        cancellationPolicy: "Free cancellation up to 7 days before check-in"
    }
];

// Sample user data - ⚠️ VULNERABILITY: Storing sensitive data in localStorage
// ⚠️ FLAG{user_pii_data_in_plain_text_storage}
const sampleUsers = [
    {
        id: "USR001",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@company.com",
        phone: "+1-555-0123",
        company: "Tech Corp",
        membershipTier: "Platinum",
        // ⚠️ VULNERABILITY: Password stored in plain text
        password: "password123",
        creditCard: "4532-1234-5678-9012",
        cvv: "123",
        cardExpiry: "12/26",
        ssn: "123-45-6789",
        dateOfBirth: "1985-03-15",
        address: "123 Main St, New York, NY 10001",
        // ⚠️ FLAG: Azure credentials in user object
        azureUsername: "john.smith@bluemountain.onmicrosoft.com",
        azurePassword: "Winter2024!",
        // FLAG{azure_credentials_john_smith}
        entraId: "a1b2c3d4-e5f6-4789-a012-3456789abcde"
    },
    {
        id: "USR002",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@enterprise.com",
        phone: "+1-555-0234",
        company: "Global Industries",
        membershipTier: "Gold",
        password: "Sarah@2024",
        creditCard: "5412-7534-9012-3456",
        cvv: "456",
        cardExpiry: "09/25",
        ssn: "234-56-7890",
        dateOfBirth: "1990-07-22",
        address: "456 Oak Ave, Chicago, IL 60601",
        azureUsername: "sarah.j@bluemountain.onmicrosoft.com",
        azurePassword: "Summer2024!",
        entraId: "b2c3d4e5-f6a7-5890-b123-456789bcdef0"
    },
    {
        id: "USR003",
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@startups.io",
        phone: "+1-555-0345",
        company: "Innovation Labs",
        membershipTier: "Silver",
        password: "Chen#2024",
        creditCard: "3714-496353-98431",
        cvv: "7890",
        cardExpiry: "03/27",
        ssn: "345-67-8901",
        dateOfBirth: "1988-11-30",
        address: "789 Tech Blvd, San Francisco, CA 94102",
        azureUsername: "m.chen@bluemountain.onmicrosoft.com",
        azurePassword: "Fall2024!",
        entraId: "c3d4e5f6-a7b8-6901-c234-56789cdef012"
    },
    {
        id: "USR004",
        firstName: "Emma",
        lastName: "Williams",
        email: "emma.w@consulting.com",
        phone: "+1-555-0456",
        company: "Strategy Consultants",
        membershipTier: "Platinum",
        password: "Emma!Williams99",
        creditCard: "6011-1111-2222-3333",
        cvv: "321",
        cardExpiry: "06/26",
        ssn: "456-78-9012",
        dateOfBirth: "1992-05-18",
        address: "321 Corporate Dr, Boston, MA 02101",
        azureUsername: "emma.williams@bluemountain.onmicrosoft.com",
        azurePassword: "Spring2024!",
        entraId: "d4e5f6a7-b8c9-7012-d345-6789def01234"
    },
    {
        id: "USR005",
        firstName: "David",
        lastName: "Martinez",
        email: "d.martinez@finance.com",
        phone: "+1-555-0567",
        company: "Investment Bank",
        membershipTier: "Gold",
        password: "DavidM@rtinez2024",
        creditCard: "5105-1051-0510-5100",
        cvv: "789",
        cardExpiry: "11/25",
        ssn: "567-89-0123",
        dateOfBirth: "1987-09-25",
        address: "555 Wall St, New York, NY 10005",
        azureUsername: "david.m@bluemountain.onmicrosoft.com",
        azurePassword: "Banker2024!",
        entraId: "e5f6a7b8-c9d0-8123-e456-789ef0123456"
    },
    {
        id: "ADMIN001",
        firstName: "System",
        lastName: "Administrator",
        email: "admin@bluemountaintravel.com",
        phone: "+1-555-9999",
        company: "Blue Mountain Travel",
        membershipTier: "Admin",
        // ⚠️ CRITICAL: Admin credentials exposed
        password: "Admin@BlueMountain2024!",
        // FLAG{admin_password_found}
        creditCard: "4111-1111-1111-1111",
        cvv: "999",
        cardExpiry: "12/99",
        ssn: "000-00-0000",
        dateOfBirth: "1980-01-01",
        address: "1 Blue Mountain Plaza, Seattle, WA 98101",
        azureUsername: "admin@bluemountain.onmicrosoft.com",
        azurePassword: "AzureAdmin2024!@#",
        entraId: "f6a7b8c9-d0e1-9234-f567-89f012345678",
        // ⚠️ VULNERABILITY: Admin access keys exposed
        adminAccessKey: "BMT-ADMIN-KEY-2024-PROD-abc123xyz789",
        // FLAG{azure_admin_access_key_exposed}
        azureSubscriptionId: "12345678-1234-1234-1234-123456789012",
        azureTenantId: "87654321-4321-4321-4321-210987654321"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Blue Mountain Travel - Initializing...');
    
    // ⚠️ VULNERABILITY: Logging sensitive configuration
    console.log('Azure Configuration:', {
        storageAccount: STORAGE_ACCOUNT_NAME,
        sasToken: AZURE_STORAGE_SAS_TOKEN,
        apiKeys: API_CONFIG,
        database: DATABASE_CONFIG
    });
    
    initializeTabSwitching();
    initializeDateFields();
    initializeSearchForms();
    loadUserData();
    
    console.log('Application initialized successfully');
});

// Tab switching functionality
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchContents = document.querySelectorAll('.search-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            searchContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabName}-search`).classList.add('active');
        });
    });
}

// Initialize date fields with default values
function initializeDateFields() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    // Set default dates
    const departureDate = document.getElementById('departure-date');
    const returnDate = document.getElementById('return-date');
    const checkinDate = document.getElementById('checkin-date');
    const checkoutDate = document.getElementById('checkout-date');
    
    if (departureDate) departureDate.value = formatDate(tomorrow);
    if (returnDate) returnDate.value = formatDate(nextWeek);
    if (checkinDate) checkinDate.value = formatDate(tomorrow);
    if (checkoutDate) checkoutDate.value = formatDate(nextWeek);
}

// Initialize search forms
function initializeSearchForms() {
    const searchForms = document.querySelectorAll('.search-form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const searchType = this.closest('.search-content').id.replace('-search', '');
            
            console.log(`Searching ${searchType}...`, Object.fromEntries(formData));
            
            // ⚠️ VULNERABILITY: Sending data with exposed credentials
            sendSearchRequest(searchType, Object.fromEntries(formData));
            
            // Redirect to appropriate page
            if (searchType === 'flights') {
                window.location.href = 'flights.html';
            } else if (searchType === 'hotels') {
                window.location.href = 'hotels.html';
            }
        });
    });
}

// ⚠️ VULNERABILITY: Function that exposes API calls with credentials
function sendSearchRequest(type, data) {
    const requestData = {
        type: type,
        searchParams: data,
        // ⚠️ VULNERABILITY: Including credentials in request
        apiKey: API_CONFIG.primaryKey,
        sasToken: AZURE_STORAGE_SAS_TOKEN,
        user: getCurrentUser()
    };
    
    console.log('Sending request to:', API_CONFIG.endpoint);
    console.log('Request data:', requestData);
    
    // Store in localStorage - ⚠️ VULNERABILITY: Sensitive data in browser storage
    localStorage.setItem('lastSearch', JSON.stringify(requestData));
}

// Load user data from localStorage
function loadUserData() {
    let user = localStorage.getItem('currentUser');
    
    if (!user) {
        // ⚠️ VULNERABILITY: Auto-login with default credentials
        user = sampleUsers[0];
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Auto-logged in with default user:', user.email);
    } else {
        user = JSON.parse(user);
    }
    
    return user;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// ⚠️ VULNERABILITY: Direct blob storage access function
function uploadToAzureStorage(file, containerName) {
    const blobUrl = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${file.name}${AZURE_STORAGE_SAS_TOKEN}`;
    
    console.log('Uploading to Azure Storage:', blobUrl);
    
    // This would make an actual upload in production
    return blobUrl;
}

// ⚠️ VULNERABILITY: Function that constructs URLs with SAS tokens
function getDocumentUrl(documentId) {
    return `${STORAGE_URLS.documents}/${documentId}`;
}

// Export data for use in other pages
if (typeof window !== 'undefined') {
    window.FlightData = flightData;
    window.HotelData = hotelData;
    window.sampleUsers = sampleUsers;  // ⚠️ VULNERABILITY: Exposing all users globally
    // FLAG{all_user_data_accessible_via_window_object}
    window.AzureConfig = {
        storageAccount: STORAGE_ACCOUNT_NAME,
        sasToken: AZURE_STORAGE_SAS_TOKEN,
        storageUrls: STORAGE_URLS,
        apiConfig: API_CONFIG,
        databaseConfig: DATABASE_CONFIG
    };
}

// ⚠️ VULNERABILITY: Console logging function that exposes internal data
function debugLog(message, data) {
    console.log(`[DEBUG] ${message}`, data);
    console.log('Current Configuration:', window.AzureConfig);
    console.log('Current User:', getCurrentUser());
}

// Set up global error handler - ⚠️ VULNERABILITY: Exposes stack traces
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error occurred:', {
        message: msg,
        url: url,
        lineNo: lineNo,
        columnNo: columnNo,
        error: error,
        stack: error ? error.stack : 'N/A',
        config: window.AzureConfig,
        user: getCurrentUser()
    });
    return false;
};

console.log('=== Blue Mountain Travel - Security Training Demo ===');
console.log('This application contains intentional security vulnerabilities:');
console.log('1. Exposed SAS tokens in client-side code');
console.log('2. Hardcoded API keys and credentials');
console.log('3. Database connection strings in JavaScript');
console.log('4. Sensitive data in localStorage');
console.log('5. Public blob storage URLs');
console.log('6. Detailed error logging with sensitive information');
console.log('===============================================');
console.log('');
console.log('🚩 CTF FLAGS - Find these throughout the application:');
console.log('- FLAG{exposed_flight_data_in_client_side_code}');
console.log('- FLAG{user_pii_data_in_plain_text_storage}');
console.log('- FLAG{azure_credentials_john_smith}');
console.log('- FLAG{admin_password_found}');
console.log('- FLAG{azure_admin_access_key_exposed}');
console.log('- And many more hidden in the application...');
console.log('');
console.log('💡 HINTS:');
console.log('- Check localStorage for sensitive data');
console.log('- View source code for hidden comments');
console.log('- Inspect network requests for credentials');
console.log('- Look for admin endpoints');
console.log('- Try IDOR attacks with predictable IDs');
console.log('===============================================');
console.log('');
console.log('Quick Access to User Data:');
console.log('window.sampleUsers - All system users with passwords');
console.log('window.FlightData - All flight data');
console.log('window.HotelData - All hotel data with details');
console.log('window.AzureConfig - Azure credentials and keys');
console.log('===============================================');
