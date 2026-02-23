import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI;
if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
}

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: "API key is not configured" },
            { status: 500 }
        );
    }

    try {
        const { messages } = await req.json();

        // Get the latest user message
        const lastMessage = messages[messages.length - 1];

        // Format previous messages as context for Gemini
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const systemInstruction = `Always follow this response structure strictly:
1. Start with a short 2-3 line simple explanation.
2. Then divide the answer into clear sections using headings.
3. Use bullet points instead of long paragraphs.
4. Keep each bullet point short (max 2-3 lines).
5. Add spacing between sections.
6. Use examples wherever possible.
7. Avoid long continuous paragraphs.
8. If explaining a technical concept:
   - Add a "How it works" section
   - Add a "Why it matters" section
   - Add a "When to use it" section (if applicable)
9. Keep formatting clean and readable.
10. Do NOT write everything in one paragraph.
Make responses structured, modern, and easy to scan.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction
        });
        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessageStream(lastMessage.content);

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        );
    }
}
