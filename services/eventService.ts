import { Event } from '../types';

export const eventService = {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    const response = await fetch('http://localhost:3001/api/events');
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  // Get events for a specific community
  async getCommunityEvents(communityId: number): Promise<Event[]> {
    const response = await fetch(`http://localhost:3001/api/events/community/${communityId}`);
    if (!response.ok) throw new Error('Failed to fetch community events');
    return response.json();
  },

  // Get events user has joined
  async getUserEvents(userId: number): Promise<Event[]> {
    const response = await fetch(`http://localhost:3001/api/events/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user events');
    return response.json();
  },

  // Join an event
  async joinEvent(userId: number, eventId: number): Promise<{ success: boolean; message: string; points_earned: number }> {
    const response = await fetch('http://localhost:3001/api/events/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, event_id: eventId })
    });
    if (!response.ok) throw new Error('Failed to join event');
    return response.json();
  },

  // Leave an event
  async leaveEvent(userId: number, eventId: number): Promise<{ success: boolean; message: string; points_deducted: number }> {
    const response = await fetch('http://localhost:3001/api/events/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, event_id: eventId })
    });
    if (!response.ok) throw new Error('Failed to leave event');
    return response.json();
  },

  // Create a new event
  async createEvent(event: Partial<Event>): Promise<{ success: boolean; event_id: number; message: string }> {
    const response = await fetch('http://localhost:3001/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  }
};
