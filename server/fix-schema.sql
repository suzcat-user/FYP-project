-- Fix schema - create missing tables and drop old user_answers then recreate with correct structure

-- Disable foreign key checks to allow dropping tables
SET FOREIGN_KEY_CHECKS = 0;

-- Drop the old user_answers table if it exists
DROP TABLE IF EXISTS user_answers;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Create questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_title VARCHAR(255),
    question_subtitle TEXT,
    game_phase ENUM('Phase 1', 'Phase 2', 'Phase 3'),
    question_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_questions_game_phase (game_phase)
);

-- Create question_options table if it doesn't exist
CREATE TABLE IF NOT EXISTS question_options (
    option_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text VARCHAR(255),
    option_icon VARCHAR(50),
    personality_type ENUM('Extrovert', 'Introvert', 'Ambivert'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    INDEX idx_question_options_question_id (question_id)
);

-- Create choices table if it doesn't exist
CREATE TABLE IF NOT EXISTS choices (
    choice_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    choice_text TEXT,
    points INT DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    INDEX idx_choices_question_id (question_id)
);

-- Recreate user_answers with columns compatible with existing code
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
    INDEX idx_user_answers_question_id (question_id)
);
