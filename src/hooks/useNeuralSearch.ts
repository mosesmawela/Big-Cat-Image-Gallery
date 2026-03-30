import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Note: In production, the API key should be handled via a secure backend or environment variable
const GEN_AI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const useNeuralSearch = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractSearchParameters = useCallback(async (userPrompt: string) => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      return { query: userPrompt, tags: [] };
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const model = GEN_AI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        You are a visual search assistant for a premium wallpaper gallery. 
        Transform the following user query into a structured search object.
        User Query: "${userPrompt}"
        
        Return ONLY a JSON object with:
        - "optimizedQuery": A concise text query for search.
        - "tags": An array of 3-5 keywords related to color, mood, or subject.
        - "category": One of [Nature, Minimal, Futuristic, Multi-Monitor, Abstract, Live Wallpaper] or null.
        
        Example Output: {"optimizedQuery": "cyberpunk city neon", "tags": ["neon", "blue", "night", "future"], "category": "Futuristic"}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Basic JSON extraction from markdown if model returns it
      const jsonStr = text.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (err) {
      console.error('Neural Search Analysis Failed:', err);
      setError('Neural analysis failed. Falling back to text search.');
      return { optimizedQuery: userPrompt, tags: [], category: null };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    extractSearchParameters,
    isAnalyzing,
    error
  };
};
