const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`

export async function getAIResponse(chatHistory, userMessage, userProfile) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.')
  }

  // Build context from user profile
  const profileContext = Object.entries(userProfile)
    .filter(([key, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')

  // Build chat history context
  const recentHistory = chatHistory
    .slice(-5) // Last 5 messages for context
    .map(msg => `${msg.type}: ${msg.content}`)
    .join('\n')

  const systemPrompt = `Act as a Certified Financial Planner (CFP) with 15 years of experience in Indian financial markets. 

Context: ${profileContext ? `User Profile: ${profileContext}` : 'No user profile provided yet'}

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

Answer the user's question with personalized, practical financial guidance.`

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Question: ${userMessage}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API Error:', errorData)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text
    } else {
      throw new Error('Invalid response format from Gemini API')
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    throw error
  }
}