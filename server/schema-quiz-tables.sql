-- Quiz System Tables for FYP project
-- Note: questions, question_options, choices, and user_answers are created in fix-schema.sql

-- Quiz Sessions table
CREATE TABLE IF NOT EXISTS quiz_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    personality_result ENUM('Extrovert', 'Introvert', 'Ambivert'),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_quiz_sessions_user_id (user_id)
);
