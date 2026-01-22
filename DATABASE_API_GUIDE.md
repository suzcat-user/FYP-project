# Database Integration Guide

## User Management
- **POST /api/users/login** - Register/Login (upsert)
  - Captures: `email`, `username`, `password`
  - Returns: `user_id`, `username`, `score`

## Game Answers
- **POST /api/answers** - Save user answer to a question
  - Captures: `user_id`, `game_type` (e.g., "WOULD_YOU_RATHER"), `question_id`, `answer_choice`, `trait_awarded`
  - Stores: All user choices for later analysis

- **GET /api/answers/user/:user_id** - Get all answers for a user
- **GET /api/answers/game/:game_type** - Get all answers for a game type

## Community Posts
- **POST /api/posts** - Create a post
  - Captures: `user_id`, `title`, `content` (or `description`)
  - Returns: `post_id`, post details

- **GET /api/posts** - Get all posts with usernames
- **GET /api/posts/:post_id** - Get single post
- **PUT /api/posts/:post_id** - Update post (user must own it)
  - Requires: `user_id`, `title`, `content`
- **DELETE /api/posts/:post_id** - Delete post (user must own it)
  - Requires: `user_id`

## Comments
- **POST /api/comments** - Create comment on post
  - Captures: `user_id`, `post_id`, `content`
  - Returns: `comment_id`, comment details

- **GET /api/comments/post/:post_id** - Get all comments on a post
- **PUT /api/comments/:comment_id** - Update comment (user must own it)
  - Requires: `user_id`, `content`
- **DELETE /api/comments/:comment_id** - Delete comment (user must own it)
  - Requires: `user_id`

## Database Schema

### users
- user_id (PK, AUTO_INCREMENT)
- username (VARCHAR 50)
- email (VARCHAR 255)
- password_hash (VARCHAR 255)
- score (INT, default 0)

### user_answers
- answer_id (PK, AUTO_INCREMENT)
- user_id (FK)
- game_type (VARCHAR 50)
- question_id (INT)
- answer_choice (VARCHAR 255)
- trait_awarded (VARCHAR 50)
- created_at (DATETIME)

### posts
- post_id (PK, AUTO_INCREMENT)
- user_id (FK)
- title (VARCHAR 255)
- content (TEXT)
- created_at (DATETIME)

### comments
- comment_id (PK, AUTO_INCREMENT)
- post_id (FK)
- user_id (FK)
- content (TEXT)
- created_at (DATETIME)

## Frontend Integration

### Game Components
All game components now accept `userId` prop and automatically save answers:
- WouldYouRather
- RingToss
- ShootingGallery

Each choice is captured in the `user_answers` table with game type, question ID, and trait.

### Community Features
Components can call:
- Create post: `POST /api/posts`
- Get posts: `GET /api/posts`
- Create comment: `POST /api/comments`
- Update/delete with ownership check

## Server Port
Backend: `http://localhost:3001`
All requests use this base URL.
