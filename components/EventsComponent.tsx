import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { eventService } from '../services/eventService';

interface EventsComponentProps {
  userId?: number;
  communityId?: number;
  isDarkMode?: boolean;
  onEventJoined?: (event: Event, pointsEarned: number) => void;
  compact?: boolean;
}

const EventsComponent: React.FC<EventsComponentProps> = ({ 
  userId, 
  communityId, 
  isDarkMode = false,
  onEventJoined,
  compact = false
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [userEventIds, setUserEventIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [joinedEvent, setJoinedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('User ID not available');
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        let fetchedEvents: Event[];
        
        if (communityId) {
          fetchedEvents = await eventService.getCommunityEvents(communityId);
        } else {
          fetchedEvents = await eventService.getAllEvents();
        }
        
        setEvents(fetchedEvents);

        // Fetch user's joined events
        const userEvents = await eventService.getUserEvents(userId);
        setUserEventIds(new Set(userEvents.map(e => e.event_id)));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId, communityId]);

  const handleJoinEvent = async (event: Event) => {
    try {
      const result = await eventService.joinEvent(userId, event.event_id);
      
      // Update local state
      setUserEventIds(prev => new Set([...prev, event.event_id]));
      setJoinMessage(result.message);
      setJoinedEvent(event);
      
      // Call parent callback
      if (onEventJoined) {
        onEventJoined(event, result.points_earned);
      }

      // Clear message and modal after 4 seconds
      setTimeout(() => {
        setJoinMessage(null);
        setJoinedEvent(null);
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join event');
    }
  };

  const handleLeaveEvent = async (event: Event) => {
    try {
      const result = await eventService.leaveEvent(userId, event.event_id);
      
      // Update local state
      setUserEventIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(event.event_id);
        return newSet;
      });
      setJoinMessage(result.message);

      // Clear message after 3 seconds
      setTimeout(() => setJoinMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave event');
    }
  };

  if (loading) {
    return (
      <div className={`p-4 text-center ${isDarkMode ? 'text-indigo-300' : 'text-sky-700'}`}>
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 text-center ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
        Error: {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={`p-4 text-center ${isDarkMode ? 'text-indigo-300' : 'text-sky-700'}`}>
        No events available yet.
      </div>
    );
  }

  return (
    <div className={`w-full ${compact ? '' : 'max-w-6xl mx-auto p-4'}`}>
      {!compact && <h2 className={`text-2xl font-press-start mb-6 ${isDarkMode ? 'text-pink-400' : 'text-sky-700'}`}>
        🎉 UPCOMING EVENTS
      </h2>}

      {joinMessage && (
        <div className={`mb-4 p-4 border-4 text-center font-vt323 text-lg ${isDarkMode ? 'bg-green-900 border-green-700 text-green-200' : 'bg-green-100 border-green-700 text-green-800'}`}>
          ✅ {joinMessage}
        </div>
      )}

      <div className={compact ? 'flex flex-col gap-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
        {events.map((event) => {
          const isJoined = userEventIds.has(event.event_id);
          const eventDate = new Date(event.event_date);
          const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          });

          if (compact) {
            return (
              <div
                key={event.event_id}
                className={`border-2 p-2 flex flex-col gap-2 transition-all text-sm ${
                  isDarkMode
                    ? `bg-slate-900 ${isJoined ? 'border-green-500' : 'border-purple-700'}`
                    : `bg-white ${isJoined ? 'border-green-600' : 'border-purple-400'}`
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h4 className={`font-press-start text-xs ${isDarkMode ? 'text-pink-400' : 'text-purple-700'}`}>
                      {event.title}
                    </h4>
                    <p className={`font-vt323 text-xs mt-1 ${isDarkMode ? 'text-indigo-300' : 'text-purple-600'}`}>
                      📅 {formattedDate}
                    </p>
                  </div>
                  <span className={`font-press-start text-xs text-yellow-500 whitespace-nowrap`}>
                    +{event.points_reward}
                  </span>
                </div>
                <button
                  onClick={() => isJoined ? handleLeaveEvent(event) : handleJoinEvent(event)}
                  className={`font-press-start text-xs px-2 py-1 border-2 transition-all cursor-pointer ${
                    isJoined
                      ? isDarkMode
                        ? 'bg-red-600 border-red-800 text-white hover:bg-red-700'
                        : 'bg-red-500 border-red-700 text-white hover:bg-red-600'
                      : isDarkMode
                      ? 'bg-green-600 border-green-800 text-white hover:bg-green-700'
                      : 'bg-green-500 border-green-700 text-white hover:bg-green-600'
                  }`}
                >
                  {isJoined ? '✓ LEAVE' : '+ JOIN'}
                </button>
              </div>
            );
          }

          return (
            <div
              key={event.event_id}
              className={`border-4 p-4 flex flex-col gap-3 transition-all ${
                isDarkMode
                  ? `bg-slate-800 ${isJoined ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border-indigo-700'}`
                  : `bg-white ${isJoined ? 'border-green-600 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'border-sky-400'}`
              }`}
            >
              {/* Event Header */}
              <div className={`border-b-2 pb-2 ${isDarkMode ? 'border-indigo-600' : 'border-sky-200'}`}>
                <h3 className={`font-press-start text-lg ${isDarkMode ? 'text-pink-400' : 'text-sky-700'}`}>
                  {event.title}
                </h3>
                {event.community_name && (
                  <p className={`font-vt323 text-sm mt-1 ${isDarkMode ? 'text-indigo-300' : 'text-sky-600'}`}>
                    📍 {event.community_name}
                  </p>
                )}
              </div>

              {/* Event Details */}
              <div className={`font-vt323 text-sm space-y-1 ${isDarkMode ? 'text-indigo-200' : 'text-sky-700'}`}>
                <p>📅 {formattedDate}</p>
                {event.event_time && <p>⏰ {event.event_time}</p>}
                {event.location && <p>📍 {event.location}</p>}
                <p className={`font-press-start text-yellow-500`}>🏆 +{event.points_reward} PTS</p>
              </div>

              {/* Description */}
              {event.description && (
                <p className={`font-vt323 text-sm flex-grow ${isDarkMode ? 'text-indigo-200' : 'text-sky-700'}`}>
                  {event.description}
                </p>
              )}

              {/* Participants Count */}
              <div className={`text-center font-vt323 text-xs ${isDarkMode ? 'text-indigo-400' : 'text-sky-600'}`}>
                👥 {event.participant_count || 0} participants
              </div>

              {/* Join/Leave Button */}
              <button
                onClick={() => isJoined ? handleLeaveEvent(event) : handleJoinEvent(event)}
                className={`font-press-start text-sm px-3 py-2 border-4 border-b-8 active:border-b-4 active:translate-y-1 transition-all cursor-pointer ${
                  isJoined
                    ? isDarkMode
                      ? 'bg-red-600 border-red-800 text-white hover:bg-red-700'
                      : 'bg-red-500 border-red-700 text-white hover:bg-red-600'
                    : isDarkMode
                    ? 'bg-green-600 border-green-800 text-white hover:bg-green-700'
                    : 'bg-green-500 border-green-700 text-white hover:bg-green-600'
                }`}
              >
                {isJoined ? '✓ LEAVE' : '+ JOIN'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Celebration Modal */}
      {joinedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className={`w-full max-w-md border-8 p-8 flex flex-col gap-6 text-center animate-bounce ${isDarkMode ? 'bg-[#1a1c27] border-pink-600' : 'bg-white border-sky-800'}`}>
            {/* Celebration */}
            <div className="text-6xl animate-pulse">
              🎉✨🎊
            </div>

            {/* Title */}
            <h2 className={`font-press-start text-2xl ${isDarkMode ? 'text-pink-400' : 'text-sky-700'}`}>
              EVENT JOINED!
            </h2>

            {/* Event Name */}
            <div className={`p-4 border-4 ${isDarkMode ? 'bg-slate-900 border-pink-600' : 'bg-blue-50 border-sky-400'}`}>
              <h3 className={`font-press-start text-lg ${isDarkMode ? 'text-pink-300' : 'text-sky-800'}`}>
                {joinedEvent.title}
              </h3>
            </div>

            {/* Event Details */}
            <div className={`space-y-3 font-vt323 text-lg ${isDarkMode ? 'text-indigo-200' : 'text-sky-700'}`}>
              {joinedEvent.event_date && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">📅</span>
                  <span>
                    {new Date(joinedEvent.event_date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {joinedEvent.event_time && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">⏰</span>
                  <span>{joinedEvent.event_time}</span>
                </div>
              )}
              {joinedEvent.location && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">📍</span>
                  <span>{joinedEvent.location}</span>
                </div>
              )}
            </div>

            {/* Points Reward */}
            <div className={`p-3 border-4 font-press-start text-xl ${isDarkMode ? 'bg-yellow-900 border-yellow-600 text-yellow-300' : 'bg-yellow-100 border-yellow-600 text-yellow-800'}`}>
              +{joinedEvent.points_reward} POINTS EARNED! 🏆
            </div>

            {/* Message */}
            <div className={`p-4 border-4 ${isDarkMode ? 'bg-purple-900/50 border-purple-600' : 'bg-purple-100 border-purple-400'}`}>
              <p className={`font-vt323 text-lg font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                See you there! 🚀
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setJoinedEvent(null);
                setJoinMessage(null);
              }}
              className={`font-press-start text-sm px-6 py-2 border-4 border-b-8 active:border-b-4 active:translate-y-1 transition-all cursor-pointer ${isDarkMode ? 'bg-pink-600 border-pink-800 text-white hover:bg-pink-700' : 'bg-pink-500 border-pink-700 text-white hover:bg-pink-600'}`}
            >
              AWESOME!
            </button>
          </div>
        </div>
      )}    </div>
  );
};

export default EventsComponent;