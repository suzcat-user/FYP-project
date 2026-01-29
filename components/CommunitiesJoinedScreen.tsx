import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hobby } from '../types';

interface CommunitiesJoinedScreenProps {
  userId?: number;
  isDarkMode?: boolean;
  onBack: () => void;
}

interface CommunityData {
  hobby_id: number;
  name: string;
  description: string;
  personality_code: string;
  emoji: string;
}

const CommunitiesJoinedScreen: React.FC<CommunitiesJoinedScreenProps> = ({ userId, isDarkMode = false, onBack }) => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<CommunityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const response = await fetch(`http://localhost:3001/api/hobbies/user/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch communities');
        }
        
        const data = await response.json();
        setCommunities(data || []);
      } catch (err) {
        console.error('Failed to fetch user communities:', err);
        setError('Failed to load your communities');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCommunities();
  }, [userId]);

  const handleLeaveCommunity = async (hobbyId: number) => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/hobbies/user/${userId}/${hobbyId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to leave community');
      }

      setCommunities(communities.filter(c => c.hobby_id !== hobbyId));
    } catch (err) {
      console.error('Failed to leave community:', err);
      alert('Failed to leave community');
    }
  };

  const bgColor = isDarkMode ? '#1a1a2e' : '#f0f0f0';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const cardBgColor = isDarkMode ? '#16213e' : '#ffffff';
  const borderColor = isDarkMode ? '#0f3460' : '#ddd';

  return (
    <div style={{
      height: '100%',
      padding: '20px',
      backgroundColor: bgColor,
      color: textColor,
      fontFamily: "'Arcade', monospace",
      overflow: 'auto',
      backgroundImage: `linear-gradient(45deg, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'} 25%, transparent 25%, transparent 75%, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'} 75%, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'}), linear-gradient(45deg, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'} 25%, transparent 25%, transparent 75%, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'} 75%, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'})`,
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 20px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '30px',
          textAlign: 'center',
          borderBottom: `3px solid #ff006e`,
          paddingBottom: '20px'
        }}>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '10px',
            color: '#ff006e',
            textShadow: isDarkMode ? '0 0 10px #ff006e' : 'none',
            letterSpacing: '2px'
          }}>
            🏘️ MY COMMUNITIES
          </h1>
          <p style={{
            fontSize: '1rem',
            color: isDarkMode ? '#a0aec0' : '#666'
          }}>
            Communities you have joined
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            fontSize: '1.2rem',
            color: isDarkMode ? '#a0aec0' : '#666'
          }}>
            Loading your communities...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            padding: '20px',
            backgroundColor: isDarkMode ? '#742a2a' : '#ffcccc',
            color: isDarkMode ? '#ff9999' : '#cc0000',
            border: `2px solid ${isDarkMode ? '#ff6666' : '#cc0000'}`,
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {error}
          </div>
        )}

        {/* Communities List */}
        {!loading && !error && communities.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {communities.map((community) => (
              <div
                key={community.hobby_id}
                onClick={() => navigate(`/community/${community.name.replace(/\s+/g, '-').toLowerCase()}`)}
                style={{
                  backgroundColor: cardBgColor,
                  border: `3px solid ${borderColor}`,
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: isDarkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '2rem' }}>{community.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: isDarkMode ? '#fff' : '#333'
                    }}>
                      {community.name}
                    </h3>
                    <p style={{
                      margin: '5px 0 0 0',
                      fontSize: '0.9rem',
                      color: isDarkMode ? '#a0aec0' : '#666'
                    }}>
                      {community.description || 'No description'}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '15px'
                }}>
                  <button
                    onClick={() => handleLeaveCommunity(community.hobby_id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: isDarkMode ? '#9f1239' : '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontFamily: "'Arcade', monospace",
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode ? '#7f1d1d' : '#b91c1c';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode ? '#9f1239' : '#dc2626';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    LEAVE
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: cardBgColor,
              border: `2px dashed ${borderColor}`,
              borderRadius: '8px'
            }}>
              <p style={{
                fontSize: '1.1rem',
                color: isDarkMode ? '#a0aec0' : '#666',
                margin: '0'
              }}>
                You haven't joined any communities yet!
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: isDarkMode ? '#718096' : '#999',
                margin: '10px 0 0 0'
              }}>
                Visit the Communities section to join one.
              </p>
            </div>
          )
        )}

        {/* Back Button */}
        <div style={{
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 30px',
              backgroundColor: isDarkMode ? '#1e3a8a' : '#0284c7',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'Arcade', monospace",
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#1e40af' : '#0369a1';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#1e3a8a' : '#0284c7';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesJoinedScreen;
