#!/bin/bash
# Run this script to set up the community database tables

echo "Setting up communities database..."

# Your database credentials (from server/index.js)
DB_HOST="mysql-f6dd3cc-myrp-fypp.d.aivencloud.com"
DB_USER="avnadmin"
DB_PORT="23353"
DB_NAME="defaultdb"

echo "Connecting to database: $DB_NAME"
echo "You will be prompted for the password: AVNS_xREgo-7cfTkD9oJUroh"

# Run the setup script
mysql -h $DB_HOST -u $DB_USER -P $DB_PORT --ssl-mode=REQUIRED $DB_NAME < setup-communities.sql

if [ $? -eq 0 ]; then
    echo "✅ Communities setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Restart your server: npm start"
    echo "2. Test the API: curl http://localhost:3001/api/communities"
    echo "3. Check SETUP_COMMUNITIES_GUIDE.md for usage examples"
else
    echo "❌ Setup failed. Please check your database connection."
    exit 1
fi
