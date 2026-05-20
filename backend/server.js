const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Queries the Hugging Face Inference API for GPT-2.
 * @param {string} prompt - The text to prompt the model.
 * @param {string} token - The Hugging Face API bearer token.
 */
async function queryHuggingFace(prompt, token) {
  if (!token || token === 'your_huggingface_api_token_here' || token.trim() === '') {
    throw new Error("HUGGINGFACE_API_TOKEN is not configured in backend/.env");
  }

  const response = await fetch('https://api-inference.huggingface.co/models/openai-community/gpt2', {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Hugging Face API returned status ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage += `: ${errorJson.error || errorText}`;
    } catch (e) {
      errorMessage += `: ${errorText}`;
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();
  
  // Extract generated text from the returned list of options
  if (Array.isArray(result) && result[0]?.generated_text) {
    return result[0].generated_text;
  }
  
  if (result.error) {
    throw new Error(result.error);
  }

  return JSON.stringify(result);
}

// POST endpoint for chat completion
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: "A valid 'prompt' string is required in the request body." });
  }

  console.log(`[API] Processing prompt: "${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}"`);

  try {
    const replyText = await queryHuggingFace(prompt, process.env.HUGGINGFACE_API_TOKEN);
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
    tokenConfigured: !!(process.env.HUGGINGFACE_API_TOKEN && process.env.HUGGINGFACE_API_TOKEN !== 'your_huggingface_api_token_here')
  });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API Endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`========================================`);
});
