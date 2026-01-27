-- PostgreSQL schema for FYP project

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User answers table
CREATE TABLE IF NOT EXISTS user_answers (
    answer_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    game_type VARCHAR(50) NOT NULL,
    question_id INT,
    answer_choice TEXT,
    trait_awarded VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Game Question Sets (store full question sets in JSON per game)
CREATE TABLE IF NOT EXISTS game_question_sets (
    game_name VARCHAR(100) PRIMARY KEY,
    questions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    community_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_answers_user_id ON user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Seed: Would You Rather game questions
INSERT INTO game_question_sets (game_name, questions)
VALUES (
    'would_you_rather',
    $$[
        {"question":"Would you rather...","options":["Build a giant pillow fort","Explore a secret garden"],"colors":["bg-[#84D2F6]","bg-[#90F1AC]"]},
        {"question":"Would you rather have the power to...","options":["Talk to animals","Invent a flying car"],"colors":["bg-[#F8A07E]","bg-[#FDE24F]"]},
        {"question":"How would you spend a free afternoon?","options":["At a bustling arcade","In a cozy library"],"colors":["bg-[#FF8FAB]","bg-[#A78BFA]"]},
        {"question":"What would be your dream pet?","options":["A tiny dragon","A loyal robot dog"],"colors":["bg-[#FDE24F]","bg-[#90F1AC]"]},
        {"question":"You find a mysterious old map. Do you...","options":["Follow it immediately","Research it at the library first"],"colors":["bg-[#F8A07E]","bg-[#A78BFA]"]},
        {"question":"For your birthday party, would you prefer...","options":["A huge party with all your friends","A small gathering with your closest pals"],"colors":["bg-[#FF8FAB]","bg-[#84D2F6]"]},
        {"question":"Would you rather have a room that is...","options":["Perfectly organized and tidy","A creative, beautiful mess"],"colors":["bg-[#84D2F6]","bg-[#F8A07E]"]},
        {"question":"You're directing a movie. It would be...","options":["A hilarious comedy","An epic action-adventure"],"colors":["bg-[#FDE24F]","bg-[#F8A07E]"]},
        {"question":"Would you rather have a notebook that...","options":["Brings your drawings to life","Answers any question you write in it"],"colors":["bg-[#F8A07E]","bg-[#84D2F6]"]},
        {"question":"Would you rather explore...","options":["The deepest part of the ocean","The farthest reaches of outer space"],"colors":["bg-[#84D2F6]","bg-[#333] text-white"]}
    ]$$::jsonb
)
ON CONFLICT (game_name)
DO UPDATE SET questions = EXCLUDED.questions, updated_at = CURRENT_TIMESTAMP;
