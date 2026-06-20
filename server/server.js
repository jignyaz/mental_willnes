const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// POST /api/chat
app.post('/api/chat', async (req, res) => {
  // 1. Security Check: Validate that Groq API key exists
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '') {
    return res.status(500).json({
      error: 'Groq API key is not configured on the server. Please add GROQ_API_KEY to your server/.env file.'
    });
  }

  const { journal, exam, history, message } = req.body;

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    // Use llama-3.3-70b-versatile as a fast and reliable model on Groq
    const model = 'llama-3.3-70b-versatile';

    // Scenario A: User logs a daily journal entry — AI auto-detects mood score
    if (journal !== undefined) {
      const systemPrompt = `You are a compassionate, expert mental wellness companion for Indian students preparing for highly competitive exams like JEE, NEET, UPSC, GATE, CAT, and CUET.
A student has written a journal entry expressing their current mental state.
Their target exam is: ${exam || 'Competitive Exams'}.
Their journal entry: "${journal}"

Your job is to:
1. Read their journal deeply for emotional tone, hidden stress, sleep quality clues, burnout markers, and overall wellbeing.
2. AUTO-ASSIGN a mood score from 1 to 10 based ONLY on what they wrote (1 = deeply distressed/overwhelmed, 5 = flat/neutral, 10 = genuinely happy/unstoppable). Be honest and accurate — do not inflate scores to be kind.
3. Detect specific stress triggers and provide personalized coping strategies.

You must respond with a JSON object containing these keys:
1. "moodScore": An integer from 1 to 10 representing the detected emotional state from their journal text.
2. "moodLabel": A short label for the mood (e.g. "Overwhelmed", "Distressed", "Anxious", "Exhausted", "Flat", "Coping", "Balanced", "Focused", "Calm", "Unstoppable").
3. "analysis": An object containing:
   - "anxietyLevel": A string, one of "Low", "Medium", "High", or "Severe".
   - "stressors": A list of strings (up to 3) identifying key stressors (e.g. "Mock test anxiety", "Peer comparison", "Backlog pressure", "Sleep deprivation", "Parental expectation").
   - "copingStrategies": A list of 2-3 specific, actionable mindfulness or study-pacing strategies. Make these specific to their exam if possible.
4. "companionResponse": A warm, empathetic, and personalized message (120-180 words) addressed directly to the student. Speak like a friendly mentor who understands the brutal pressure of Indian exams. Acknowledge their specific journal content, validate their feelings, offer immediate comfort, and invite them to share more. Mention their specific exam context naturally if relevant.

Return ONLY the JSON object. Do not include markdown code block syntax or any extra text outside the JSON.`;

      const response = await groq.chat.completions.create({
        messages: [
          { role: 'user', content: systemPrompt }
        ],
        model: model,
        response_format: { type: 'json_object' }
      });

      const responseText = response.choices[0].message.content;
      const parsedResponse = JSON.parse(responseText);
      return res.json(parsedResponse);
    } 
    
    // Scenario B: User sends a follow-up message in the chat companion
    else if (message !== undefined) {
      // Format chat history for Groq API
      const formattedHistory = (history || []).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const studentContext = `You are a compassionate, expert mental wellness companion for an Indian student preparing for the ${exam || 'competitive exams'} exam. 
Keep your tone warm, friendly, and supportive. Use light Indian English style or terms if appropriate (like 'beta', 'yaar', or referencing coaching hub pressures in Kota/Delhi, but keep it natural). 
Respond empathetically to their last message, offering coping techniques, encouragement, or active listening. Make sure your response is under 150 words. Do not sound robotic.`;

      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: studentContext },
          ...formattedHistory,
          { role: 'user', content: message }
        ],
        model: model
      });

      const responseText = response.choices[0].message.content;
      return res.json({ companionResponse: responseText });
    } 
    
    // Scenario C: Invalid request body
    else {
      return res.status(400).json({ error: 'Invalid request. Please provide journal/mood details or a chat message.' });
    }

  } catch (error) {
    console.error('Groq API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate response from Groq. Please check your server API key and connection.',
      details: error.message
    });
  }
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
