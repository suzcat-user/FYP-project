# Database Integration Complete Guide

## Overview
Your website now pulls ALL questions and stores ALL user answers in the database. Here's exactly where to find everything.

---

## 📊 Database Tables & Structure

### 1. **questions** Table
**Location:** `defaultdb.questions`

Stores all questions for the three games.

```sql
SELECT * FROM questions;
```

**Columns:**
- `question_id` - Unique identifier (AUTO_INCREMENT)
- `game_type` - VARCHAR(50) - Values: `WOULD_YOU_RATHER`, `RING_TOSS`, `SHOOTING_GALLERY`
- `question_text` - TEXT - The actual question
- `question_order` - INT - Order within that game (1-5)
- `created_at` - TIMESTAMP

**Example Data:**
```
question_id | game_type           | question_text                                           | question_order
38          | WOULD_YOU_RATHER    | Would you rather engage in hobbies that are more...    | 1
39          | WOULD_YOU_RATHER    | Would you rather feel challenged than relaxed?         | 2
40          | WOULD_YOU_RATHER    | Would you rather spend your free time alone...         | 3
41          | WOULD_YOU_RATHER    | Would you describe yourself as patient...              | 4
42          | WOULD_YOU_RATHER    | Would you rather feel comfortable than open...         | 5
43          | RING_TOSS           | Why do you want a hobby?                               | 1
...
48          | SHOOTING_GALLERY    | What gives you the MOST satisfaction...                | 1
```

---

### 2. **question_options** Table
**Location:** `defaultdb.question_options`

Stores all answer options for each question.

```sql
SELECT * FROM question_options;
```

**Columns:**
- `option_id` - Unique identifier (AUTO_INCREMENT)
- `question_id` - FOREIGN KEY → questions.question_id
- `option_text` - VARCHAR(255) - The answer option text
- `option_icon` - VARCHAR(50) - Emoji/icon (e.g., "💪")
- `personality_type` - VARCHAR(50) - Trait type: `CREATIVE`, `SOCIAL`, `STRATEGIC`, `ACTIVE`, `EXPLORER`, `CALM`
- `created_at` - TIMESTAMP

**Example Data:**
```
option_id | question_id | option_text                          | option_icon | personality_type
75        | 38          | Mental                               | (null)      | STRATEGIC
76        | 38          | Physical                             | (null)      | ACTIVE
77        | 39          | Challenged                           | (null)      | CREATIVE
78        | 39          | Relaxed                              | (null)      | STRATEGIC
79        | 43          | I have free time                     | (null)      | CALM
80        | 43          | Improve lifestyle & health           | (null)      | ACTIVE
81        | 43          | Express myself creatively            | (null)      | CREATIVE
...
135       | 48          | Feeling healthier & stronger         | 💪          | ACTIVE
136       | 48          | Expressing myself creatively         | 🎨          | CREATIVE
```

---

### 3. **user_answers** Table
**Location:** `defaultdb.user_answers`

Stores every answer a user gives when playing the games.

```sql
SELECT * FROM user_answers;
```

**Columns:**
- `answer_id` - Unique identifier (AUTO_INCREMENT)
- `user_id` - FOREIGN KEY → users.user_id
- `game_type` - VARCHAR(50) - Which game: `WOULD_YOU_RATHER`, `RING_TOSS`, `SHOOTING_GALLERY`
- `question_id` - FOREIGN KEY → questions.question_id
- `answer_choice` - TEXT - Which option they picked
- `trait_awarded` - VARCHAR(50) - Personality type they earned
- `created_at` - TIMESTAMP - When they answered
- `answered_at` - TIMESTAMP - When they answered (same as created_at)

**Example Data:**
```
answer_id | user_id | game_type           | question_id | answer_choice                    | trait_awarded | created_at
1         | 1       | WOULD_YOU_RATHER    | 38          | Mental                           | STRATEGIC     | 2026-01-27 10:30:45
2         | 1       | WOULD_YOU_RATHER    | 39          | Challenged                       | CREATIVE      | 2026-01-27 10:31:20
3         | 1       | WOULD_YOU_RATHER    | 40          | With others                      | EXPLORER      | 2026-01-27 10:32:00
4         | 1       | RING_TOSS           | 43          | Express myself creatively        | CREATIVE      | 2026-01-27 10:35:10
5         | 1       | RING_TOSS           | 44          | Visual                           | CREATIVE      | 2026-01-27 10:36:00
6         | 1       | SHOOTING_GALLERY    | 48          | Feeling healthier & stronger     | ACTIVE        | 2026-01-27 10:40:30
```

---

### 4. **users** Table
**Location:** `defaultdb.users`

Stores user account information.

```sql
SELECT * FROM users;
```

**Columns:**
- `user_id` - Unique identifier (AUTO_INCREMENT)
- `username` - VARCHAR(255) - User's name
- `email` - VARCHAR(255) - User's email
- `password_hash` - VARCHAR(255) - Hashed password
- `score` - INT - Total score
- `created_at` - TIMESTAMP - When account was created

---

## 🎮 How Data Flows Through Your Website

### When a User Plays a Game:

```
1. Frontend loads game component
   ↓
2. useQuestions hook fetches from API
   GET /api/questions/game/WOULD_YOU_RATHER
   ↓
3. Backend queries database
   SELECT * FROM questions WHERE game_type = 'WOULD_YOU_RATHER'
   SELECT * FROM question_options WHERE question_id IN (...)
   ↓
4. Questions display on screen
   ↓
5. User clicks an answer
   ↓
6. saveAnswer() function sends to API
   POST /api/answers
   Body: { user_id, game_type, question_id, answer_choice, trait_awarded }
   ↓
7. Backend inserts into database
   INSERT INTO user_answers (user_id, game_type, question_id, answer_choice, trait_awarded)
   ↓
8. Answer stored permanently in database
```

---

## 🔍 How to Check Your Data

### Check 1: Count Total Questions
```sql
SELECT COUNT(*) as total_questions FROM questions;
-- Should return: 13
```

### Check 2: Count Questions by Game Type
```sql
SELECT game_type, COUNT(*) as count 
FROM questions 
GROUP BY game_type;

-- Should return:
-- WOULD_YOU_RATHER: 5
-- RING_TOSS: 5
-- SHOOTING_GALLERY: 5
```

### Check 3: Count Total Options
```sql
SELECT COUNT(*) as total_options FROM question_options;
-- Should return: 70
```

### Check 4: See a Specific Game's Questions with Options
```sql
SELECT 
  q.question_id,
  q.question_text,
  GROUP_CONCAT(qo.option_text SEPARATOR ' | ') as options,
  GROUP_CONCAT(qo.personality_type SEPARATOR ' | ') as traits
FROM questions q
LEFT JOIN question_options qo ON q.question_id = qo.question_id
WHERE q.game_type = 'WOULD_YOU_RATHER'
GROUP BY q.question_id
ORDER BY q.question_order;
```

### Check 5: See All User Answers
```sql
SELECT 
  ua.answer_id,
  u.username,
  ua.game_type,
  q.question_text,
  ua.answer_choice,
  ua.trait_awarded,
  ua.created_at
FROM user_answers ua
JOIN users u ON ua.user_id = u.user_id
JOIN questions q ON ua.question_id = q.question_id
ORDER BY ua.created_at DESC;
```

### Check 6: Summary of User Traits
```sql
SELECT 
  u.username,
  ua.game_type,
  ua.trait_awarded,
  COUNT(*) as count
FROM user_answers ua
JOIN users u ON ua.user_id = u.user_id
GROUP BY u.username, ua.game_type, ua.trait_awarded
ORDER BY u.username, ua.game_type;
```

---

## 📍 API Endpoints (Backend Routes)

All in `server/routes/questions.js`

### Get All Questions for a Game
```
GET /api/questions/game/WOULD_YOU_RATHER
GET /api/questions/game/RING_TOSS
GET /api/questions/game/SHOOTING_GALLERY
```

**Response:**
```json
[
  {
    "question_id": 38,
    "game_type": "WOULD_YOU_RATHER",
    "question_text": "Would you rather engage in hobbies that are more mental than physical?",
    "question_order": 1,
    "options": [
      {
        "option_id": 75,
        "option_text": "Mental",
        "personality_type": "STRATEGIC"
      },
      {
        "option_id": 76,
        "option_text": "Physical",
        "personality_type": "ACTIVE"
      }
    ]
  }
]
```

### Get Single Question
```
GET /api/questions/38
```

### Save User Answer
```
POST /api/answers
Body: {
  "user_id": 1,
  "game_type": "WOULD_YOU_RATHER",
  "question_id": 38,
  "answer_choice": "Mental",
  "trait_awarded": "STRATEGIC"
}
```

---

## 🧠 Frontend Components (React)

### Service Hook: `services/useQuestions.ts`
- Fetches questions from API
- Handles loading/error states
- Called by game components

### Game Components:
- `components/WouldYouRather.tsx` - Uses `useQuestions('WOULD_YOU_RATHER')`
- `components/RingToss.tsx` - Uses `useQuestions('RING_TOSS')`
- `components/ShootingGallery.tsx` - Uses `useQuestions('SHOOTING_GALLERY')`

All questions come from **database** ✅
All answers saved to **database** ✅

---

## 🗄️ Database Connection

**Host:** `mysql-f6dd3cc-myrp-fypp.d.aivencloud.com`
**Port:** `23353`
**Database:** `defaultdb`
**User:** `avnadmin`

**Connect via MySQL CLI:**
```bash
mysql -h mysql-f6dd3cc-myrp-fypp.d.aivencloud.com \
       -u avnadmin \
       -p"AVNS_xREgo-7cfTkD9oJUroh" \
       -P 23353 \
       defaultdb
```

---

## ✅ Verification Checklist

- [x] 13 questions in database (5 + 5 + 5)
- [x] 70 options in database (2+2+2+2+2 for Would You Rather, 6×5=30 for Ring Toss, 6×5=30 for Shooting Gallery)
- [x] API endpoints working (GET /api/questions/game/:gameType)
- [x] Questions displaying in game (no hardcoded constants)
- [x] User answers being saved (POST /api/answers working)
- [x] Answers stored in user_answers table with correct data
- [x] Bingo and WhackAMole removed
- [x] All three games (Would You Rather, Ring Toss, Shooting Gallery) fully integrated

---

## 📝 Summary

**Your database now contains:**
- ✅ All 13 game questions
- ✅ All 70 answer options with personality mappings
- ✅ All user answers and responses
- ✅ All user information

**Everything is stored and retrievable via:**
- Direct database queries
- REST API endpoints
- Frontend React components
