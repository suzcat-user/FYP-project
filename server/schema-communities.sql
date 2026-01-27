-- Communities and Personality Mapping Schema
-- Links personality types (trait_awarded) to communities

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
    community_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_communities_name (name)
);

-- Personality to Community mapping table
-- Maps PersonalityCode (F, C, N, S, L) to communities
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

-- Hobbies table (optional - to link hobbies with communities)
CREATE TABLE IF NOT EXISTS hobbies (
    hobby_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    community_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE SET NULL,
    INDEX idx_hobbies_community (community_id),
    INDEX idx_hobbies_name (name)
);

-- Insert communities
INSERT INTO communities (community_id, name, description) VALUES
(1, 'Outdoor & Fitness', 'For those who love staying active and exploring the outdoors'),
(2, 'Culinary', 'Food enthusiasts who enjoy cooking, baking, and culinary experiences'),
(3, 'Gaming', 'Video game lovers and board game enthusiasts'),
(4, 'Arts', 'Creative individuals who express themselves through visual arts'),
(5, 'Crafts', 'Makers and DIY enthusiasts who enjoy hands-on projects'),
(6, 'Music', 'Musicians and music lovers who appreciate all genres')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

-- Map personality codes to communities
-- F = Fitness -> Outdoor & Fitness
INSERT INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
('F', 1, TRUE)
ON DUPLICATE KEY UPDATE is_primary = VALUES(is_primary);

-- C = Creatives -> Arts, Crafts, Music
INSERT INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
('C', 4, TRUE),
('C', 5, FALSE),
('C', 6, FALSE)
ON DUPLICATE KEY UPDATE is_primary = VALUES(is_primary);

-- N = Nature -> Outdoor & Fitness
INSERT INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
('N', 1, TRUE)
ON DUPLICATE KEY UPDATE is_primary = VALUES(is_primary);

-- S = Social -> Culinary, Gaming
INSERT INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
('S', 2, TRUE),
('S', 3, FALSE)
ON DUPLICATE KEY UPDATE is_primary = VALUES(is_primary);

-- L = Lifestyle -> Culinary, Arts, Music
INSERT INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
('L', 2, TRUE),
('L', 4, FALSE),
('L', 6, FALSE)
ON DUPLICATE KEY UPDATE is_primary = VALUES(is_primary);
