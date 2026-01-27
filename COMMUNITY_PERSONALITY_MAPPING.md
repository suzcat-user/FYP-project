# Community and Personality Mapping Database Guide

## Overview
This guide explains how personality types (from `user_answers.trait_awarded`) are linked to communities in the database.

## Database Schema

### 1. Communities Table
Stores all available communities where users can engage based on their personality types.

```sql
CREATE TABLE communities (
    community_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Communities:**
- `1` - Outdoor & Fitness
- `2` - Culinary  
- `3` - Gaming
- `4` - Arts
- `5` - Crafts
- `6` - Music

### 2. Personality Community Mapping Table
Links personality codes to their recommended communities.

```sql
CREATE TABLE personality_community_mapping (
    mapping_id INT PRIMARY KEY,
    personality_code VARCHAR(10) NOT NULL,
    community_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (community_id) REFERENCES communities(community_id)
);
```

**Personality Mappings:**

| Personality | Name | Primary Community | Secondary Communities |
|------------|------|-------------------|----------------------|
| F | Fitness | Outdoor & Fitness (1) | - |
| C | Creatives | Arts (4) | Crafts (5), Music (6) |
| N | Nature | Outdoor & Fitness (1) | - |
| S | Social | Culinary (2) | Gaming (3) |
| L | Lifestyle | Culinary (2) | Arts (4), Music (6) |

### 3. Hobbies Table (Optional)
Links specific hobbies to communities.

```sql
CREATE TABLE hobbies (
    hobby_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    community_id INT,
    FOREIGN KEY (community_id) REFERENCES communities(community_id)
);
```

## How It Works

### 1. User Takes Quiz
- User answers questions in games (Would You Rather, Ring Toss, Shooting Gallery)
- Each answer awards a personality trait (F, C, N, S, or L)
- Answers are stored in `user_answers` table with `trait_awarded` field

```sql
-- Example user answer
INSERT INTO user_answers (user_id, game_type, question_id, answer_choice, trait_awarded)
VALUES (1, 'WOULD_YOU_RATHER', 1, 'Build a giant pillow fort', 'C');
```

### 2. Determine User's Personality
- Count which trait appears most frequently in `user_answers.trait_awarded`
- This is the user's dominant personality type

```sql
-- Get user's dominant personality
SELECT trait_awarded, COUNT(*) as count
FROM user_answers
WHERE user_id = ? AND trait_awarded IS NOT NULL
GROUP BY trait_awarded
ORDER BY count DESC
LIMIT 1;
```

### 3. Find Recommended Communities
- Use the personality code to query `personality_community_mapping`
- Get all communities linked to that personality
- Primary communities are shown first (`is_primary = TRUE`)

```sql
-- Get communities for a personality type
SELECT c.*, pcm.is_primary 
FROM communities c
JOIN personality_community_mapping pcm ON c.community_id = pcm.community_id
WHERE pcm.personality_code = 'C'
ORDER BY pcm.is_primary DESC, c.name;
```

## API Endpoints

### Get All Communities
```
GET /api/communities
```
Returns all available communities.

### Get Community by ID
```
GET /api/communities/:community_id
```
Returns details of a specific community.

### Get Communities for Personality Type
```
GET /api/communities/personality/:personality_code
```
Returns all communities linked to a personality code (F, C, N, S, L).

**Example:**
```bash
GET /api/communities/personality/C
```
Returns: Arts (primary), Crafts, Music

### Get Recommended Communities for User
```
GET /api/communities/user/:user_id/recommended
```
Analyzes the user's quiz answers and returns personalized community recommendations based on their personality traits.

**Response Example:**
```json
[
  {
    "community_id": 4,
    "name": "Arts",
    "description": "Creative individuals who express themselves through visual arts",
    "is_primary": true
  },
  {
    "community_id": 5,
    "name": "Crafts",
    "description": "Makers and DIY enthusiasts who enjoy hands-on projects",
    "is_primary": false
  }
]
```

## Implementation Steps

### 1. Run Schema Migration
For MySQL:
```bash
mysql -u your_user -p your_database < server/schema-communities.sql
```

For PostgreSQL:
```bash
psql -U your_user -d your_database -f server/schema-communities-postgres.sql
```

### 2. Add Routes to Server
In your `server/index.js` or `server/index-aiven.js`:

```javascript
// Add the communities routes
const communitiesRoutes = require('./routes/communities'); // or communities-pg for PostgreSQL
app.use('/api/communities', communitiesRoutes);
```

### 3. Frontend Integration
In your React components, fetch recommended communities:

```typescript
// Get communities for current user
const fetchRecommendedCommunities = async (userId: number) => {
  const response = await fetch(`http://localhost:3001/api/communities/user/${userId}/recommended`);
  const communities = await response.json();
  return communities;
};

// Get communities for a specific personality
const fetchPersonalityCommunities = async (personalityCode: string) => {
  const response = await fetch(`http://localhost:3001/api/communities/personality/${personalityCode}`);
  const communities = await response.json();
  return communities;
};
```

## Database Queries Examples

### Find all users in a community based on their personality
```sql
SELECT DISTINCT u.user_id, u.username, ua.trait_awarded
FROM users u
JOIN user_answers ua ON u.user_id = ua.user_id
JOIN personality_community_mapping pcm ON ua.trait_awarded = pcm.personality_code
WHERE pcm.community_id = 4  -- Arts community
GROUP BY u.user_id, u.username, ua.trait_awarded;
```

### Get post count per community with personality breakdown
```sql
SELECT 
  c.name as community_name,
  COUNT(DISTINCT p.post_id) as post_count,
  ua.trait_awarded as personality,
  COUNT(DISTINCT ua.user_id) as user_count
FROM communities c
LEFT JOIN posts p ON c.community_id = p.community_id
LEFT JOIN user_answers ua ON p.user_id = ua.user_id
GROUP BY c.community_id, c.name, ua.trait_awarded
ORDER BY c.name, user_count DESC;
```

### Find users who should be in a community but haven't posted yet
```sql
-- Users with Creative (C) personality who haven't posted in Arts community
SELECT DISTINCT u.user_id, u.username
FROM users u
JOIN user_answers ua ON u.user_id = ua.user_id
WHERE ua.trait_awarded = 'C'
AND u.user_id NOT IN (
  SELECT DISTINCT user_id 
  FROM posts 
  WHERE community_id = 4  -- Arts community
);
```

## Benefits

1. **Personalized Recommendations**: Users get community suggestions based on their actual quiz responses
2. **Multiple Communities**: Personalities can map to multiple communities (primary and secondary)
3. **Scalable**: Easy to add new communities or modify personality mappings
4. **Analytics**: Track which personalities engage most in each community
5. **Flexible**: `is_primary` flag allows prioritizing certain communities for each personality

## Future Enhancements

- Add user preferences to override automatic recommendations
- Track community engagement metrics per personality type
- Implement hybrid recommendations based on both personality and user behavior
- Add community activity scores to promote active communities
