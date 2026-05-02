const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_KEY = 'sk-ab1bedbd0c1d4b4fa5eadd9316b408f3';
const MODEL = 'deepseek-chat';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function deepseekChat(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function generateText(prompt: string): Promise<string> {
  return deepseekChat([{ role: 'user', content: prompt }]);
}

export async function chatCompletion(messages: { role: string; content: string }[]): Promise<string> {
  const msgs: ChatMessage[] = messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));
  return deepseekChat(msgs);
}

export async function suggestMusic(context: string): Promise<string[]> {
  const prompt = `Based on this context/vibe: "${context}", suggest 5 real song names by real artists. Return ONLY the song names, one per line. No numbers, no quotes, no explanations.`;
  const text = await generateText(prompt);
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('Here') && !s.startsWith('Sure') && !s.startsWith('1.'))
    .slice(0, 5);
}
