-- Complete FYP Database Schema
-- Based on actual application code

-- Disable foreign key checks initially
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS user_answers;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS quiz_sessions;
DROP TABLE IF EXISTS question_options;
DROP TABLE IF EXISTS choices;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_username (username)
);

-- Posts table
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_posts_user_id (user_id),
    INDEX idx_posts_created_at (created_at)
);

-- Comments table
CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    INDEX idx_comments_post_id (post_id),
    INDEX idx_comments_user_id (user_id),
    INDEX idx_comments_created_at (created_at)
);

-- Questions table (for different games: would_you_rather, ring_toss, shooting_gallery, bingo, whack_a_mole)
CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    game_type VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    question_title VARCHAR(255),
    question_subtitle TEXT,
    game_phase VARCHAR(50),
    question_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_questions_game_type (game_type),
    INDEX idx_questions_game_phase (game_phase),
    INDEX idx_questions_order (question_order)
);

-- Question Options table
CREATE TABLE question_options (
    option_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text VARCHAR(255),
    option_icon VARCHAR(50),
    personality_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    INDEX idx_question_options_question_id (question_id)
);

-- Choices table (alternative/additional structure for game options)
CREATE TABLE choices (
    choice_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    choice_text TEXT,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    INDEX idx_choices_question_id (question_id)
);

-- Quiz Sessions table
CREATE TABLE quiz_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    personality_result VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_quiz_sessions_user_id (user_id),
    INDEX idx_quiz_sessions_created_at (created_at)
);

-- User Answers table (stores all game answers)
CREATE TABLE user_answers (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    game_type VARCHAR(50),
    question_id INT,
    answer_choice TEXT,
    trait_awarded VARCHAR(50),
    choice_id INT,
    option_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    FOREIGN KEY (choice_id) REFERENCES choices(choice_id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES question_options(option_id) ON DELETE CASCADE,
    INDEX idx_user_answers_user_id (user_id),
    INDEX idx_user_answers_game_type (game_type),
    INDEX idx_user_answers_question_id (question_id),
    INDEX idx_user_answers_created_at (created_at)
);
