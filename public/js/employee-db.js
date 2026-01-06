// Employee Information Database
// ⚠️ VULNERABILITY: Employee data exposed without authentication
// FLAG{employee_database_publicly_accessible}

// ⚠️ Simulated employee database from HR system
const employeeDatabase = [
    {
        employeeId: "EMP001",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@company.com",
        personalEmail: "john.smith85@gmail.com",
        phone: "+1-555-0123",
        mobilePhone: "+1-555-9876",
        department: "Technology",
        jobTitle: "Senior Software Engineer",
        manager: "Sarah Johnson",
        location: "New York Office",
        salary: 145000,
        hireDate: "2020-03-15",
        dateOfBirth: "1985-03-15",
        ssn: "123-45-6789",
        emergencyContact: "Jane Smith (Wife) - +1-555-5555",
        homeAddress: "123 Main St, New York, NY 10001",
        // ⚠️ IT credentials
        adUsername: "jsmith",
        azureUsername: "john.smith@bluemountain.onmicrosoft.com",
        lastPasswordChange: "2024-01-15",
        passwordExpiry: "2024-07-15",
        vpnAccess: true,
        accessLevel: "Standard",
        // Security question answers
        securityQuestions: {
            mothersMaidenName: "Anderson",
            firstPetName: "Max",
            cityBorn: "Boston"
        }
    },
    {
        employeeId: "EMP002",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@enterprise.com",
        personalEmail: "s.johnson1990@yahoo.com",
        phone: "+1-555-0234",
        mobilePhone: "+1-555-8765",
        department: "Management",
        jobTitle: "Engineering Manager",
        manager: "David Martinez",
        location: "Chicago Office",
        salary: 165000,
        hireDate: "2018-06-01",
        dateOfBirth: "1990-07-22",
        ssn: "234-56-7890",
        emergencyContact: "Mike Johnson (Brother) - +1-555-4444",
        homeAddress: "456 Oak Ave, Chicago, IL 60601",
        adUsername: "sjohnson",
        azureUsername: "sarah.j@bluemountain.onmicrosoft.com",
        lastPasswordChange: "2024-02-01",
        passwordExpiry: "2024-08-01",
        vpnAccess: true,
        accessLevel: "Manager",
        securityQuestions: {
            mothersMaidenName: "Williams",
            firstPetName: "Bella",
            cityBorn: "Seattle"
        }
    },
    {
        employeeId: "EMP003",
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@startups.io",
        personalEmail: "mike.chen88@hotmail.com",
        phone: "+1-555-0345",
        mobilePhone: "+1-555-7654",
        department: "Technology",
        jobTitle: "DevOps Engineer",
        manager: "Sarah Johnson",
        location: "San Francisco Office",
        salary: 155000,
        hireDate: "2021-09-01",
        dateOfBirth: "1988-11-30",
        ssn: "345-67-8901",
        emergencyContact: "Lisa Chen (Mother) - +1-555-3333",
        homeAddress: "789 Tech Blvd, San Francisco, CA 94102",
        adUsername: "mchen",
        azureUsername: "m.chen@bluemountain.onmicrosoft.com",
        lastPasswordChange: "2023-12-20",
        passwordExpiry: "2024-06-20",
        vpnAccess: true,
        accessLevel: "Elevated",
        securityQuestions: {
            mothersMaidenName: "Lee",
            firstPetName: "Lucky",
            cityBorn: "Vancouver"
        }
    },
    {
        employeeId: "EMP004",
        firstName: "Emma",
        lastName: "Williams",
        email: "emma.w@consulting.com",
        personalEmail: "emma.williams92@outlook.com",
        phone: "+1-555-0456",
        mobilePhone: "+1-555-6543",
        department: "Consulting",
        jobTitle: "Senior Consultant",
        manager: "David Martinez",
        location: "Boston Office",
        salary: 140000,
        hireDate: "2019-04-10",
        dateOfBirth: "1992-05-18",
        ssn: "456-78-9012",
        emergencyContact: "Robert Williams (Father) - +1-555-2222",
        homeAddress: "321 Corporate Dr, Boston, MA 02101",
        adUsername: "ewilliams",
        azureUsername: "emma.williams@bluemountain.onmicrosoft.com",
        lastPasswordChange: "2024-01-30",
        passwordExpiry: "2024-07-30",
        vpnAccess: true,
        accessLevel: "Standard",
        securityQuestions: {
            mothersMaidenName: "Brown",
            firstPetName: "Whiskers",
            cityBorn: "Portland"
        }
    },
    {
        employeeId: "EMP005",
        firstName: "David",
        lastName: "Martinez",
        email: "d.martinez@finance.com",
        personalEmail: "david.m.martinez@gmail.com",
        phone: "+1-555-0567",
        mobilePhone: "+1-555-5432",
        department: "Finance",
        jobTitle: "VP of Finance",
        manager: "System Administrator",
        location: "New York Office",
        salary: 195000,
        hireDate: "2016-01-15",
        dateOfBirth: "1987-09-25",
        ssn: "567-89-0123",
        emergencyContact: "Maria Martinez (Wife) - +1-555-1111",
        homeAddress: "555 Wall St, New York, NY 10005",
        adUsername: "dmartinez",
        azureUsername: "david.m@bluemountain.onmicrosoft.com",
        lastPasswordChange: "2024-02-10",
        passwordExpiry: "2024-08-10",
        vpnAccess: true,
        accessLevel: "Executive",
        securityQuestions: {
            mothersMaidenName: "Garcia",
            firstPetName: "Rex",
            cityBorn: "Miami"
        }
    },
    {
        employeeId: "ADMIN",
        firstName: "System",
        lastName: "Administrator",
        email: "admin@bluemountaintravel.com",
        personalEmail: "sysadmin@protonmail.com",
        phone: "+1-555-9999",
        mobilePhone: "+1-555-0001",
        department: "IT",
        jobTitle: "System Administrator",
        manager: "N/A",
        location: "Seattle HQ",
        salary: 175000,
        hireDate: "2015-01-01",
        dateOfBirth: "1980-01-01",
        ssn: "000-00-0000",
        emergencyContact: "IT Department - +1-555-9999",
        homeAddress: "1 Blue Mountain Plaza, Seattle, WA 98101",
        adUsername: "admin",
        azureUsername: "admin@bluemountain.onmicrosoft.com",
        lastPasswordChange: "2024-01-01",
        passwordExpiry: "2099-12-31",
        vpnAccess: true,
        accessLevel: "Domain Admin",
        securityQuestions: {
            mothersMaidenName: "Admin",
            firstPetName: "Admin",
            cityBorn: "Seattle"
        },
        // ⚠️ CRITICAL: Admin has Azure subscription access
        azureSubscriptionRole: "Owner",
        azureSubscriptionId: "12345678-1234-1234-1234-123456789012"
    }
];

// ⚠️ VULNERABILITY: Function to search employees without authentication
function searchEmployees(query) {
    console.log('Searching employee database for:', query);
    // FLAG{employee_search_no_authentication}
    
    const results = employeeDatabase.filter(emp => {
        const searchStr = query.toLowerCase();
        return emp.firstName.toLowerCase().includes(searchStr) ||
               emp.lastName.toLowerCase().includes(searchStr) ||
               emp.email.toLowerCase().includes(searchStr) ||
               emp.department.toLowerCase().includes(searchStr) ||
               emp.adUsername.toLowerCase().includes(searchStr);
    });
    
    console.log(`Found ${results.length} employees`);
    console.table(results);
    return results;
}

// ⚠️ VULNERABILITY: Export employee data
function exportEmployeeData() {
    console.log('Exporting employee database...');
    console.log('Total employees:', employeeDatabase.length);
    // FLAG{employee_pii_export_without_auth}
    
    console.table(employeeDatabase);
    
    // Show sensitive data summary
    console.log('\n=== SENSITIVE EMPLOYEE DATA ===');
    employeeDatabase.forEach(emp => {
        console.log(`${emp.firstName} ${emp.lastName} (${emp.employeeId})`);
        console.log(`  Email: ${emp.email}`);
        console.log(`  Personal Email: ${emp.personalEmail}`);
        console.log(`  SSN: ${emp.ssn}`);
        console.log(`  Salary: $${emp.salary.toLocaleString()}`);
        console.log(`  AD Username: ${emp.adUsername}`);
        console.log(`  Azure Username: ${emp.azureUsername}`);
        console.log(`  Access Level: ${emp.accessLevel}`);
        console.log(`  Security Questions:`, emp.securityQuestions);
        console.log('');
    });
    
    return employeeDatabase;
}

// ⚠️ VULNERABILITY: Get employee by username (for password spray target discovery)
function getEmployeeByUsername(username) {
    const employee = employeeDatabase.find(emp => 
        emp.adUsername === username || 
        emp.azureUsername === username ||
        emp.email === username
    );
    
    if (employee) {
        console.log('Employee found:', employee);
        return employee;
    } else {
        console.log('Employee not found:', username);
        return null;
    }
}

// ⚠️ VULNERABILITY: List all Azure usernames for targeting
function getAllAzureUsernames() {
    const usernames = employeeDatabase.map(emp => emp.azureUsername);
    console.log('All Azure/Entra usernames for password spraying:');
    console.log(usernames);
    // FLAG{azure_username_list_for_password_spray}
    return usernames;
}

// ⚠️ VULNERABILITY: List all AD usernames
function getAllADUsernames() {
    const usernames = employeeDatabase.map(emp => emp.adUsername);
    console.log('All AD usernames:');
    console.log(usernames);
    return usernames;
}

// ⚠️ VULNERABILITY: Get employees with elevated access
function getPrivilegedEmployees() {
    const privileged = employeeDatabase.filter(emp => 
        emp.accessLevel === 'Domain Admin' || 
        emp.accessLevel === 'Elevated' ||
        emp.accessLevel === 'Executive'
    );
    
    console.log('Employees with elevated access:');
    console.table(privileged);
    // FLAG{privileged_account_list_exposed}
    
    return privileged;
}

// Export to window for global access
if (typeof window !== 'undefined') {
    window.employeeDatabase = employeeDatabase;
    window.searchEmployees = searchEmployees;
    window.exportEmployeeData = exportEmployeeData;
    window.getEmployeeByUsername = getEmployeeByUsername;
    window.getAllAzureUsernames = getAllAzureUsernames;
    window.getAllADUsernames = getAllADUsernames;
    window.getPrivilegedEmployees = getPrivilegedEmployees;
}

console.log('=== EMPLOYEE DATABASE LOADED ===');
console.log(`Total employees: ${employeeDatabase.length}`);
console.log('Access functions:');
console.log('  - searchEmployees("name")');
console.log('  - exportEmployeeData()');
console.log('  - getAllAzureUsernames()');
console.log('  - getPrivilegedEmployees()');
console.log('================================');
