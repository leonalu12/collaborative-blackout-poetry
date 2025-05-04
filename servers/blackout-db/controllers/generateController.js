// controllers/generateController.js
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateText(req, res) {
  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user",   content: "Generate a 5 sentence paragraph, evocative piece of text suitable for a blackout poem." }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const text = chat.choices[0].message.content.trim();
    res.json({ text });
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err); 
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { generateText };