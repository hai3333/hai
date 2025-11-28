import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const tone = url.searchParams.get('tone') || 'romantic';
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      return Response.json({ message: 'You are the spark in my life.', mood: 'Classic' }, { status: 200 });
    }
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, poetic, and ${tone} love message (max 20 words).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            mood: { type: Type.STRING }
          },
          required: ['message', 'mood']
        }
      }
    });
    const text = (response as any).text;
    if (!text) return Response.json({ message: 'Love lights up the darkest sky.', mood: 'Timeless' }, { status: 200 });
    return new Response(text, { headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return Response.json({ message: 'You are the spark in my life.', mood: 'Classic' }, { status: 200 });
  }
}
