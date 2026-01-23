import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import portfolioData from '@/data/portfolio.json';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // Fail fast if the server-side API key is not configured. This prevents
  // confusing downstream errors and avoids attempting requests with a
  // missing credential. Do NOT expose the key to the client.
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    return new Response(
      JSON.stringify({ error: 'Server configuration error: GOOGLE_GENERATIVE_AI_API_KEY is missing. Set it in project environment variables.' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }

  const result = streamText({
    model: google('gemini-3-flash-preview'),
    system: `
      ROLE: You are the "Adrian Agent", the official digital representative of ${portfolioData.name}. 
      TONE: Technical, concise, Neo-Brutalist (edgy but authoritative). 
      GROUNDING_DATA:
      ${JSON.stringify(portfolioData)}
      
      PROTOCOL:
      - Respond strictly using the provided portfolio data.
      - For unknown queries, state: "Adrian hasn't shared that yet. Contact him directly via GitHub/LinkedIn."
      - Use the STAR method (Situation, Task, Action, Result) for all technical experience queries.
      - Ensure output is optimized for zero-tier latency reading (under 150 words).
    `,
    prompt,
    temperature: 1.0,
  });

  return result.toTextStreamResponse();
}
