const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// POST /api/chat
app.post('/api/chat', async (req, res) => {
  // 1. Security Check: Validate that Gemini API key exists
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '') {
    return res.status(500).json({
      error: 'Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your server/.env file.'
    });
  }

  const { journal, mood, exam, history, message } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-flash as requested
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Scenario A: User logs a daily journal entry (triggers stress & emotional analysis)
    if (journal !== undefined) {
      const systemPrompt = `You are a compassionate, expert mental wellness companion for Indian students preparing for highly competitive exams like JEE, NEET, UPSC, GATE, CAT, and CUET.
The student has logged their mood and written a journal entry.
Their target exam is: ${exam || 'Competitive Exams'}.
Their self-reported mood is: ${mood}/10 (where 1 is lowest/most stressed, 10 is highest/most peaceful).
Their journal entry: "${journal}"

You must analyze this entry for hidden stress triggers, anxiety levels, and emotional patterns, and respond with an empathetic wellness analysis and a warm, personalized chat companion opening.
You must respond with a JSON object containing the following keys:
1. "analysis": An object containing:
   - "anxietyLevel": A string, one of "Low", "Medium", "High", or "Severe".
   - "stressors": A list of strings (up to 3) identifying key stressors (e.g. "Mock test anxiety", "Peer comparison", "Backlog pressure", "Sleep deprivation", "Parental expectation").
   - "copingStrategies": A list of 2-3 specific, actionable mindfulness or study-pacing strategies (e.g. box breathing, Pomodoro modification, 10-minute walk, positive self-talk). Make these specific to their exam if possible (e.g. if JEE/NEET, mention formulas/practice stress; if UPSC, mention answer writing/current affairs burnout).
2. "companionResponse": A warm, empathetic, and personalized message (120-180 words) addressed directly to the student. Speak like a friendly mentor/counselor who understands the brutal pressure of Indian exams. Acknowledge their specific journal content, validate their feelings, offer immediate comfort, and invite them to share more. Do not sound clinical or robotic. Mention their specific exam context naturally if relevant.

Return ONLY the JSON object. Do not include markdown code block syntax (like \`\`\`json) or any extra text outside the JSON.`;

      const result = await model.generateContent({
        contents: systemPrompt,
        generationConfig: { responseMimeType: 'application/json' }
      });

      const responseText = result.response.text();
      const parsedResponse = JSON.parse(responseText);
      return res.json(parsedResponse);
    } 
    
    // Scenario B: User sends a follow-up message in the chat companion
    else if (message !== undefined) {
      // Format chat history for Gemini API
      const formattedHistory = (history || []).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const studentContext = `You are a compassionate, expert mental wellness companion for an Indian student preparing for the ${exam || 'competitive exams'} exam. 
Keep your tone warm, friendly, and supportive. Use light Indian English style or terms if appropriate (like 'beta', 'yaar', or referencing coaching hub pressures in Kota/Delhi, but keep it natural). 
Respond empathetically to their last message, offering coping techniques, encouragement, or active listening. Make sure your response is under 150 words. Do not sound robotic.`;

      const chat = model.startChat({
        history: formattedHistory,
        systemInstruction: studentContext
      });

      const result = await chat.sendMessage(message);
      const responseText = result.response.text();
      return res.json({ companionResponse: responseText });
    } 
    
    // Scenario C: Invalid request body
    else {
      return res.status(400).json({ error: 'Invalid request. Please provide journal/mood details or a chat message.' });
    }

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate response from Gemini. Please check your server API key and connection.',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
