-- Quick setup script to add community tables to existing database
-- Run this after your main schema is set up

-- Add the communities table if it doesn't exist
CREATE TABLE IF NOT EXISTS communities (
    community_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_communities_name (name)
);

-- Add personality_community_mapping table
CREATE TABLE IF NOT EXISTS personality_community_mapping (
    mapping_id INT AUTO_INCREMENT PRIMARY KEY,
    personality_code VARCHAR(10) NOT NULL,
    community_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE CASCADE,
    INDEX idx_personality_community_personality (personality_code),
    INDEX idx_personality_community_community (community_id),
    UNIQUE KEY unique_personality_community (personality_code, community_id)
);

-- Insert communities
INSERT IGNORE INTO communities (community_id, name, description) VALUES
(1, 'Outdoor & Fitness', 'For those who love staying active and exploring the outdoors'),
(2, 'Culinary', 'Food enthusiasts who enjoy cooking, baking, and culinary experiences'),
(3, 'Gaming', 'Video game lovers and board game enthusiasts'),
(4, 'Arts', 'Creative individuals who express themselves through visual arts'),
(5, 'Crafts', 'Makers and DIY enthusiasts who enjoy hands-on projects'),
(6, 'Music', 'Musicians and music lovers who appreciate all genres');

-- Map personalities to communities
INSERT IGNORE INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
-- Fitness (F) -> Outdoor & Fitness
('F', 1, TRUE),
-- Creatives (C) -> Arts, Crafts, Music
('C', 4, TRUE),
('C', 5, FALSE),
('C', 6, FALSE),
-- Nature (N) -> Outdoor & Fitness
('N', 1, TRUE),
-- Social (S) -> Culinary, Gaming
('S', 2, TRUE),
('S', 3, FALSE),
-- Lifestyle (L) -> Culinary, Arts, Music
('L', 2, TRUE),
('L', 4, FALSE),
('L', 6, FALSE);

-- Verify the setup
SELECT 'Communities created:' as status;
SELECT * FROM communities;

SELECT 'Personality mappings created:' as status;
SELECT 
    pcm.personality_code,
    c.name as community_name,
    pcm.is_primary
FROM personality_community_mapping pcm
JOIN communities c ON pcm.community_id = c.community_id
ORDER BY pcm.personality_code, pcm.is_primary DESC;
