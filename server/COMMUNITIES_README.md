# Community Database Setup

## Quick Start

### Option 1: Using PowerShell (Windows)
```powershell
cd server
.\run-setup.ps1
```

### Option 2: Using Bash (Mac/Linux)
```bash
cd server
bash run-setup.sh
```

### Option 3: Manual Setup
1. Open your MySQL client (MySQL Workbench, DBeaver, etc.)
2. Connect to your database
3. Open `setup-communities.sql`
4. Execute the entire file

### Option 4: Command Line (Direct)
```bash
mysql -h mysql-f6dd3cc-myrp-fypp.d.aivencloud.com \
      -u avnadmin \
      -p \
      -P 23353 \
      --ssl-mode=REQUIRED \
      defaultdb < setup-communities.sql
```
Password: `AVNS_xREgo-7cfTkD9oJUroh`

## What This Does

Creates 3 new database tables:

1. **communities** - Stores all available communities
2. **personality_community_mapping** - Links personality types to communities
3. **hobbies** (optional) - Links specific hobbies to communities

And populates them with:
- 6 communities (Outdoor & Fitness, Culinary, Gaming, Arts, Crafts, Music)
- Personality mappings for F, C, N, S, L personality codes

## Verify Setup

After running, check the tables were created:

```sql
SELECT * FROM communities;
SELECT * FROM personality_community_mapping;
```

## API Endpoints Added

- `GET /api/communities` - Get all communities
- `GET /api/communities/:id` - Get specific community
- `GET /api/communities/personality/:code` - Get communities for personality (F, C, N, S, L)
- `GET /api/communities/user/:user_id/recommended` - Get personalized recommendations

## Test the API

```bash
# Get all communities
curl http://localhost:3001/api/communities

# Get communities for Creative personality
curl http://localhost:3001/api/communities/personality/C

# Get recommendations for user 1
curl http://localhost:3001/api/communities/user/1/recommended
```

## Documentation

See `../SETUP_COMMUNITIES_GUIDE.md` for:
- Complete API documentation
- Frontend integration examples
- Troubleshooting tips

See `../COMMUNITY_PERSONALITY_MAPPING.md` for:
- Detailed database schema
- Query examples
- Analytics queries
- Architecture overview

## Files

- `setup-communities.sql` - Main setup script (MySQL)
- `schema-communities.sql` - Full schema with comments (MySQL)
- `schema-communities-postgres.sql` - PostgreSQL version
- `routes/communities.js` - API routes (already integrated)
- `run-setup.ps1` - PowerShell setup script
- `run-setup.sh` - Bash setup script

## Troubleshooting

### "Table already exists" error
This is safe to ignore. The script uses `CREATE TABLE IF NOT EXISTS` and `INSERT IGNORE`.

### Foreign key constraint error
Make sure your main schema (with users and user_answers tables) is set up first.

### No communities returned for user
- Check the user has answered quiz questions (`SELECT * FROM user_answers WHERE user_id = X`)
- Verify `trait_awarded` column is not NULL
- Personality codes must be: F, C, N, S, or L

## Next Steps

1. ✅ Run the setup script
2. ✅ Restart your server (`npm start`)
3. ✅ Test the API endpoints
4. Update your frontend to use the community recommendations
5. Add community filtering to your posts view

Happy coding! 🚀
