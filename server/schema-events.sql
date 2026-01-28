-- Events System Schema
-- Creates tables for community events and user participation

-- Events table
CREATE TABLE IF NOT EXISTS events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  community_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE,
  event_time TIME,
  location VARCHAR(255),
  points_reward INT DEFAULT 10,
  max_participants INT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_events_community_id (community_id),
  INDEX idx_events_date (event_date),
  INDEX idx_events_created_at (created_at)
);

-- User Event Participation junction table
CREATE TABLE IF NOT EXISTS user_event_participation (
  participation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('joined', 'cancelled') DEFAULT 'joined',
  UNIQUE KEY unique_user_event (user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  INDEX idx_participation_user_id (user_id),
  INDEX idx_participation_event_id (event_id),
  INDEX idx_participation_status (status)
);

-- User Communities table (to track which communities users have joined)
CREATE TABLE IF NOT EXISTS user_communities (
  membership_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  community_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_community (user_id, community_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE CASCADE,
  INDEX idx_user_communities_user_id (user_id),
  INDEX idx_user_communities_community_id (community_id)
);
