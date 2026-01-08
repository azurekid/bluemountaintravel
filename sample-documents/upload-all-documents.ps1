# PowerShell script to upload all generated booking documents to Azure Blob Storage
# Run this script to upload all 20 booking PDFs to the bluemountaintravel storage account

$storageAccount = "bluemountaintravel"
$containerName = "bookings"
$sasToken = "?sp=racwdl&st=2026-01-07T13:20:05Z&se=2027-01-07T21:35:05Z&sv=2024-11-04&sr=c&sig=SUq3H4PGgqH06ZsU78F1p2CqYq8y3P25njJ10U5gw1M%3D"

# Array of all generated documents
$documents = @(
    "BK1704096000000-USR001-flight.pdf",
    "HB1704096000500-USR001-hotel.pdf",
    "BK1704096001000-USR002-flight.pdf",
    "HB1704096001500-USR002-hotel.pdf",
    "BK1704096002000-USR003-flight.pdf",
    "HB1704096002500-USR003-hotel.pdf",
    "BK1704096003000-USR004-flight.pdf",
    "HB1704096003500-USR004-hotel.pdf",
    "BK1704096004000-USR005-flight.pdf",
    "HB1704096004500-USR005-hotel.pdf",
    "BK1704096005000-USR006-flight.pdf",
    "HB1704096005500-USR006-hotel.pdf",
    "BK1704096006000-USR007-flight.pdf",
    "HB1704096006500-USR007-hotel.pdf",
    "BK1704096007000-USR008-flight.pdf",
    "HB1704096007500-USR008-hotel.pdf",
    "BK1704096008000-USR009-flight.pdf",
    "HB1704096008500-USR009-hotel.pdf",
    "BK1704096009000-USR010-flight.pdf",
    "HB1704096009500-USR010-hotel.pdf"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$generatedDir = Join-Path $scriptDir "generated"

Write-Host "Starting upload of $($documents.Count) documents..." -ForegroundColor Cyan

foreach ($doc in $documents) {
    $filePath = Join-Path $generatedDir $doc
    
    if (Test-Path $filePath) {
        $blobUrl = "https://$storageAccount.blob.core.windows.net/$containerName/$doc$sasToken"
        
        try {
            $headers = @{
                "x-ms-blob-type" = "BlockBlob"
                "Content-Type" = "application/pdf"
            }
            
            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            
            Write-Host "Uploading $doc..." -NoNewline
            Invoke-RestMethod -Uri $blobUrl -Method Put -Headers $headers -Body $fileBytes -ErrorAction Stop
            Write-Host " ✓ Success" -ForegroundColor Green
        }
        catch {
            Write-Host " ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "File not found: $filePath" -ForegroundColor Yellow
    }
}

Write-Host "`nUpload complete!" -ForegroundColor Cyan
Write-Host "View uploaded files at: https://portal.azure.com/#view/Microsoft_Azure_Storage/ContainerMenuBlade/~/overview/storageAccountId/%2Fsubscriptions%2Fe4f84c7b-bc6d-465c-bc1e-8abd1a1cafdb%2FresourceGroups%2Fbluemountaintravel%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fbluemountaintravel/path/bookings/etag/%220x8DD2803CEE55E20%22/defaultEncryptionScope/%24account-encryption-key/denyEncryptionScopeOverride~/false/defaultId//publicAccessVal/Container" -ForegroundColor Cyan
