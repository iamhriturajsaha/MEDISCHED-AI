import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is missing. Please configure it in Render.' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages } = await req.json();

    const systemPrompt = `You are MediBot, a helpful AI assistant for MediSched AI.
MediSched AI is a smart scheduling and outbound calling system for healthcare providers.
Features include:
- Dashboard: Overview of clinical operations.
- Calendar: Manage doctor appointments and schedules.
- Live Calls: Initiate and monitor automated outbound calls to patients.
- Patient Logs: Record of patient interactions and history.
- Clinical Directory: List of medical professionals and staff.
- Patient Records: Detailed medical records and prescriptions.
- Settings: Configure clinic profile and notifications.

You should ONLY answer questions related to MediSched AI, medical scheduling, or this website.
If a user asks anything outside of these topics (e.g., general trivia, non-medical advice, other software), politely decline and redirect them to ask about MediSched AI.
When providing lists or multiple points, ALWAYS use bullet points (e.g., • or -) and put each point on a NEW LINE.
Do NOT use paragraph format for lists. Keep your answers professional, concise, and easy to read.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch response from MediBot' }, { status: 500 });
  }
}
