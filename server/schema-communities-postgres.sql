-- PostgreSQL Communities and Personality Mapping Schema
-- Links personality types (trait_awarded) to communities

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
    community_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personality to Community mapping table
-- Maps PersonalityCode (F, C, N, S, L) to communities
CREATE TABLE IF NOT EXISTS personality_community_mapping (
    mapping_id SERIAL PRIMARY KEY,
    personality_code VARCHAR(10) NOT NULL,
    community_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE CASCADE,
    UNIQUE (personality_code, community_id)
);

-- Hobbies table (optional - to link hobbies with communities)
CREATE TABLE IF NOT EXISTS hobbies (
    hobby_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    community_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_communities_name ON communities(name);
CREATE INDEX IF NOT EXISTS idx_personality_community_personality ON personality_community_mapping(personality_code);
CREATE INDEX IF NOT EXISTS idx_personality_community_community ON personality_community_mapping(community_id);
CREATE INDEX IF NOT EXISTS idx_hobbies_community ON hobbies(community_id);
CREATE INDEX IF NOT EXISTS idx_hobbies_name ON hobbies(name);

-- Insert communities
INSERT INTO communities (community_id, name, description) VALUES
(1, 'Outdoor & Fitness', 'For those who love staying active and exploring the outdoors'),
(2, 'Culinary', 'Food enthusiasts who enjoy cooking, baking, and culinary experiences'),
(3, 'Gaming', 'Video game lovers and board game enthusiasts'),
(4, 'Arts', 'Creative individuals who express themselves through visual arts'),
(5, 'Crafts', 'Makers and DIY enthusiasts who enjoy hands-on projects'),
(6, 'Music', 'Musicians and music lovers who appreciate all genres')
ON CONFLICT (community_id) DO UPDATE SET 
    name = EXCLUDED.name, 
    description = EXCLUDED.description;

-- Map personality codes to communities
-- F = Fitness -> Outdoor & Fitness
INSERT INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
('F', 1, TRUE)
ON CONFLICT (personality_code, community_id) DO UPDATE SET is_primary = EXCLUDED.is_primary;

-- C = Creatives -> Arts, Crafts, Music
INSERT INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
('C', 4, TRUE),
('C', 5, FALSE),
('C', 6, FALSE)
ON CONFLICT (personality_code, community_id) DO UPDATE SET is_primary = EXCLUDED.is_primary;

-- N = Nature -> Outdoor & Fitness
INSERT INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
('N', 1, TRUE)
ON CONFLICT (personality_code, community_id) DO UPDATE SET is_primary = EXCLUDED.is_primary;

-- S = Social -> Culinary, Gaming
INSERT INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
('S', 2, TRUE),
('S', 3, FALSE)
ON CONFLICT (personality_code, community_id) DO UPDATE SET is_primary = EXCLUDED.is_primary;

-- L = Lifestyle -> Culinary, Arts, Music
INSERT INTO personality_community_mapping (personality_code, community_id, is_primary) VALUES
('L', 2, TRUE),
('L', 4, FALSE),
('L', 6, FALSE)
ON CONFLICT (personality_code, community_id) DO UPDATE SET is_primary = EXCLUDED.is_primary;
