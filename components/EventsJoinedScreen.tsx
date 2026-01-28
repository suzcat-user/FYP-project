import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { eventService } from '../services/eventService';
import ArcadeButton from './ui/ArcadeButton';

interface EventsJoinedScreenProps {
  userId?: number;
  isDarkMode?: boolean;
  onBack: () => void;
}

const EventsJoinedScreen: React.FC<EventsJoinedScreenProps> = ({ userId, isDarkMode = false, onBack }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const userEvents = await eventService.getUserEvents(userId);
        setEvents(userEvents);
        
        // Calculate total points from joined events
        const total = userEvents.reduce((sum, event) => sum + (event.points_reward || 0), 0);
        setTotalPoints(total);
      } catch (err) {
        console.error('Failed to fetch user events:', err);
        setError('Failed to load your events');
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [userId]);

  const handleLeaveEvent = async (eventId: number) => {
    if (!userId) return;

    try {
      await eventService.leaveEvent(userId, eventId);
      // Remove event from list
      setEvents(events.filter(e => e.event_id !== eventId));
      // Recalculate total points
      const updatedEvents = events.filter(e => e.event_id !== eventId);
      const total = updatedEvents.reduce((sum, event) => sum + (event.points_reward || 0), 0);
      setTotalPoints(total);
    } catch (err) {
      console.error('Failed to leave event:', err);
      alert('Failed to leave event');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const bgColor = isDarkMode ? '#1a1a2e' : '#f0f0f0';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const cardBgColor = isDarkMode ? '#16213e' : '#ffffff';
  const borderColor = isDarkMode ? '#0f3460' : '#ddd';

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: bgColor,
      color: textColor,
      fontFamily: "'Arcade', monospace",
      backgroundImage: `linear-gradient(45deg, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'} 25%, transparent 25%, transparent 75%, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'} 75%, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'}), linear-gradient(45deg, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'} 25%, transparent 25%, transparent 75%, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'} 75%, ${isDarkMode ? '#1a1a2e' : '#f0f0f0'})`,
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 20px 20px',
      backgroundColor: bgColor
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
            fontSize: '2.5em',
            margin: '10px 0',
            color: '#ff006e',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '3px'
          }}>
            🎮 MY EVENTS 🎮
          </h1>
          <p style={{ fontSize: '1.2em', margin: '5px 0' }}>
            🏆 Total Points: <strong>{totalPoints}</strong>
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '1.3em' }}>Loading your events... ⏳</p>
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: '#ff6b6b',
            border: '2px solid #ff0000',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.1em', color: '#fff', margin: 0 }}>❌ {error}</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{
            backgroundColor: cardBgColor,
            border: `2px dashed ${borderColor}`,
            padding: '40px 20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.3em', margin: '0' }}>
              📭 You haven't joined any events yet!
            </p>
            <p style={{ fontSize: '1.1em', color: '#888', marginTop: '10px' }}>
              Explore communities and join events to earn points.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '20px'
          }}>
            {events.map((event) => (
              <div
                key={event.event_id}
                style={{
                  backgroundColor: cardBgColor,
                  border: `3px solid ${borderColor}`,
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  gap: '20px',
                  boxShadow: isDarkMode ? '0 4px 8px rgba(255,0,110,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '1.3em',
                    color: '#ff006e'
                  }}>
                    {event.title}
                  </h3>
                  
                  {event.description && (
                    <p style={{
                      margin: '8px 0',
                      fontSize: '0.95em',
                      opacity: 0.8
                    }}>
                      {event.description}
                    </p>
                  )}

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                    marginTop: '12px',
                    fontSize: '0.9em'
                  }}>
                    {event.community_name && (
                      <div>
                        🏘️ <strong>{event.community_name}</strong>
                      </div>
                    )}
                    
                    {event.event_date && (
                      <div>
                        📅 {formatDate(event.event_date)}
                        {event.event_time && ` at ${event.event_time}`}
                      </div>
                    )}

                    {event.location && (
                      <div>
                        📍 {event.location}
                      </div>
                    )}
                  </div>

                  {event.joined_at && (
                    <p style={{
                      margin: '8px 0 0 0',
                      fontSize: '0.85em',
                      opacity: 0.6
                    }}>
                      Joined: {formatDate(event.joined_at)}
                    </p>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '15px',
                  minWidth: '120px'
                }}>
                  <div style={{
                    textAlign: 'center',
                    backgroundColor: '#ffd60a',
                    color: '#000',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                    minWidth: '100px'
                  }}>
                    ⭐ {event.points_reward}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to leave this event? You will lose the points earned.')) {
                        handleLeaveEvent(event.event_id);
                      }
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ff0000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.85em',
                      fontWeight: 'bold',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#cc0000';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ff0000';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    }}
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <ArcadeButton 
            onClick={onBack}
            label="Back"
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsJoinedScreen;
