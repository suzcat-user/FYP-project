import { useState, useEffect } from 'react';

interface Question {
  question_id: number;
  game_type: string;
  question_text: string;
  question_title?: string;
  question_subtitle?: string;
  options?: Array<{
    option_id: number;
    option_text: string;
    option_icon?: string;
    personality_type?: string;
  }>;
  choices?: Array<{
    choice_id: number;
    choice_text: string;
    points?: number;
  }>;
}

export const useQuestions = (gameType: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3002/api/questions/game/${gameType}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.statusText}`);
        }
        
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (gameType) {
      fetchQuestions();
    }
  }, [gameType]);

  return { questions, loading, error };
};

export const useQuestion = (questionId: number) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3002/api/questions/${questionId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch question: ${response.statusText}`);
        }
        
        const data = await response.json();
        setQuestion(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching question:', err);
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  return { question, loading, error };
};
