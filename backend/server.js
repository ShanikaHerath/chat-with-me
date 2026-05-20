const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Queries Google AI Studio's Gemini API.
 * @param {string} prompt - The text prompt.
 * @param {string} modelId - The Gemini model (e.g. gemini-2.5-flash, gemini-1.5-flash, etc.).
 * @param {string} [imageBase64] - Optional base64 data URL for multimodal input.
 * @param {string} apiKey - Google Gemini API key.
 */
async function queryGemini(prompt, modelId, imageBase64, apiKey) {
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    throw new Error("GEMINI_API_KEY is not configured in backend/.env");
  }

  // Set default model if not provided or unknown
  const validModels = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  const activeModel = validModels.includes(modelId) ? modelId : 'gemini-2.5-flash';

  const parts = [{ text: prompt }];

  // If there is an image, parse and append it
  if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.startsWith('data:')) {
    const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      parts.push({
        inlineData: {
          mimeType: match[1],
          data: match[2]
        }
      });
    }
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Gemini API returned status ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error?.message) {
        errorMessage += `: ${errorJson.error.message}`;
      } else {
        errorMessage += `: ${errorText}`;
      }
    } catch (e) {
      errorMessage += `: ${errorText}`;
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();

  if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
    return result.candidates[0].content.parts[0].text;
  }

  if (result.error) {
    throw new Error(result.error.message || JSON.stringify(result.error));
  }

  return JSON.stringify(result);
}

// POST endpoint for chat completion
app.post('/api/chat', async (req, res) => {
  const { prompt, model, image } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: "A valid 'prompt' string is required in the request body." });
  }

  console.log(`[API] Processing prompt: "${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}" using model: ${model || 'gemini-2.5-flash'} (image attached: ${!!image})`);

  try {
    const replyText = await queryGemini(prompt, model, image, process.env.GEMINI_API_KEY);
    res.json({ response: replyText });
  } catch (error) {
    console.error("[API Error] Failed to generate response:", error.message);
    res.status(500).json({
      error: error.message,
      suggestion: "Check your backend/.env configuration or your internet connectivity."
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    tokenConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here')
  });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API Endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`========================================`);
});
