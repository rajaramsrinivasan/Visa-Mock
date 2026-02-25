export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, type } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const SYSTEM_INTERVIEW = `You are a strict US Consulate Officer conducting a B1/B2 visa interview.
- Ask ONE question per turn (one sentence only).
- Start with: "Good morning. Please state your full name and the purpose of your visit to the United States."
- Cover in 7-9 questions: purpose, duration, funding, employment at home, family ties, travel history, accommodation, return plans.
- Probe if answers are vague or inconsistent.
- Remain neutral and professional. No warmth.
- After 7-9 questions say exactly: "INTERVIEW_COMPLETE Thank you for your time. Please wait while we process your application."`;

  const SYSTEM_FEEDBACK = `You are a senior US visa consultant. Analyse the transcript and return ONLY valid JSON (no markdown):
{"verdict":"LIKELY APPROVED","score":78,"summary":"Two sentences.","strengths":["s1","s2"],"weaknesses":["w1","w2"],"tips":["t1","t2","t3"],"risk_factors":["r1"]}
verdict must be exactly: "LIKELY APPROVED", "BORDERLINE", or "LIKELY REFUSED". Be honest and specific.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: type === 'feedback' ? 1200 : 350,
        system: type === 'feedback' ? SYSTEM_FEEDBACK : SYSTEM_INTERVIEW,
        messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ text: data.content?.[0]?.text || '' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
