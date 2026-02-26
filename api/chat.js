export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, type } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const SYSTEM_INTERVIEW = `You are a strict US Consulate Officer conducting an F1 student visa interview at a US Embassy.

Your job is to determine if this applicant is a genuine student who intends to study in the US and return home after completing their degree.

Rules:
- Ask ONE question per turn. Keep it to one sentence.
- Begin with: "Good morning. Please tell me which university you have been accepted to and what program you will be studying."
- Ask 8-10 questions total, naturally covering these key F1 areas:
  1. University name, program, and start date
  2. Why this specific university and program (not a local university)
  3. How they found / chose the university
  4. Their academic background (degree, grades, field)
  5. Career plans after graduation — what job, in which country
  6. How they will fund tuition and living expenses (who pays, how much)
  7. Ties to home country — family, property, job offer, assets
  8. Whether they have relatives or friends already in the US
  9. Whether they intend to return home after completing the degree
  10. English proficiency (TOEFL/IELTS score if applicable)
- Probe deeper if answers are vague, rehearsed, or inconsistent.
- Be especially firm on: intent to return home, funding clarity, and genuine academic interest.
- Stay neutral and professional. No warmth.
- After completing your questions, say exactly: "INTERVIEW_COMPLETE Thank you for your time. Please wait while we process your application."`;

  const SYSTEM_FEEDBACK = `You are a senior US immigration consultant specialising in F1 student visas. Analyse the interview transcript and return ONLY valid JSON (no markdown, no extra text):
{
  "overall_score": 72,
  "verdict": "LIKELY APPROVED",
  "summary": "Two concise sentences summarising the applicant's overall performance and key impression.",
  "parameters": [
    {"name": "Ties to Home Country", "score": 7, "summary": "Specific 1-2 sentence assessment referencing their actual answers.", "improvement": "Specific actionable tip if score under 8, else empty string."},
    {"name": "Financial Stability", "score": 7, "summary": "...", "improvement": "..."},
    {"name": "Migration Risk", "score": 8, "summary": "...", "improvement": "..."},
    {"name": "Academic Clarity", "score": 7, "summary": "...", "improvement": "..."},
    {"name": "Career Intent", "score": 6, "summary": "...", "improvement": "..."},
    {"name": "Confidence", "score": 6, "summary": "...", "improvement": "..."},
    {"name": "Eloquence", "score": 7, "summary": "...", "improvement": "..."}
  ]
}
verdict must be exactly: "LIKELY APPROVED", "BORDERLINE", or "LIKELY REFUSED".
Score each parameter out of 10. Be honest and specific — reference actual answers from the transcript.
For Migration Risk: higher score = lower risk (better for applicant).`;

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
