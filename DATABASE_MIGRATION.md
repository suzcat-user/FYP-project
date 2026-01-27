# Database Migration Guide

Your website has been updated to pull questions and answers from the database instead of hardcoded constants. Here's how to set everything up:

## What Changed

### Frontend Components Updated
- ✅ `WouldYouRather.tsx` - Now fetches from `GET /api/questions/game/WOULD_YOU_RATHER`
- ✅ `RingToss.tsx` - Now fetches from `GET /api/questions/game/RING_TOSS`
- ✅ `ShootingGallery.tsx` - Now fetches from `GET /api/questions/game/SHOOTING_GALLERY`

### Backend Changes
- ✅ New API endpoints in `server/routes/questions.js`:
  - `GET /api/questions/game/:gameType` - Get all questions for a game type
  - `GET /api/questions/:questionId` - Get single question with options
  - `POST /api/questions` - Create new question
  - `POST /api/questions/:questionId/options` - Add options to question

- ✅ Server updated to mount the questions router

### New Services
- ✅ `services/useQuestions.ts` - React hook to fetch questions with loading/error states

---

## Setup Instructions

### Step 1: Make sure your database schema is up to date

Ensure these tables exist (from schema-complete.sql):
- `questions`
- `question_options`

### Step 2: Populate the database with questions

Run the population script from the server directory:

```bash
cd server
node populate-db.js
```

This will:
- Insert all 13 questions (5 for Would You Rather, 5 for Ring Toss, 5 for Shooting Gallery)
- Insert all corresponding options for each question
- Map each option to a personality type (CREATIVE, SOCIAL, STRATEGIC, ACTIVE, EXPLORER, CALM)

**Expected Output:**
```
✅ Connected to database
🧹 Cleared existing questions
📝 Inserted question #1: WOULD_YOU_RATHER - Q1
  ✓ Added 2 options
📝 Inserted question #2: WOULD_YOU_RATHER - Q2
  ✓ Added 2 options
...
✅ Database population complete!
   Total questions inserted: 13
   Total options inserted: 61
```

### Step 3: Start your servers

**Terminal 1 - Backend:**
```bash
cd server
npm start
# or: node index.js
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 4: Test

1. Open your website: `http://localhost:5173` (or your frontend port)
2. Go through the games
3. Check that questions and options load from the database instead of being hardcoded

---

## Database Schema Reference

### questions table
```sql
- question_id (Primary Key)
- game_type (VARCHAR 50) - 'WOULD_YOU_RATHER', 'RING_TOSS', 'SHOOTING_GALLERY'
- question_text (TEXT) - The actual question
- question_title (VARCHAR 255) - Optional title
- question_subtitle (TEXT) - Optional subtitle
- question_order (INT) - Order within game type
- created_at (TIMESTAMP)
```

### question_options table
```sql
- option_id (Primary Key)
- question_id (Foreign Key → questions.question_id)
- option_text (VARCHAR 255) - The answer option text
- option_icon (VARCHAR 50) - Emoji or icon (e.g., "💪")
- personality_type (VARCHAR 50) - Maps to Trait enum (CREATIVE, SOCIAL, STRATEGIC, ACTIVE, EXPLORER, CALM)
- created_at (TIMESTAMP)
```

---

## How It Works

### Before (Hardcoded)
```typescript
import { WOULD_YOU_RATHER_QUESTIONS } from '../constants';

const WouldYouRather = () => {
  const currentQuestion = WOULD_YOU_RATHER_QUESTIONS[index];
  // Question data is in the code
}
```

### After (Database)
```typescript
import { useQuestions } from '../services/useQuestions';

const WouldYouRather = () => {
  const { questions, loading, error } = useQuestions('WOULD_YOU_RATHER');
  const currentQuestion = questions[index];
  // Question data is fetched from API
}
```

---

## API Examples

### Get all Would You Rather questions
```bash
curl http://localhost:3001/api/questions/game/WOULD_YOU_RATHER
```

**Response:**
```json
[
  {
    "question_id": 1,
    "game_type": "WOULD_YOU_RATHER",
    "question_text": "Would you rather engage in hobbies that are more mental than physical?",
    "question_order": 1,
    "options": [
      {
        "option_id": 1,
        "option_text": "Mental",
        "personality_type": "STRATEGIC"
      },
      {
        "option_id": 2,
        "option_text": "Physical",
        "personality_type": "ACTIVE"
      }
    ]
  },
  ...
]
```

### Get single question
```bash
curl http://localhost:3001/api/questions/1
```

---

## Troubleshooting

### "No questions found" error in game
1. Check that `populate-db.js` ran successfully
2. Verify database connection credentials in `server/index.js`
3. Check that the `questions` table has data:
   ```bash
   mysql> SELECT COUNT(*) FROM questions;
   ```

### API returns empty array
1. Ensure `populate-db.js` completed without errors
2. Verify game_type is correctly spelled (case-sensitive in queries)

### Loading spinner stuck
1. Check browser console for API errors
2. Verify backend server is running on port 3001
3. Check CORS is enabled (it's already configured in `server/index.js`)

---

## Next Steps

To add more questions:

### Option 1: Add via API
```bash
curl -X POST http://localhost:3001/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "game_type": "WOULD_YOU_RATHER",
    "question_text": "Your new question here?",
    "question_order": 6
  }'
```

### Option 2: Edit populate-db.js and re-run
1. Add new question to the appropriate array in `populate-db.js`
2. Run `node populate-db.js` again

---

## Summary

✅ Questions are now stored in the database
✅ Components fetch questions dynamically via API
✅ Easy to add new questions without code changes
✅ Personality types map to traits automatically
✅ All game flows remain the same
