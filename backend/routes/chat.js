const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// POST /api/chat
router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY is not configured. Please set it in backend/.env',
    });
  }

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      max_tokens: parseInt(process.env.MAX_TOKENS || '1024', 10),
    });

    const reply = completion.choices[0].message;
    res.json({ message: reply });
  } catch (err) {
    console.error('OpenAI API error:', err.message);
    res.status(502).json({ error: err.message || 'Failed to reach AI service' });
  }
});

module.exports = router;
