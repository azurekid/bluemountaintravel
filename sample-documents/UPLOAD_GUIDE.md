# Batch Upload Guide for Generated Booking Documents

## Generated Documents

The `generate_bookings.py` script created **20 booking documents** for all 10 users in the database:

### Users (USR001 - USR010):
- **John Smith** (USR001) - john.smith@techcorp.com
- **Sarah Johnson** (USR002) - sarah.johnson@globalind.com
- **Michael Chen** (USR003) - michael.chen@innovlab.io
- **Emma Williams** (USR004) - emma.williams@stratcon.com
- **David Martinez** (USR005) - david.martinez@invbank.com
- **Lisa Anderson** (USR006) - lisa.anderson@medtech.com
- **Robert Brown** (USR007) - robert.brown@lawfirm.com
- **Jennifer Davis** (USR008) - jennifer.davis@edu.edu
- **James Wilson** (USR009) - james.wilson@startup.io
- **Maria Garcia** (USR010) - maria.garcia@retail.com

### Document Naming Convention:
- **Flight bookings**: `BK{timestamp}-{userid}-flight.pdf`
- **Hotel bookings**: `HB{timestamp}-{userid}-hotel.pdf`

## Upload Methods

### Option 1: PowerShell Script (Recommended)
```powershell
cd sample-documents
./upload-all-documents.ps1
```

This script will upload all 20 documents to the `bookings` container automatically.

### Option 2: Azure Storage Explorer
1. Open Azure Storage Explorer
2. Navigate to: bluemountaintravel → Blob Containers → bookings
3. Click "Upload" → "Upload Files"
4. Select all files from `sample-documents/generated/`
5. Click "Upload"

### Option 3: Azure CLI
```bash
# Upload all flight bookings
for file in sample-documents/generated/BK*.pdf; do
  az storage blob upload \
    --account-name bluemountaintravel \
    --container-name bookings \
    --name $(basename "$file") \
    --file "$file" \
    --auth-mode login
done

# Upload all hotel bookings
for file in sample-documents/generated/HB*.pdf; do
  az storage blob upload \
    --account-name bluemountaintravel \
    --container-name bookings \
    --name $(basename "$file") \
    --file "$file" \
    --auth-mode login
done
```

### Option 4: Azure Portal Manual Upload
1. Go to: https://portal.azure.com
2. Navigate to: Storage accounts → bluemountaintravel → Containers → bookings
3. Click "Upload" button
4. Drag all PDF files from `sample-documents/generated/`
5. Click "Upload"

## Document Details

Each document contains:
- ✅ **Realistic booking information** (flights, hotels, dates, prices)
- ✅ **Full user PII** (names, emails, phones, addresses)
- ⚠️ **Intentional vulnerabilities**:
  - Full credit card numbers (not masked)
  - Social Security Numbers
  - CVV codes
  - CTF flags for security training

### Flight Bookings (10 documents):
| User ID | Booking ID | Flight | Route | Price |
|---------|-----------|--------|-------|-------|
| USR001 | BK1704096000000 | Delta DL1234 | JFK → LHR | $749 |
| USR002 | BK1704096001000 | American AA9012 | ORD → CDG | $699 |
| USR003 | BK1704096002000 | United UA3456 | SFO → LHR | $829 |
| USR004 | BK1704096003000 | Delta DL1234 | JFK → LHR | $749 |
| USR005 | BK1704096004000 | American AA9012 | ORD → CDG | $699 |
| USR006 | BK1704096005000 | United UA5678 | SFO → NRT | $999 |
| USR007 | BK1704096006000 | Delta DL1234 | JFK → LHR | $749 |
| USR008 | BK1704096007000 | American AA9012 | ORD → CDG | $699 |
| USR009 | BK1704096008000 | United UA3456 | SFO → LHR | $829 |
| USR010 | BK1704096009000 | Delta DL1234 | JFK → LHR | $749 |

### Hotel Bookings (10 documents):
| User ID | Booking ID | Hotel | Location | Price/Night | Nights | Total |
|---------|-----------|-------|----------|-------------|--------|-------|
| USR001 | HB1704096000500 | Grand Hyatt | New York | $299 | 7 | $2,093 |
| USR002 | HB1704096001500 | Ritz-Carlton | London | $399 | 7 | $2,793 |
| USR003 | HB1704096002500 | Park Hyatt | Tokyo | $449 | 7 | $3,143 |
| USR004 | HB1704096003500 | Grand Hyatt | New York | $299 | 7 | $2,093 |
| USR005 | HB1704096004500 | Ritz-Carlton | London | $399 | 7 | $2,793 |
| USR006 | HB1704096005500 | Burj Al Arab | Dubai | $899 | 7 | $6,293 |
| USR007 | HB1704096006500 | Marina Bay Sands | Singapore | $349 | 7 | $2,443 |
| USR008 | HB1704096007500 | Grand Hyatt | New York | $299 | 7 | $2,093 |
| USR009 | HB1704096008500 | Ritz-Carlton | London | $399 | 7 | $2,793 |
| USR010 | HB1704096009500 | Park Hyatt | Tokyo | $449 | 7 | $3,143 |

## CTF Flags

Each document contains unique flags for security training.

To avoid making flags obvious in documentation, the generated PDFs embed flags as `ctf_b64: <base64>` markers.
Search the PDF text for `ctf_b64:` and decode the base64 value to recover the underlying flag.

## Access URLs

After upload, documents will be accessible at:
```
https://bluemountaintravel.blob.core.windows.net/bookings/{filename}?{sas_token}
```

Example:
```
https://bluemountaintravel.blob.core.windows.net/bookings/BK1704096000000-USR001-flight.pdf?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-12-31T08:31:49Z&st=2026-12-29T00:31:49Z&spr=https,http&sig=O0o5ozFAVlIWvdTPWXpGaOFEyAjTpZM58U9IqvPHRLU%3D
```

## Verification

After upload, verify in Azure Portal:
1. Navigate to: Storage accounts → bluemountaintravel → Containers → bookings
2. Confirm 20 PDF files are present
3. Click any file to preview/download and verify content

## Integration with Bookings Page

To link these documents to user bookings, update the bookings data in localStorage:

```javascript
const bookings = [
  {
    id: "BK1704096000000",
    userId: "USR001",
    type: "flight",
    date: "2026-01-15",
    documentUrl: "https://bluemountaintravel.blob.core.windows.net/bookings/BK1704096000000-USR001-flight.pdf?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2027-12-31T08:31:49Z&st=2026-12-29T00:31:49Z&spr=https,http&sig=O0o5ozFAVlIWvdTPWXpGaOFEyAjTpZM58U9IqvPHRLU%3D"
  },
  // ... more bookings
];
localStorage.setItem('bookings', JSON.stringify(bookings));
```
