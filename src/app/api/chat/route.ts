import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import portfolioData from '@/data/portfolio.json';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // Log the incoming request (don't log secrets)
  try {
    console.log('api/chat POST received', { ts: Date.now(), promptPreview: String(prompt).slice(0, 200) });
  } catch (e) {
    /* ignore logging errors */
  }

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

  try {
    // Log which model we intend to use for debugging speed differences
    console.log('api:using-model', 'gemini-1.5-flash');
    console.time('api:streamText');
    const result = streamText({
      // Use a fast "flash" model for low-latency chat responses
      model: google('gemini-1.5-flash'),
      system: `
      IDENTITY: You are Adrian's AI Portfolio Assistant.
      TONE: Professional, tech-savvy, and helpful.
      KNOWLEDGE: You know Adrian's portfolio and projects, including Astra Link (Agentic Supply Chain Optimization) and Quantum UI (Generative Design System). You are familiar with Adrian's expertise in React, Next.js, and Ubuntu.

      BEHAVIOR:
      - When a visitor says "Hello": Acknowledge that they are visiting Adrian's portfolio, and offer to explain the 3D scene or the AI tech powering the site (streaming model, agent integration). Do not reply with a bare "hi".
      - Use concise, actionable responses suitable for a chat UI. Keep answers short (aim under 150 words).
      - For technical experience questions, prefer the STAR method (Situation, Task, Action, Result) when applicable.
      - For unknown information, reply: "Adrian hasn't shared that yet. Contact him via GitHub/LinkedIn."

      GROUNDING_DATA:
      ${JSON.stringify(portfolioData)}

      PROTOCOL:
      - Respond using the provided portfolio data where possible.
      - Keep responses concise and focused for quick reading in the chat UI.
    `,
    prompt,
      // lower temperature for concise, deterministic responses
      temperature: 0.2,
    });

    // End timing for stream init
    console.timeEnd('api:streamText');
    // Return the SDK's streaming response (compatible with Next.js App Router)
    return result.toTextStreamResponse();
  } catch (err: any) {
    // Fail with a clear JSON error for easier debugging from the client
    const message = err?.message || String(err) || 'Unknown server error when initializing AI model';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
