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

-- Game Question Sets (store full question sets in JSON per game)
CREATE TABLE IF NOT EXISTS game_question_sets (
    game_name VARCHAR(100) PRIMARY KEY,
    questions JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

-- Post media table (stored in DB)
CREATE TABLE IF NOT EXISTS post_media (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    media_data LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    INDEX idx_post_media_post_id (post_id)
);

-- Emoji catalog (available emojis)
CREATE TABLE IF NOT EXISTS emoji_catalog (
    emoji_id INT AUTO_INCREMENT PRIMARY KEY,
    emoji VARCHAR(16) NOT NULL UNIQUE
);

-- GIF catalog (available GIF URLs)
CREATE TABLE IF NOT EXISTS gif_catalog (
    gif_id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(512) NOT NULL UNIQUE
);

-- Media catalog (JSON arrays)
CREATE TABLE IF NOT EXISTS media_catalog (
    catalog_type VARCHAR(16) PRIMARY KEY,
    items JSON NOT NULL
);

-- Seed: Would You Rather game questions
INSERT INTO game_question_sets (game_name, questions)
VALUES (
    'would_you_rather',
    JSON_ARRAY(
        JSON_OBJECT(
            'question', 'Would you rather...',
            'options', JSON_ARRAY('Build a giant pillow fort', 'Explore a secret garden'),
            'colors', JSON_ARRAY('bg-[#84D2F6]', 'bg-[#90F1AC]')
        ),
        JSON_OBJECT(
            'question', 'Would you rather have the power to...',
            'options', JSON_ARRAY('Talk to animals', 'Invent a flying car'),
            'colors', JSON_ARRAY('bg-[#F8A07E]', 'bg-[#FDE24F]')
        ),
        JSON_OBJECT(
            'question', 'How would you spend a free afternoon?',
            'options', JSON_ARRAY('At a bustling arcade', 'In a cozy library'),
            'colors', JSON_ARRAY('bg-[#FF8FAB]', 'bg-[#A78BFA]')
        ),
        JSON_OBJECT(
            'question', 'What would be your dream pet?',
            'options', JSON_ARRAY('A tiny dragon', 'A loyal robot dog'),
            'colors', JSON_ARRAY('bg-[#FDE24F]', 'bg-[#90F1AC]')
        ),
        JSON_OBJECT(
            'question', 'You find a mysterious old map. Do you...',
            'options', JSON_ARRAY('Follow it immediately', 'Research it at the library first'),
            'colors', JSON_ARRAY('bg-[#F8A07E]', 'bg-[#A78BFA]')
        ),
        JSON_OBJECT(
            'question', 'For your birthday party, would you prefer...',
            'options', JSON_ARRAY('A huge party with all your friends', 'A small gathering with your closest pals'),
            'colors', JSON_ARRAY('bg-[#FF8FAB]', 'bg-[#84D2F6]')
        ),
        JSON_OBJECT(
            'question', 'Would you rather have a room that is...',
            'options', JSON_ARRAY('Perfectly organized and tidy', 'A creative, beautiful mess'),
            'colors', JSON_ARRAY('bg-[#84D2F6]', 'bg-[#F8A07E]')
        ),
        JSON_OBJECT(
            'question', 'You''re directing a movie. It would be...',
            'options', JSON_ARRAY('A hilarious comedy', 'An epic action-adventure'),
            'colors', JSON_ARRAY('bg-[#FDE24F]', 'bg-[#F8A07E]')
        ),
        JSON_OBJECT(
            'question', 'Would you rather have a notebook that...',
            'options', JSON_ARRAY('Brings your drawings to life', 'Answers any question you write in it'),
            'colors', JSON_ARRAY('bg-[#F8A07E]', 'bg-[#84D2F6]')
        ),
        JSON_OBJECT(
            'question', 'Would you rather explore...',
            'options', JSON_ARRAY('The deepest part of the ocean', 'The farthest reaches of outer space'),
            'colors', JSON_ARRAY('bg-[#84D2F6]', 'bg-[#333] text-white')
        )
    )
)
ON DUPLICATE KEY UPDATE questions = VALUES(questions);
