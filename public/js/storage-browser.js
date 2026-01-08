// Storage Browser functionality
// ⚠️ VULNERABILITY: Public access to Azure storage without authentication
// ctf_b64: RkxBR3tzdG9yYWdlX2Jyb3dzZXJfbm9fYXV0aF9yZXF1aXJlZH0=

function browseContainer(containerName) {
    console.log('Browsing container:', containerName);
    
    document.getElementById('container-browser').style.display = 'block';
    document.getElementById('container-title').textContent = `📦 Container: ${containerName}`;
    
    const fileList = document.getElementById('file-list');
    
    let files = [];
    
    switch(containerName) {
        case 'passports':
            files = getPassportFiles();
            break;
        case 'profiles':
            files = getProfileFiles();
            break;
        case 'bookings':
            files = getBookingFiles();
            break;
        case 'documents':
            files = getDocumentFiles();
            break;
    }
    
    let html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">';
    html += '<th style="padding: 1rem; text-align: left;">File Name</th>';
    html += '<th style="padding: 1rem; text-align: left;">Size</th>';
    html += '<th style="padding: 1rem; text-align: left;">Modified</th>';
    html += '<th style="padding: 1rem; text-align: left;">Actions</th>';
    html += '</tr></thead><tbody>';
    
    files.forEach((file, index) => {
        html += `<tr style="border-bottom: 1px solid #dee2e6; ${index % 2 === 0 ? 'background: #f8f9fa;' : ''}">`;
        html += `<td style="padding: 1rem;">${file.name}</td>`;
        html += `<td style="padding: 1rem;">${file.size}</td>`;
        html += `<td style="padding: 1rem;">${file.modified}</td>`;
        html += `<td style="padding: 1rem;">`;
        html += `<button class="btn-search" style="font-size: 0.85rem; padding: 0.5rem 1rem;" onclick="downloadFile('${file.url}', '${file.name}')">Download</button> `;
        html += `<button class="btn-search" style="font-size: 0.85rem; padding: 0.5rem 1rem; background: #6c757d;" onclick="viewFileDetails('${file.name}')">Details</button>`;
        html += `</td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    
    fileList.innerHTML = html;
    
    // Scroll to browser
    document.getElementById('container-browser').scrollIntoView({ behavior: 'smooth' });
}

function getPassportFiles() {
    const passports = window.passportDatabase || [];
    return passports.map(p => ({
        name: p.storageInfo.blobName,
        size: Math.floor(Math.random() * 5000) + 1000 + ' KB',
        modified: p.storageInfo.scanDate,
        url: p.storageInfo.url,
        metadata: {
            employeeId: p.employeeId,
            passportNumber: p.passportNumber,
            nationality: p.nationality
        }
    }));
}

function getProfileFiles() {
    const users = window.sampleUsers || [];
    return users.map(u => ({
        name: `user-${u.id}.json`,
        size: '15 KB',
        modified: '2026-01-15T10:00:00Z',
        url: `https://bluemountaintravel.blob.core.windows.net/profiles/user-${u.id}.json?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D`,
        metadata: {
            email: u.email,
            name: `${u.firstName} ${u.lastName}`
        }
    }));
}

function getBookingFiles() {
    return [
        {
            name: 'booking-BK1234567890.pdf',
            size: '234 KB',
            modified: '2026-01-20T14:30:00Z',
            url: 'https://bluemountaintravel.blob.core.windows.net/bookings/booking-BK1234567890.pdf?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D'
        },
        {
            name: 'booking-HB9876543210.pdf',
            size: '189 KB',
            modified: '2026-01-19T09:15:00Z',
            url: 'https://bluemountaintravel.blob.core.windows.net/bookings/booking-HB9876543210.pdf?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D'
        }
    ];
}

function getDocumentFiles() {
    return [
        {
            name: 'app-registrations.json',
            size: '8 KB',
            modified: '2026-01-15T10:30:00Z',
            url: 'https://bluemountaintravel.blob.core.windows.net/documents/app-registrations.json?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D',
            metadata: {
                description: 'Azure App Registration credentials and service principals',
                warning: 'Contains sensitive credentials!'
            }
        },
        {
            name: 'employee-database.json',
            size: '45 KB',
            modified: '2026-01-18T16:00:00Z',
            url: 'https://bluemountaintravel.blob.core.windows.net/documents/employee-database.json?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D',
            metadata: {
                description: 'Complete employee records with PII',
                records: 6
            }
        },
        {
            name: 'azure-credentials.txt',
            size: '3 KB',
            modified: '2026-01-10T08:00:00Z',
            url: 'https://bluemountaintravel.blob.core.windows.net/documents/azure-credentials.txt?sv=2024-11-04&ss=bfqt&srt=c&sp=rlitfx&se=2027-01-08T20:04:11Z&st=2026-01-08T11:49:11Z&spr=https,http&sig=JZuBqq36vX1MdzJv11ED2wtUfGNVWSVUZx5rThhJrH4%3D'
        }
    ];
}

function downloadFile(url, filename) {
    console.log('Downloading file:', filename);
    console.log('URL:', url);
    // ctf_b64: RkxBR3tkb3dubG9hZGluZ19maWxlc193aXRoX3Nhc190b2tlbn0=
    
    alert(`Downloading: ${filename}\n\nURL: ${url}\n\nIn a real scenario, the file would download now.\n\nFor training purposes, the download URL with SAS token has been logged to console.`);
}

function viewFileDetails(filename) {
    console.log('Viewing file details:', filename);
    
    let details = `File: ${filename}\n\n`;
    
    if (filename.includes('passport')) {
        const passportId = filename.split('-')[0];
        const passport = window.passportDatabase?.find(p => p.storageInfo.blobName === filename);
        
        if (passport) {
            details += `Passport Details:\n`;
            details += `Name: ${passport.personalInfo.givenNames} ${passport.personalInfo.surname}\n`;
            details += `Passport Number: ${passport.passportNumber}\n`;
            details += `Nationality: ${passport.nationality}\n`;
            details += `Employee ID: ${passport.employeeId}\n`;
            details += `Date of Birth: ${passport.personalInfo.dateOfBirth}\n`;
            details += `\nDownload URL:\n${passport.storageInfo.url}`;
            console.log('Passport data:', passport);
        }
    } else if (filename.includes('user')) {
        details += `User Profile\n`;
        details += `Contains: Personal info, passwords, credit cards, SSN\n`;
        details += `⚠️ Highly sensitive data`;
    } else if (filename.includes('app-registrations')) {
        details += `Azure App Registration Credentials\n`;
        details += `Contains: Service principal secrets, Azure credentials\n`;
        details += `⚠️ Full Azure subscription access\n`;
        details += `\nThis file is also available at: /app-registrations.json`;
    }
    
    alert(details);
}

function closeContainer() {
    document.getElementById('container-browser').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Log storage information on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== AZURE STORAGE BROWSER ===');
    console.log('Storage Account: bluemountaintravel');
    console.log('Containers: passports, profiles, bookings, documents');
    console.log('');
    console.log('⚠️ VULNERABILITIES:');
    console.log('1. Public SAS token with full permissions (rwdlacupiytfx)');
    console.log('2. No authentication required to browse containers');
    console.log('3. Passport PDFs accessible via direct URLs');
    console.log('4. App registration credentials in documents container');
    console.log('5. Employee PII in profiles container');
    console.log('');
    // Flags are intentionally present for the training scenario, but not printed verbatim.
    // ctf_b64: RkxBR3tzdG9yYWdlX2Jyb3dzZXJfbm9fYXV0aF9yZXF1aXJlZH0=
    // ctf_b64: RkxBR3twYXNzcG9ydF9jb250YWluZXJfbm9fYXV0aGVudGljYXRpb259
    // ctf_b64: RkxBR3thcHBfcmVnaXN0cmF0aW9uX2NyZWRlbnRpYWxzX2luX3B1YmxpY19zdG9yYWdlfQ==
    console.log('💡 LATERAL MOVEMENT:');
    console.log('- Use app-registrations.json credentials to access Key Vault');
    console.log('- Get storage account key from Key Vault');
    console.log('- Full access to all containers with account key');
    console.log('============================');
});

// Export functions
window.browseContainer = browseContainer;
window.downloadFile = downloadFile;
window.viewFileDetails = viewFileDetails;
window.closeContainer = closeContainer;
