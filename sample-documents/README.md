# Sample Booking Documents

These are sample PDF documents that can be uploaded to Azure Blob Storage to demonstrate the booking confirmation functionality.

## Document Naming Convention

When bookings are created, they reference documents with these patterns:

### Flight Bookings
- **Document URL**: `bookings/{timestamp}-booking.pdf`
- **Confirmation URL**: `documents/confirmation-{timestamp}.pdf`

### Hotel Bookings
- **Document URL**: `bookings/{timestamp}-hotel-booking.pdf`
- **Confirmation URL**: `documents/hotel-confirmation-{timestamp}.pdf`

## Upload Instructions

### Option 1: Azure Portal
1. Go to Storage Account: `bluemountaintravel`
2. Open **Containers**
3. Upload to **bookings** container:
   - `sample-flight-booking.pdf` → rename to match your booking ID timestamp (e.g., `1704096000001-booking.pdf`)
   - `sample-hotel-confirmation.pdf` → rename to match format (e.g., `1704096000002-hotel-booking.pdf`)
4. Upload to **documents** container:
   - Create confirmation documents with matching timestamps

### Option 2: Azure Storage Explorer
1. Open Azure Storage Explorer
2. Connect to `bluemountaintravel` storage account
3. Navigate to containers
4. Drag and drop files with appropriate names

### Option 3: PowerShell (if you have Azure PowerShell)
```powershell
$storageAccount = "bluemountaintravel"
$containerName = "bookings"
$resourceGroup = "rg-bluemountain-training"

# Get storage context
$ctx = (Get-AzStorageAccount -ResourceGroupName $resourceGroup -Name $storageAccount).Context

# Upload flight booking
Set-AzStorageBlobContent -File "./sample-flight-booking.pdf" `
  -Container $containerName `
  -Blob "1704096000001-booking.pdf" `
  -Context $ctx

# Upload hotel booking
Set-AzStorageBlobContent -File "./sample-hotel-confirmation.pdf" `
  -Container $containerName `
  -Blob "1704096000002-hotel-booking.pdf" `
  -Context $ctx
```

## Sample Booking Data

To test with these documents, create bookings in localStorage with these IDs:

```javascript
// Flight booking
{
  bookingId: "BK1704096000001",
  documentUrl: "https://bluemountaintravel.blob.core.windows.net/bookings/1704096000001-booking.pdf?sv=...",
  confirmationUrl: "https://bluemountaintravel.blob.core.windows.net/documents/confirmation-1704096000001.pdf?sv=..."
}

// Hotel booking
{
  bookingId: "HB1704096000002",
  documentUrl: "https://bluemountaintravel.blob.core.windows.net/bookings/1704096000002-hotel-booking.pdf?sv=...",
  confirmationUrl: "https://bluemountaintravel.blob.core.windows.net/documents/hotel-confirmation-1704096000002.pdf?sv=..."
}
```

## Security Vulnerabilities in Documents

⚠️ These documents intentionally expose:
- Full passenger/guest names
- Email addresses and phone numbers
- Partial credit card numbers
- Billing addresses
- SSN and CVV (in hotel confirmation)
- CTF flags embedded in the PDFs

This demonstrates the risk of storing sensitive PII in publicly accessible blob storage without proper encryption or access controls.
