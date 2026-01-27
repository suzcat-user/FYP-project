# Quick Setup Guide: Linking User Answers to Communities

## What Was Added

I've created a complete database structure to link personality types (from `user_answers.trait_awarded`) to communities. This allows you to:
- Recommend communities based on user quiz results
- Map personality codes (F, C, N, S, L) to relevant communities
- Query which users belong in which communities

## Files Created

1. **Schema Files:**
   - `server/schema-communities.sql` - MySQL schema for communities
   - `server/schema-communities-postgres.sql` - PostgreSQL version
   - `server/setup-communities.sql` - Quick setup script

2. **API Routes:**
   - `server/routes/communities.js` - MySQL API endpoints
   - `server/routes/communities-pg.js` - PostgreSQL version

3. **Documentation:**
   - `COMMUNITY_PERSONALITY_MAPPING.md` - Complete guide

4. **Server Update:**
   - Updated `server/index.js` to include communities routes

## Setup Instructions

### Step 1: Run Database Migration

Connect to your MySQL database and run:

```bash
mysql -u avnadmin -p -h mysql-f6dd3cc-myrp-fypp.d.aivencloud.com -P 23353 --ssl-mode=REQUIRED defaultdb < server/setup-communities.sql
```

Or manually execute the SQL from `server/setup-communities.sql` in your database client.

### Step 2: Restart Server

The server code has already been updated. Just restart it:

```bash
cd server
npm start
```

### Step 3: Test the API

Try these endpoints:

```bash
# Get all communities
curl http://localhost:3001/api/communities

# Get communities for Creative personality
curl http://localhost:3001/api/communities/personality/C

# Get recommended communities for user 1
curl http://localhost:3001/api/communities/user/1/recommended
```

## How It Works

### Database Structure

**Communities Table:**
```
community_id | name              | description
-------------|-------------------|-------------
1            | Outdoor & Fitness | For active people...
2            | Culinary          | Food enthusiasts...
3            | Gaming            | Video game lovers...
4            | Arts              | Creative individuals...
5            | Crafts            | DIY enthusiasts...
6            | Music             | Musicians and music lovers...
```

**Personality Mapping:**
```
personality_code | community_id | is_primary
-----------------|--------------|------------
F (Fitness)      | 1            | TRUE
C (Creative)     | 4            | TRUE
C (Creative)     | 5            | FALSE
C (Creative)     | 6            | FALSE
N (Nature)       | 1            | TRUE
S (Social)       | 2            | TRUE
S (Social)       | 3            | FALSE
L (Lifestyle)    | 2            | TRUE
L (Lifestyle)    | 4            | FALSE
L (Lifestyle)    | 6            | FALSE
```

### Flow

1. **User takes quiz** → Answers saved to `user_answers` with `trait_awarded`
2. **User finishes quiz** → System counts which personality appears most
3. **Get communities** → Query `personality_community_mapping` with personality code
4. **Show results** → Display primary and secondary community recommendations

## API Endpoints

### 1. Get All Communities
```
GET /api/communities
```

**Response:**
```json
[
  {
    "community_id": 1,
    "name": "Outdoor & Fitness",
    "description": "For those who love staying active and exploring the outdoors",
    "created_at": "2026-01-27T..."
  }
]
```

### 2. Get Community by ID
```
GET /api/communities/:community_id
```

### 3. Get Communities for Personality
```
GET /api/communities/personality/:personality_code
```

**Example:**
```bash
GET /api/communities/personality/C
```

**Response:**
```json
[
  {
    "community_id": 4,
    "name": "Arts",
    "is_primary": true
  },
  {
    "community_id": 5,
    "name": "Crafts",
    "is_primary": false
  },
  {
    "community_id": 6,
    "name": "Music",
    "is_primary": false
  }
]
```

### 4. Get Recommended Communities for User
```
GET /api/communities/user/:user_id/recommended
```

This endpoint:
- Analyzes user's quiz answers from `user_answers`
- Finds their top 3 personality traits
- Returns all communities mapped to those personalities
- Sorts by primary communities first

## Frontend Integration Example

```typescript
// In your Results component or Community screen
import { useEffect, useState } from 'react';

const CommunityRecommendations = ({ userId, personalityCode }) => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    // Option 1: Get by user ID (analyzes all their answers)
    fetch(`http://localhost:3001/api/communities/user/${userId}/recommended`)
      .then(res => res.json())
      .then(data => setCommunities(data));

    // Option 2: Get by personality code (if you already know it)
    // fetch(`http://localhost:3001/api/communities/personality/${personalityCode}`)
    //   .then(res => res.json())
    //   .then(data => setCommunities(data));
  }, [userId, personalityCode]);

  return (
    <div>
      <h2>Recommended Communities</h2>
      {communities.map(community => (
        <div key={community.community_id}>
          <h3>{community.name} {community.is_primary && '⭐'}</h3>
          <p>{community.description}</p>
        </div>
      ))}
    </div>
  );
};
```

## Verification Queries

Run these to verify the setup:

```sql
-- Check communities were created
SELECT * FROM communities;

-- Check personality mappings
SELECT 
    pcm.personality_code,
    c.name as community_name,
    pcm.is_primary
FROM personality_community_mapping pcm
JOIN communities c ON pcm.community_id = c.community_id
ORDER BY pcm.personality_code, pcm.is_primary DESC;

-- Test: Get communities for Creative personality
SELECT c.*, pcm.is_primary 
FROM communities c
JOIN personality_community_mapping pcm ON c.community_id = pcm.community_id
WHERE pcm.personality_code = 'C'
ORDER BY pcm.is_primary DESC;
```

## Troubleshooting

### Communities table doesn't exist
Run the setup script: `server/setup-communities.sql`

### No data returned from `/api/communities/user/:user_id/recommended`
- Check that the user has answered questions (data in `user_answers`)
- Verify `trait_awarded` is not NULL in their answers
- The personality codes must match: F, C, N, S, or L

### Foreign key constraint errors
Make sure you run the communities schema AFTER creating the main schema with users and user_answers tables.

## Next Steps

1. **Update ResultsScreen.tsx** to fetch and display recommended communities
2. **Update CommunityScreen.tsx** to filter posts by community_id
3. **Add community selection** in post creation
4. **Track engagement** per community and personality type

## Need Help?

Check the complete documentation in `COMMUNITY_PERSONALITY_MAPPING.md` for:
- Detailed query examples
- Analytics queries
- Future enhancement ideas
- More integration patterns
