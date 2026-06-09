import { GoogleGenerativeAI } from "@google/generative-ai";

function cleanFences(s = "") {
  // Remove ```json ... ``` or ``` ... ``` wrappers
  return s
    .replace(/```json[\r\n]+([\s\S]*?)```/gi, '$1')
    .replace(/```[\r\n]+([\s\S]*?)```/g, '$1')
    .trim();
}

function extractJsonBlock(s = "") {
  const cleaned = cleanFences(s);
  const braceMatch = cleaned.match(/\{[\s\S]*\}/);
  return braceMatch ? braceMatch[0] : cleaned;
}

function coerceOutput(json, rawText) {
  // Fallbacks
  const fallbackPalette = ["#0f172a", "#1e293b", "#334155", "#475569", "#64748b"]; 
  // If palette missing, try to find hex colors in raw text
  let palette = Array.isArray(json?.colorPalette) ? json.colorPalette.map(String) : [];
  if (!palette.length) {
    const hexes = (rawText || '').match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g) || [];
    palette = [...new Set(hexes)].slice(0, 5);
  }
  if (!palette.length) palette = fallbackPalette;

  return {
    title: String(json?.title || 'Creative Concept'),
    logline: String(json?.logline || (rawText || '').slice(0, 180)),
    visualStyle: String(json?.visualStyle || 'Modern, cinematic'),
    colorPalette: palette.slice(0, 8),
    shotIdeas: Array.isArray(json?.shotIdeas) ? json.shotIdeas.slice(0, 8).map(String) : [
      'Establishing shot', 'Medium close-up', 'Detail macro'
    ],
    mood: String(json?.mood || 'Stylish • Confident • Bold')
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { prompt } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return res.status(400).json({ error: 'Invalid prompt' });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server not configured (missing GEMINI_API_KEY)' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const system = `You are a creative director AI that outputs concise JSON only. Return strictly valid JSON matching this structure, no prose or comments:
{
  "title": string,
  "logline": string,
  "visualStyle": string,
  "colorPalette": string[],
  "shotIdeas": string[],
  "mood": string
}`;

    const fullPrompt = `${system}\n\nCreate a creative concept for this vision: ${prompt}\nConstraints: exactly 5 color hex codes (like #0f172a), and 3-6 shot ideas. Keep text concise.`;

    // Simpler call shape recommended by SDK
    const result = await model.generateContent(fullPrompt);
    const text = result?.response?.text?.() || result?.response?.text?.call?.(result.response) || '';

    if (!text) {
      return res.status(502).json({ error: 'Empty response from model' });
    }

    let parsed;
    const candidate = extractJsonBlock(text);
    try {
      parsed = JSON.parse(candidate);
    } catch {
      // Not valid JSON — attempt to recover gracefully with a structured fallback
      const out = coerceOutput({}, text);
      return res.status(200).json(out);
    }

    const out = coerceOutput(parsed, text);
    return res.status(200).json(out);
  } catch (err) {
    console.error('gemini error:', err);
    return res.status(500).json({ error: 'AI error' });
  }
}
