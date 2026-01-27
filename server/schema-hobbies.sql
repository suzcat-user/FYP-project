-- Hobbies Database Schema
-- Tables for storing personality types and their associated hobbies

-- Personality Types table
CREATE TABLE IF NOT EXISTS personality_types (
    personality_code CHAR(1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hobbies table
CREATE TABLE IF NOT EXISTS hobbies (
    hobby_id INT AUTO_INCREMENT PRIMARY KEY,
    personality_code CHAR(1) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    community_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (personality_code) REFERENCES personality_types(personality_code) ON DELETE CASCADE,
    INDEX idx_hobbies_personality (personality_code)
);

-- Personality Communities junction table (for personalities that belong to multiple communities)
CREATE TABLE IF NOT EXISTS personality_communities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    personality_code CHAR(1) NOT NULL,
    community_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (personality_code) REFERENCES personality_types(personality_code) ON DELETE CASCADE,
    INDEX idx_personality_communities (personality_code)
);
