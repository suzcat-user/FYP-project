# PowerShell script to set up communities database
# Run this from the server directory

Write-Host "Setting up communities database..." -ForegroundColor Cyan

# Database credentials (from server/index.js)
$DB_HOST = "mysql-f6dd3cc-myrp-fypp.d.aivencloud.com"
$DB_USER = "avnadmin"
$DB_PORT = "23353"
$DB_NAME = "defaultdb"
$DB_PASSWORD = "AVNS_xREgo-7cfTkD9oJUroh"

Write-Host "Connecting to database: $DB_NAME" -ForegroundColor Yellow

# Check if mysql client is available
$mysqlPath = (Get-Command mysql -ErrorAction SilentlyContinue).Source

if (-not $mysqlPath) {
    Write-Host "❌ MySQL client not found. Please install MySQL client or use an alternative method." -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Copy the contents of setup-communities.sql and run it manually in your database client." -ForegroundColor Yellow
    exit 1
}

# Run the setup script
Write-Host "Running setup-communities.sql..." -ForegroundColor Cyan
& mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD -P $DB_PORT --ssl-mode=REQUIRED $DB_NAME -e "source setup-communities.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Communities setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Restart your server: npm start" -ForegroundColor White
    Write-Host "2. Test the API: curl http://localhost:3001/api/communities" -ForegroundColor White
    Write-Host "3. Check SETUP_COMMUNITIES_GUIDE.md for usage examples" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Setup failed. Please check your database connection." -ForegroundColor Red
    Write-Host ""
    Write-Host "You can also run the SQL manually:" -ForegroundColor Yellow
    Write-Host "1. Open your MySQL client" -ForegroundColor White
    Write-Host "2. Connect to your database" -ForegroundColor White
    Write-Host "3. Copy and paste the contents of setup-communities.sql" -ForegroundColor White
    exit 1
}
