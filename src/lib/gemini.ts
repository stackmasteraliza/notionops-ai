import { GoogleGenerativeAI, FunctionDeclaration, Tool } from '@google/generative-ai';
import { config } from './config';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export async function runAgent(params: {
  systemPrompt: string;
  userMessage: string;
  tools?: Tool[];
}): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: params.systemPrompt,
    tools: params.tools,
  });

  const result = await model.generateContent(params.userMessage);
  const response = result.response;
  return response.text();
}

export async function runAgentWithTools(params: {
  systemPrompt: string;
  userMessage: string;
  tools: Tool[];
  toolHandler: (name: string, args: any) => Promise<any>;
}): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: params.systemPrompt,
    tools: params.tools,
  });

  const chat = model.startChat();
  let response = await chat.sendMessage(params.userMessage);

  // Agentic loop: handle tool calls
  while (true) {
    const candidate = response.response.candidates?.[0];
    if (!candidate) break;

    const toolCalls = candidate.content.parts.filter(p => p.functionCall);
    if (toolCalls.length === 0) break;

    const toolResults = await Promise.all(
      toolCalls.map(async part => {
        const call = part.functionCall!;
        const result = await params.toolHandler(call.name, call.args);
        return {
          functionResponse: {
            name: call.name,
            response: { result },
          },
        };
      })
    );

    response = await chat.sendMessage(toolResults as any);
  }

  return response.response.text();
}
