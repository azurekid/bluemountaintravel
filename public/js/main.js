// Blue Mountain Travel - Main JavaScript
// WARNING: This code contains intentional security vulnerabilities for training purposes

// ⚠️ VULNERABILITY: Exposed Azure Storage SAS Token
// NOTE: Token is intentionally long-lived for training.
const AZURE_STORAGE_SAS_TOKEN = "?sv=2024-11-04&ss=b&srt=sco&sp=rltfx&se=2028-01-09T20:43:28Z&st=2026-01-09T12:28:28Z&spr=https&sig=YA2i1TA9Ujem7iKCcCz0Xg6PtKwvdqfXmcql2zKYMsw%3D";
// Used when constructing write URLs specifically for the documents container.
const AZURE_STORAGE_SAS_TOKEN_DOCUMENTS_WRITE = "?sv=2024-11-04&ss=b&srt=sco&sp=wlactf&se=2028-01-10T17:12:11Z&st=2026-01-10T08:57:11Z&spr=https,http&sig=3YfxbuuQ8WnUQ4xA1pLnC2rv6X0lr%2BUzZiUdPvmqVvc%3D";
const STORAGE_ACCOUNT_NAME = "bluemountaintravel";

// ⚠️ VULNERABILITY: Hardcoded API Keys
const API_CONFIG = {
    // Azure Functions host/function key (required when authLevel is "function")
    // Set this to your real function key after deployment.
    functionKey: "UAPSTzJ8DEeM-KpqjD4N_FEdEXJyeHaACrNbnHbghSm8AzFuIBr-dA==",
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
    bookings: `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/bookings/`,
    profiles: `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/profiles/`,
    documents: `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/documents/`,
    sasToken: AZURE_STORAGE_SAS_TOKEN
};

// ⚠️ VULNERABILITY: Training marker (CTF)
// ctf_b64: RkxBR3tleHBvc2VkX2ZsaWdodF9kYXRhX2luX2NsaWVudF9zaWRlX2NvZGV9

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
        availableSeats: 12,
        aircraft: "Boeing 787-9 Dreamliner"
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
        availableSeats: 15,
        aircraft: "Boeing 777-300ER"
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
        availableSeats: 8,
        aircraft: "Boeing 787-10 Dreamliner"
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
        availableSeats: 10,
        aircraft: "Airbus A350-900"
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
        availableSeats: 14,
        aircraft: "Boeing 777-200"
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
        availableSeats: 8,
        aircraft: "Boeing 777-300ER"
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
        availableSeats: 6,
        aircraft: "Airbus A350-900 ULR"
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
        availableSeats: 11,
        aircraft: "Boeing 787-9 Dreamliner"
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
        availableSeats: 7,
        aircraft: "Airbus A350-1000"
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
        availableSeats: 9,
        aircraft: "Boeing 777-300ER"
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
        availableSeats: 4,
        aircraft: "Airbus A380-800"
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
        availableSeats: 5,
        aircraft: "Boeing 777-300ER"
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
        availableSeats: 6,
        aircraft: "Boeing 777-200LR"
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
        availableSeats: 8,
        aircraft: "Boeing 787-9 Dreamliner"
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
        availableSeats: 10,
        aircraft: "Airbus A350-900"
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
        availableSeats: 7,
        aircraft: "Boeing 777-300ER"
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
        availableSeats: 16,
        aircraft: "Airbus A321neo"
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
        availableSeats: 20,
        aircraft: "Boeing 737 MAX 9"
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
        availableSeats: 18,
        aircraft: "Airbus A321"
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
        availableSeats: 12,
        aircraft: "Airbus A321LR"
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
        availableSeats: 11,
        aircraft: "Boeing 787-10 Dreamliner"
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
        availableSeats: 9,
        aircraft: "Boeing 777-300ER"
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
        availableSeats: 13,
        aircraft: "Airbus A350-900"
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
        availableSeats: 10,
        aircraft: "Boeing 787-9 Dreamliner"
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
        availableSeats: 6,
        aircraft: "Boeing 787-9 Dreamliner"
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
        availableSeats: 8,
        aircraft: "Boeing 787-9 Dreamliner"
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
        availableSeats: 5,
        aircraft: "Airbus A350-900"
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
        availableSeats: 7,
        aircraft: "Boeing 787-9 Dreamliner"
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
// Sample hotel data with detailed facilities - ctf_b64: RkxBR3tob3RlbF9kZXRhaWxzX2V4cG9zZWRfY2xpZW50X3NpZGV9
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

// ---------------------------------------------------------------------------
// Large demo dataset generation (500+ flights, 500+ hotels)
// ---------------------------------------------------------------------------

function createSeededRng(seed) {
    // xorshift32
    let state = seed >>> 0;
    return function rng() {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return ((state >>> 0) / 4294967296);
    };
}

function pad3(n) {
    return String(n).padStart(3, '0');
}

function safeEncodeKeywords(keywords) {
    return keywords
        .filter(Boolean)
        .map(k => encodeURIComponent(String(k).trim()))
        .join(',');
}

function hashToLock(value) {
    // Simple deterministic hash -> positive integer
    const str = String(value || '');
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); // djb2
        hash |= 0;
    }
    return Math.abs(hash);
}

function buildUnsplashFeaturedUrl(width, height, keywords) {
    // NOTE: Avoid source.unsplash.com here (it can intermittently return Heroku error pages).
    // loremflickr serves tagged photos and supports a deterministic lock parameter.
    const tags = safeEncodeKeywords(keywords);
    const lock = hashToLock(`${width}x${height}:${tags}`) % 10000;
    return `https://loremflickr.com/${width}/${height}/${tags}?lock=${lock}`;
}

function buildHotelRoomPhotoUrl(width, height, hotelKey) {
    // Curated list of high-quality Unsplash luxury hotel/resort room photos
    // These are actual professional hotel photography - interiors, suites, views
    const luxuryHotelPhotos = [
        // Luxury hotel rooms and suites
        'photo-1618773928121-c32242e63f39', // Elegant hotel bedroom
        'photo-1631049307264-da0ec9d70304', // Modern luxury suite
        'photo-1590490360182-c33d57733427', // Boutique hotel room
        'photo-1566665797739-1674de7a421a', // Hotel room with view
        'photo-1582719478250-c89cae4dc85b', // Luxury hotel bed
        'photo-1611892440504-42a792e24d32', // Premium suite interior
        'photo-1578683010236-d716f9a3f461', // Elegant hotel interior
        'photo-1520250497591-112f2f40a3f4', // Resort room ocean view
        'photo-1542314831-068cd1dbfeeb', // Grand hotel lobby
        'photo-1564501049412-61c2a3083791', // Modern hotel room
        'photo-1551882547-ff40c63fe5fa', // Luxury resort suite
        'photo-1618221195710-dd6b41faaea6', // Hotel room design
        'photo-1596394516093-501ba68a0ba6', // Premium accommodation
        'photo-1445019980597-93fa8acb246c', // Stylish hotel bed
        'photo-1584132967334-10e028bd69f7', // Upscale hotel room
        'photo-1587874522487-fe10e9d2e4c2', // Boutique suite
        'photo-1560185007-c5ca9d2c014d', // Hotel room artwork
        'photo-1560448204-603b3fc33ddc', // Luxury bedroom view
        'photo-1571896349842-33c89424de2d', // Resort accommodation
        'photo-1512918728675-ed5a9ecdebfd', // Hotel bathroom luxury
        'photo-1590381105924-c72589b9ef3f', // Modern hotel design
        'photo-1595576508898-0ad5c879a061', // Premium room interior
        'photo-1522771739844-6a9f6d5f14af', // Classic luxury hotel
        'photo-1625244724120-1fd1d34d00f6', // Contemporary suite
        'photo-1613977257363-707ba9348227', // Resort bedroom
        'photo-1602002418816-5c0aeef426aa', // Executive suite
        'photo-1609949165314-64f2a9a5f53a', // Penthouse view
        'photo-1566073771259-6a8506099945', // Pool resort
        'photo-1571003123894-1f0594d2b5d9', // Luxury villa
        'photo-1540541338287-41700207dee6', // Infinity pool resort
        'photo-1544124499-58912cbddaad', // Overwater bungalow
        'photo-1615460549969-36fa19521a4f', // Spa hotel
        'photo-1600596542815-ffad4c1539a9', // Premium lodge
        'photo-1568495248636-6432b97bd949', // Hotel terrace
        'photo-1517840901100-8179e982acb7', // Beach resort room
        'photo-1559599189-fe84dea4eb79', // Tropical suite
        'photo-1564078516393-cf04bd966897', // City hotel luxury
        'photo-1582719508461-905c673771fd', // Skyline view room
        'photo-1521783988139-89397d761dce', // Mountain resort
        'photo-1563911302283-d2bc129e7570'  // Desert luxury hotel
    ];
    
    const idx = hashToLock(hotelKey) % luxuryHotelPhotos.length;
    const photoId = luxuryHotelPhotos[idx];
    return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&q=80`;
}

function parseCityFromRoute(value) {
    if (!value) return '';
    // "City (CODE)" -> "City"
    const idx = value.indexOf(' (');
    return idx > 0 ? value.slice(0, idx) : value;
}

function ensureLargeDemoData() {
    const TARGET_FLIGHTS = 500;
    const TARGET_HOTELS = 500;

    const rng = createSeededRng(20260108);

    const airports = [
        // Americas
        { city: 'New York', country: 'USA', code: 'JFK' },
        { city: 'Los Angeles', country: 'USA', code: 'LAX' },
        { city: 'Chicago', country: 'USA', code: 'ORD' },
        { city: 'San Francisco', country: 'USA', code: 'SFO' },
        { city: 'Miami', country: 'USA', code: 'MIA' },
        { city: 'Seattle', country: 'USA', code: 'SEA' },
        { city: 'Boston', country: 'USA', code: 'BOS' },
        { city: 'Dallas', country: 'USA', code: 'DFW' },
        { city: 'Toronto', country: 'Canada', code: 'YYZ' },
        { city: 'Vancouver', country: 'Canada', code: 'YVR' },
        { city: 'Mexico City', country: 'Mexico', code: 'MEX' },
        { city: 'São Paulo', country: 'Brazil', code: 'GRU' },
        { city: 'Rio de Janeiro', country: 'Brazil', code: 'GIG' },
        { city: 'Buenos Aires', country: 'Argentina', code: 'EZE' },
        { city: 'Lima', country: 'Peru', code: 'LIM' },
        { city: 'Bogotá', country: 'Colombia', code: 'BOG' },
        // Europe
        { city: 'London', country: 'UK', code: 'LHR' },
        { city: 'Paris', country: 'France', code: 'CDG' },
        { city: 'Amsterdam', country: 'Netherlands', code: 'AMS' },
        { city: 'Frankfurt', country: 'Germany', code: 'FRA' },
        { city: 'Munich', country: 'Germany', code: 'MUC' },
        { city: 'Zurich', country: 'Switzerland', code: 'ZRH' },
        { city: 'Rome', country: 'Italy', code: 'FCO' },
        { city: 'Madrid', country: 'Spain', code: 'MAD' },
        { city: 'Barcelona', country: 'Spain', code: 'BCN' },
        { city: 'Lisbon', country: 'Portugal', code: 'LIS' },
        { city: 'Dublin', country: 'Ireland', code: 'DUB' },
        { city: 'Vienna', country: 'Austria', code: 'VIE' },
        { city: 'Prague', country: 'Czechia', code: 'PRG' },
        { city: 'Stockholm', country: 'Sweden', code: 'ARN' },
        { city: 'Copenhagen', country: 'Denmark', code: 'CPH' },
        // Africa
        { city: 'Cairo', country: 'Egypt', code: 'CAI' },
        { city: 'Nairobi', country: 'Kenya', code: 'NBO' },
        { city: 'Addis Ababa', country: 'Ethiopia', code: 'ADD' },
        { city: 'Johannesburg', country: 'South Africa', code: 'JNB' },
        { city: 'Cape Town', country: 'South Africa', code: 'CPT' },
        { city: 'Casablanca', country: 'Morocco', code: 'CMN' },
        // Middle East
        { city: 'Dubai', country: 'UAE', code: 'DXB' },
        { city: 'Doha', country: 'Qatar', code: 'DOH' },
        { city: 'Abu Dhabi', country: 'UAE', code: 'AUH' },
        { city: 'Riyadh', country: 'Saudi Arabia', code: 'RUH' },
        { city: 'Tel Aviv', country: 'Israel', code: 'TLV' },
        // Asia-Pacific
        { city: 'Tokyo', country: 'Japan', code: 'NRT' },
        { city: 'Osaka', country: 'Japan', code: 'KIX' },
        { city: 'Seoul', country: 'South Korea', code: 'ICN' },
        { city: 'Hong Kong', country: 'Hong Kong', code: 'HKG' },
        { city: 'Singapore', country: 'Singapore', code: 'SIN' },
        { city: 'Bangkok', country: 'Thailand', code: 'BKK' },
        { city: 'Hanoi', country: 'Vietnam', code: 'HAN' },
        { city: 'Ho Chi Minh City', country: 'Vietnam', code: 'SGN' },
        { city: 'Manila', country: 'Philippines', code: 'MNL' },
        { city: 'Kuala Lumpur', country: 'Malaysia', code: 'KUL' },
        { city: 'Jakarta', country: 'Indonesia', code: 'CGK' },
        { city: 'Sydney', country: 'Australia', code: 'SYD' },
        { city: 'Melbourne', country: 'Australia', code: 'MEL' },
        { city: 'Auckland', country: 'New Zealand', code: 'AKL' },
        { city: 'Delhi', country: 'India', code: 'DEL' },
        { city: 'Mumbai', country: 'India', code: 'BOM' },
        { city: 'Bengaluru', country: 'India', code: 'BLR' },
        { city: 'Beijing', country: 'China', code: 'PEK' },
        { city: 'Shanghai', country: 'China', code: 'PVG' }
    ];

    const airlines = [
        { name: 'Delta Airlines', code: 'DL' },
        { name: 'American Airlines', code: 'AA' },
        { name: 'United Airlines', code: 'UA' },
        { name: 'British Airways', code: 'BA' },
        { name: 'Lufthansa', code: 'LH' },
        { name: 'Air France', code: 'AF' },
        { name: 'KLM', code: 'KL' },
        { name: 'Emirates', code: 'EK' },
        { name: 'Qatar Airways', code: 'QR' },
        { name: 'Singapore Airlines', code: 'SQ' },
        { name: 'ANA', code: 'NH' },
        { name: 'Cathay Pacific', code: 'CX' },
        { name: 'Korean Air', code: 'KE' },
        { name: 'Turkish Airlines', code: 'TK' },
        { name: 'Qantas', code: 'QF' },
        { name: 'Air Canada', code: 'AC' },
        { name: 'LATAM', code: 'LA' },
        { name: 'Aeromexico', code: 'AM' },
        { name: 'Ethiopian Airlines', code: 'ET' },
        { name: 'Kenya Airways', code: 'KQ' }
    ];

    const hotelCities = [
        { city: 'New York', country: 'USA' },
        { city: 'Los Angeles', country: 'USA' },
        { city: 'Chicago', country: 'USA' },
        { city: 'San Francisco', country: 'USA' },
        { city: 'Miami', country: 'USA' },
        { city: 'Toronto', country: 'Canada' },
        { city: 'Vancouver', country: 'Canada' },
        { city: 'Mexico City', country: 'Mexico' },
        { city: 'São Paulo', country: 'Brazil' },
        { city: 'Buenos Aires', country: 'Argentina' },
        { city: 'London', country: 'UK' },
        { city: 'Paris', country: 'France' },
        { city: 'Amsterdam', country: 'Netherlands' },
        { city: 'Frankfurt', country: 'Germany' },
        { city: 'Munich', country: 'Germany' },
        { city: 'Zurich', country: 'Switzerland' },
        { city: 'Rome', country: 'Italy' },
        { city: 'Madrid', country: 'Spain' },
        { city: 'Barcelona', country: 'Spain' },
        { city: 'Lisbon', country: 'Portugal' },
        { city: 'Dublin', country: 'Ireland' },
        { city: 'Vienna', country: 'Austria' },
        { city: 'Prague', country: 'Czechia' },
        { city: 'Stockholm', country: 'Sweden' },
        { city: 'Copenhagen', country: 'Denmark' },
        { city: 'Cairo', country: 'Egypt' },
        { city: 'Nairobi', country: 'Kenya' },
        { city: 'Johannesburg', country: 'South Africa' },
        { city: 'Cape Town', country: 'South Africa' },
        { city: 'Casablanca', country: 'Morocco' },
        { city: 'Dubai', country: 'UAE' },
        { city: 'Doha', country: 'Qatar' },
        { city: 'Riyadh', country: 'Saudi Arabia' },
        { city: 'Tel Aviv', country: 'Israel' },
        { city: 'Tokyo', country: 'Japan' },
        { city: 'Osaka', country: 'Japan' },
        { city: 'Seoul', country: 'South Korea' },
        { city: 'Hong Kong', country: 'Hong Kong' },
        { city: 'Singapore', country: 'Singapore' },
        { city: 'Bangkok', country: 'Thailand' },
        { city: 'Hanoi', country: 'Vietnam' },
        { city: 'Ho Chi Minh City', country: 'Vietnam' },
        { city: 'Manila', country: 'Philippines' },
        { city: 'Kuala Lumpur', country: 'Malaysia' },
        { city: 'Jakarta', country: 'Indonesia' },
        { city: 'Sydney', country: 'Australia' },
        { city: 'Melbourne', country: 'Australia' },
        { city: 'Auckland', country: 'New Zealand' },
        { city: 'Delhi', country: 'India' },
        { city: 'Mumbai', country: 'India' }
    ];

    // Ensure existing entries have photoUrl + locationType
    (flightData || []).forEach(f => {
        if (!f.photoUrl) {
            const toCity = f.toCity || parseCityFromRoute(f.to);
            f.photoUrl = buildUnsplashFeaturedUrl(900, 600, [toCity, 'skyline', 'travel']);
        }
    });

    (hotelData || []).forEach(h => {
        // Always prefer a room/interior style photo to match UX expectations.
        h.photoUrl = buildHotelRoomPhotoUrl(900, 600, h.id || h.name || h.location || 'hotel');
        if (!h.locationType) {
            h.locationType = 'city';
        }
    });

    // Generate additional flights
    let flightIndex = flightData.length + 1;
    while (flightData.length < TARGET_FLIGHTS) {
        const from = airports[Math.floor(rng() * airports.length)];
        let to = airports[Math.floor(rng() * airports.length)];
        // ensure different
        let guard = 0;
        while (to.code === from.code && guard < 10) {
            to = airports[Math.floor(rng() * airports.length)];
            guard += 1;
        }

        const airline = airlines[Math.floor(rng() * airlines.length)];
        const depHour = 5 + Math.floor(rng() * 17); // 5..21
        const depMin = [0, 15, 30, 45][Math.floor(rng() * 4)];
        const depIsPm = depHour >= 12;
        const depDisplayHour = ((depHour + 11) % 12) + 1;
        const dep = `${depDisplayHour}:${String(depMin).padStart(2, '0')} ${depIsPm ? 'PM' : 'AM'}`;

        const durationHours = 2 + Math.floor(rng() * 16); // 2..17
        const durationMins = [0, 15, 30, 45][Math.floor(rng() * 4)];
        const duration = `${durationHours}h ${String(durationMins).padStart(2, '0')}m`;

        const cls = rng() < 0.12 ? 'First Class' : 'Business';
        const basePrice = Math.round((durationHours * 85) + (rng() * 250));
        const price = Math.max(199, Math.round(basePrice * (cls === 'First Class' ? 1.35 : 1.0)));

        const arrival = 'See itinerary';

        const id = `FL${pad3(flightIndex)}`;
        const flightNumber = `${airline.code}${100 + Math.floor(rng() * 9000)}`;

        flightData.push({
            id,
            airline: airline.name,
            flightNumber,
            from: `${from.city} (${from.code})`,
            fromCity: from.city,
            fromCode: from.code,
            to: `${to.city} (${to.code})`,
            toCity: to.city,
            toCode: to.code,
            departure: dep,
            arrival,
            duration,
            class: cls,
            price,
            availableSeats: 2 + Math.floor(rng() * 28),
            photoUrl: buildUnsplashFeaturedUrl(900, 600, [to.city, to.country, 'skyline', 'travel'])
        });

        flightIndex += 1;
    }

    // Generate additional hotels
    const hotelNamePrefixes = ['Grand', 'Royal', 'Modern', 'Central', 'Harbor', 'Riverside', 'Metropolitan', 'Vista', 'Heritage', 'Skyline'];
    const hotelNameSuffixes = ['Hotel', 'Plaza', 'Suites', 'Residences', 'Grand Hotel', 'Business Hotel', 'Boutique Hotel'];
    const roomTypes = ['Deluxe Room', 'Executive Suite', 'Business King', 'Premium Queen', 'Junior Suite', 'Corner Suite', 'Club Room'];
    const amenityPool = ['WiFi', 'Breakfast', 'Gym', 'Pool', 'Spa', 'Business Center', 'Airport Shuttle', 'Concierge', 'Restaurant', 'Bar', 'City View', 'Parking'];
    const locationTypes = ['city', 'airport', 'business'];

    let hotelIndex = hotelData.length + 1;
    while (hotelData.length < TARGET_HOTELS) {
        const loc = hotelCities[(hotelData.length + 7) % hotelCities.length];
        const prefix = hotelNamePrefixes[Math.floor(rng() * hotelNamePrefixes.length)];
        const suffix = hotelNameSuffixes[Math.floor(rng() * hotelNameSuffixes.length)];
        const name = `${prefix} ${loc.city} ${suffix}`;

        const rating = rng() < 0.6 ? (rng() < 0.5 ? 4 : 5) : 3;
        const roomType = roomTypes[Math.floor(rng() * roomTypes.length)];

        // Pick 4-8 amenities, ensure common filter amenities exist sometimes
        const shuffled = [...amenityPool].sort(() => rng() - 0.5);
        const amenities = shuffled.slice(0, 4 + Math.floor(rng() * 5));
        if (rng() < 0.65 && !amenities.includes('WiFi')) amenities.push('WiFi');
        if (rng() < 0.45 && !amenities.includes('Breakfast')) amenities.push('Breakfast');

        const base = 90 + (rating * 65) + Math.floor(rng() * 220);
        const price = Math.min(1199, Math.max(99, base));

        const locationType = locationTypes[Math.floor(rng() * locationTypes.length)];

        const id = `HT${pad3(hotelIndex)}`;

        hotelData.push({
            id,
            name,
            location: `${loc.city}, ${loc.country}`,
            city: loc.city,
            country: loc.country,
            rating,
            roomType,
            amenities,
            price,
            available: rng() > 0.06,
            description: `A comfortable ${rating}-star stay in ${loc.city} with business-friendly amenities and easy access to key districts.`,
            address: `${10 + Math.floor(rng() * 990)} ${loc.city} Central Ave, ${loc.city}`,
            phone: `+${1 + Math.floor(rng() * 80)}-${100 + Math.floor(rng() * 900)}-${100 + Math.floor(rng() * 900)}-${1000 + Math.floor(rng() * 9000)}`,
            roomFacilities: ['Work Desk', 'Coffee Maker', 'Safe', 'Smart TV', 'Blackout Curtains', 'In-room WiFi'],
            hotelFacilities: ['24hr Front Desk', 'Laundry Service', 'Meeting Rooms', 'Fitness Center'],
            checkIn: '3:00 PM',
            checkOut: '12:00 PM',
            cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
            locationType,
            photoUrl: buildHotelRoomPhotoUrl(900, 600, id)
        });

        hotelIndex += 1;
    }
}

// Generate larger datasets for demo pages
try {
    ensureLargeDemoData();
} catch (e) {
    console.warn('Failed to generate large demo dataset:', e);
}

// Sample user data - ⚠️ VULNERABILITY: Storing sensitive data in localStorage
// ⚠️ ctf_b64: RkxBR3t1c2VyX3BpaV9kYXRhX2luX3BsYWluX3RleHRfc3RvcmFnZX0=
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
        azurePassword: "Winter2026!",
        // ctf_b64: RkxBR3thenVyZV9jcmVkZW50aWFsc19qb2huX3NtaXRofQ==
        entraId: "a1b2c3d4-e5f6-4789-a012-3456789abcde"
    },
    {
        id: "USR002",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@globalind.com",
        phone: "+1-555-0234",
        company: "Global Industries",
        membershipTier: "Gold",
        password: "Sarah@2026",
        creditCard: "5412-7534-9012-3456",
        cvv: "456",
        cardExpiry: "09/25",
        ssn: "234-56-7890",
        dateOfBirth: "1990-07-22",
        address: "456 Oak Ave, Chicago, IL 60601",
        azureUsername: "sarah.j@bluemountain.onmicrosoft.com",
        azurePassword: "Summer2026!",
        entraId: "b2c3d4e5-f6a7-5890-b123-456789bcdef0"
    },
    {
        id: "USR003",
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@innovlab.io",
        phone: "+1-555-0345",
        company: "Innovation Labs",
        membershipTier: "Silver",
        password: "Chen#2026",
        creditCard: "3714-496353-98431",
        cvv: "7890",
        cardExpiry: "03/27",
        ssn: "345-67-8901",
        dateOfBirth: "1988-11-30",
        address: "789 Tech Blvd, San Francisco, CA 94102",
        azureUsername: "m.chen@bluemountain.onmicrosoft.com",
        azurePassword: "Fall2026!",
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
        azurePassword: "Spring2026!",
        entraId: "d4e5f6a7-b8c9-7012-d345-6789def01234"
    },
    {
        id: "USR005",
        firstName: "David",
        lastName: "Martinez",
        email: "david.martinez@invbank.com",
        phone: "+1-555-0567",
        company: "Investment Bank",
        membershipTier: "Gold",
        password: "DavidM@rtinez2026",
        creditCard: "5105-1051-0510-5100",
        cvv: "789",
        cardExpiry: "11/25",
        ssn: "567-89-0123",
        dateOfBirth: "1987-09-25",
        address: "555 Wall St, New York, NY 10005",
        azureUsername: "david.m@bluemountain.onmicrosoft.com",
        azurePassword: "Banker2026!",
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
        password: "Admin@BlueMountain2026!",
        // ctf_b64: RkxBR3thZG1pbl9wYXNzd29yZF9mb3VuZH0=
        creditCard: "4111-1111-1111-1111",
        cvv: "999",
        cardExpiry: "12/99",
        ssn: "000-00-0000",
        dateOfBirth: "1980-01-01",
        address: "1 Blue Mountain Plaza, Seattle, WA 98101",
        azureUsername: "admin@bluemountain.onmicrosoft.com",
        azurePassword: "AzureAdmin2026!@#",
        entraId: "f6a7b8c9-d0e1-9234-f567-89f012345678",
        // ⚠️ VULNERABILITY: Admin access keys exposed
        adminAccessKey: "BMT-ADMIN-KEY-2026-PROD-abc123xyz789",
        // ctf_b64: RkxBR3thenVyZV9hZG1pbl9hY2Nlc3Nfa2V5X2V4cG9zZWR9
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
    const sasToken = containerName === 'documents' ? AZURE_STORAGE_SAS_TOKEN_DOCUMENTS_WRITE : AZURE_STORAGE_SAS_TOKEN;
    const blobUrl = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${file.name}${sasToken}`;
    
    console.log('Uploading to Azure Storage:', blobUrl);
    
    // This would make an actual upload in production
    return blobUrl;
}

// ⚠️ VULNERABILITY: Generate and upload booking document to Azure Storage
async function generateAndUploadBookingDocument(bookingData, bookingType = 'flight') {
    const timestamp = Date.now();
    const fileName = `${bookingData.bookingId}-${bookingType}-confirmation.json`;
    
    // Generate booking document content
    const documentContent = {
        documentType: `${bookingType.toUpperCase()}_BOOKING_CONFIRMATION`,
        generatedAt: new Date().toISOString(),
        bookingId: bookingData.bookingId,
        status: bookingData.status,
        ...(bookingType === 'flight' ? {
            flightDetails: {
                flightId: bookingData.flightId,
                airline: bookingData.flight?.airline,
                flightNumber: bookingData.flight?.flightNumber,
                from: bookingData.flight?.from,
                to: bookingData.flight?.to,
                departure: bookingData.flight?.departure,
                arrival: bookingData.flight?.arrival,
                duration: bookingData.flight?.duration,
                class: bookingData.flight?.class,
                price: bookingData.flight?.price,
                aircraft: bookingData.flight?.aircraft
            },
            passengerDetails: {
                name: `${bookingData.passenger?.firstName} ${bookingData.passenger?.lastName}`,
                email: bookingData.passenger?.email,
                phone: bookingData.passenger?.phone,
                passportNumber: bookingData.passenger?.passportNumber,
                nationality: bookingData.passenger?.nationality,
                seatPreference: bookingData.passenger?.seatPreference,
                mealPreference: bookingData.passenger?.mealPreference
            }
        } : {
            hotelDetails: {
                hotelId: bookingData.hotelId,
                name: bookingData.hotel?.name,
                location: bookingData.hotel?.location,
                roomType: bookingData.hotel?.roomType,
                rating: bookingData.hotel?.rating,
                pricePerNight: bookingData.hotel?.price
            },
            stayDetails: {
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                nights: bookingData.nights,
                rooms: bookingData.rooms,
                totalPrice: bookingData.payment?.amount
            },
            guestDetails: {
                name: `${bookingData.guest?.firstName} ${bookingData.guest?.lastName}`,
                email: bookingData.guest?.email,
                phone: bookingData.guest?.phone,
                numGuests: bookingData.guest?.numGuests,
                bedType: bookingData.guest?.bedType,
                arrivalTime: bookingData.guest?.arrivalTime
            }
        }),
        payment: {
            method: bookingData.payment?.method,
            amount: bookingData.payment?.amount,
            currency: 'USD'
        },
        bookingDate: bookingData.bookingDate
    };

    // ⚠️ VULNERABILITY: Using write SAS token exposed in client-side code
    const sasToken = AZURE_STORAGE_SAS_TOKEN_DOCUMENTS_WRITE;
    const blobUrl = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/documents/${fileName}${sasToken}`;
    
    console.log('⚠️ Uploading booking document to Azure Storage:', blobUrl);
    console.log('Document content:', documentContent);
    console.log('Using WRITE SAS token with permissions: wlactf');

    try {
        console.log('📤 Starting upload request...');
        const response = await fetch(blobUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-ms-blob-type': 'BlockBlob',
                'x-ms-version': '2024-11-04'
            },
            body: JSON.stringify(documentContent, null, 2)
        });

        console.log('📥 Upload response received:', response.status, response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            console.log('✅ Booking document uploaded successfully!');
            const documentUrl = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/documents/${fileName}`;
            const viewUrl = `${documentUrl}${AZURE_STORAGE_SAS_TOKEN}`;
            console.log('📁 Document URL (no SAS):', documentUrl);
            console.log('🔗 Document URL (with read SAS):', viewUrl);
            return {
                success: true,
                documentUrl: documentUrl,
                documentUrlWithSas: viewUrl,
                fileName: fileName
            };
        } else {
            const errorText = await response.text().catch(() => 'No error details');
            console.error('❌ Failed to upload booking document:', response.status, response.statusText, errorText);
            
            // Check for common issues
            if (response.status === 403) {
                console.error('⚠️ SAS token may be invalid, expired, or missing required permissions');
                console.error('⚠️ Ensure the storage account has CORS enabled for your domain');
            } else if (response.status === 404) {
                console.error('⚠️ Storage account or container may not exist');
            }
            
            return {
                success: false,
                error: `Upload failed: ${response.status} ${response.statusText} - ${errorText}`
            };
        }
    } catch (error) {
        console.error('❌ Error uploading booking document:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Make the function available globally
window.generateAndUploadBookingDocument = generateAndUploadBookingDocument;

// ⚠️ VULNERABILITY: Function that constructs URLs with SAS tokens
function getDocumentUrl(documentId) {
    return `${STORAGE_URLS.documents}/${documentId}`;
}

// Export data for use in other pages
if (typeof window !== 'undefined') {
    window.FlightData = flightData;
    window.HotelData = hotelData;
    window.sampleUsers = sampleUsers;  // ⚠️ VULNERABILITY: Exposing all users globally
    window.getCurrentUser = getCurrentUser;  // Export for use in other pages
    // ctf_b64: RkxBR3thbGxfdXNlcl9kYXRhX2FjY2Vzc2libGVfdmlhX3dpbmRvd19vYmplY3R9
    window.AzureConfig = {
        storageAccount: STORAGE_ACCOUNT_NAME,
        sasToken: AZURE_STORAGE_SAS_TOKEN,
        documentsWriteSasToken: AZURE_STORAGE_SAS_TOKEN_DOCUMENTS_WRITE,
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
console.log('CTF markers are embedded throughout the app.');
console.log('Hints: check localStorage, view-source, and network requests.');
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
