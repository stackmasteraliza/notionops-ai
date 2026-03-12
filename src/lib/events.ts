import { EventEmitter } from 'events';

export type LogType = 'info' | 'success' | 'error' | 'warn' | 'ai';

export interface AgentEvent {
  agent: string;
  msg: string;
  type: LogType;
  ts: string;
  data?: Record<string, unknown>;
}

class AgentEventEmitter extends EventEmitter {}
export const agentEmitter = new AgentEventEmitter();
agentEmitter.setMaxListeners(50);

export function emitLog(agent: string, msg: string, type: LogType = 'info', data?: Record<string, unknown>) {
  const event: AgentEvent = { agent, msg, type, ts: new Date().toISOString(), data };
  agentEmitter.emit('log', event);
  const prefix = { info: '›', success: '✓', error: '✗', warn: '⚠', ai: '🤖' }[type];
  console.log(`[${agent}] ${prefix} ${msg}`);
}
