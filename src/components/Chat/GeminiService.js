

import { GoogleGenAI } from "@google/genai";


const GEMINI_API_KEY = "google-gemini-api-key"

export async function getAIResponse(chatHistory,userMessage,userProfile,mode) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.')
  }

  // Build chat history context
  const recentHistory = [
    ...chatHistory.slice(-9), // last 9 messages
    { type: 'user', content: userMessage } // add current message manually
  ]
      .map(msg => `${msg.type}: ${msg.content}`)
      .join('\n');
  const systemPrompt = `Act as a Certified Financial Planner (CFP) with  experience in financial markets. 

Recent conversation:
${recentHistory}

Style Guidelines:
- Use **bold** for important amounts and key financial terms
- Use _underline_ for actionable items and important steps
- Include exactly 2 relevant emojis per message (not more)
- Keep responses conversational but professional
- Focus on practical, actionable advice for Indian financial landscape
- Use INR (₹) for all monetary references
- Consider Indian tax laws, investment options (SIP, PPF, ELSS, etc.)
- Mention specific Indian investment instruments when relevant

Answer the user's question with personalized, practical financial guidance.Keep the responses short and straightforward `



  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: systemPrompt,
  }).catch(console.error);

  if (!response) return "Sorry, something went wrong.";
  return response.text;
}
