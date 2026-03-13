import { OpenRouter } from '@openrouter/sdk';
import { config } from './config';

const openrouter = new OpenRouter({
  apiKey: config.openrouter.apiKey,
});

export async function runAgent(params: {
  systemPrompt: string;
  userMessage: string;
  tools?: any[];
}): Promise<string> {
  const result = await openrouter.chat.send({
    chatGenerationParams: {
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: params.systemPrompt },
        { role: 'user', content: params.userMessage },
      ],
      stream: false,
    },
  });

  return result.choices?.[0]?.message?.content || '';
}

export async function runAgentWithTools(params: {
  systemPrompt: string;
  userMessage: string;
  tools: any[];
  toolHandler: (name: string, args: any) => Promise<any>;
}): Promise<string> {
  const messages: any[] = [
    { role: 'system', content: params.systemPrompt },
    { role: 'user', content: params.userMessage },
  ];

  while (true) {
    const result = await openrouter.chat.send({
      chatGenerationParams: {
        model: 'google/gemini-2.0-flash-001',
        messages,
        stream: false,
      },
    });

    const choice = result.choices?.[0];
    if (!choice) break;

    const msg = choice.message;
    messages.push(msg);

    if (!msg.toolCalls || msg.toolCalls.length === 0) {
      return msg.content || '';
    }

    const toolResults = await Promise.all(
      msg.toolCalls.map(async (tc: any) => {
        const fnResult = await params.toolHandler(tc.function.name, JSON.parse(tc.function.arguments));
        return {
          role: 'tool' as const,
          toolCallId: tc.id,
          content: JSON.stringify(fnResult),
        };
      })
    );

    messages.push(...toolResults);
  }

  return '';
}
