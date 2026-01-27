import { useState, useEffect } from 'react';
import { Hobby, PersonalityCode } from '../types';

export interface PersonalityWithHobbies {
  code: PersonalityCode;
  name: string;
  emoji: string;
  description: string;
  communities: string[];
  hobbies: Hobby[];
}

export function useHobbies() {
  const [hobbies, setHobbies] = useState<PersonalityWithHobbies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/hobbies');
        if (!response.ok) {
          throw new Error('Failed to fetch hobbies');
        }
        const data = await response.json();
        
        // Map the API response to match our types
        const mapped: PersonalityWithHobbies[] = data.map((p: any) => ({
          code: p.code as PersonalityCode,
          name: p.name,
          emoji: p.emoji,
          description: p.description,
          communities: p.communities || [],
          hobbies: p.hobbies.map((h: any) => ({
            name: h.name,
            description: h.description,
            communityId: h.communityId
          }))
        }));
        
        setHobbies(mapped);
        setError(null);
      } catch (err) {
        console.error('Error fetching hobbies:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch hobbies');
      } finally {
        setLoading(false);
      }
    };

    fetchHobbies();
  }, []);

  return { hobbies, loading, error };
}

export function useHobbiesByPersonality(personalityCode: PersonalityCode | null) {
  const [personality, setPersonality] = useState<PersonalityWithHobbies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personalityCode) {
      setLoading(false);
      return;
    }

    const fetchHobbies = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/hobbies/personality/${personalityCode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch hobbies for personality');
        }
        const data = await response.json();
        
        setPersonality({
          code: data.code as PersonalityCode,
          name: data.name,
          emoji: data.emoji,
          description: data.description,
          communities: data.communities || [],
          hobbies: data.hobbies.map((h: any) => ({
            name: h.name,
            description: h.description,
            communityId: h.communityId
          }))
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching hobbies:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch hobbies');
      } finally {
        setLoading(false);
      }
    };

    fetchHobbies();
  }, [personalityCode]);

  return { personality, loading, error };
}
