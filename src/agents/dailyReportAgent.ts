import { runAgent } from '../lib/gemini';
import { createReport, notion } from '../lib/notion';
import { emitLog } from '../lib/events';
import { config } from '../lib/config';

const AGENT = 'DailyReport';

async function getAllTasks() {
  const r = await notion.databases.query({ database_id: config.notion.databases.tasks });
  return r.results;
}
async function getSprintTasks() {
  const r = await notion.databases.query({ database_id: config.notion.databases.sprint });
  return r.results;
}
async function getPendingApprovals() {
  const r = await notion.databases.query({
    database_id: config.notion.databases.approvals,
    filter: { property: 'Status', select: { equals: 'Waiting' } },
  });
  return r.results;
}

export async function runDailyReportAgent() {
  emitLog(AGENT, 'Collecting metrics from all Notion databases...', 'info');

  const [allTasks, sprintTasks, pendingApprovals] = await Promise.all([
    getAllTasks(),
    getSprintTasks(),
    getPendingApprovals(),
  ]);

  emitLog(AGENT, `Loaded ${allTasks.length} tasks · ${sprintTasks.length} sprint items · ${pendingApprovals.length} pending approvals`, 'info');

  const tasksByStatus = allTasks.reduce((acc: Record<string, number>, t: any) => {
    const status = t.properties?.Status?.select?.name || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const sprintByStatus = sprintTasks.reduce((acc: Record<string, number>, t: any) => {
    const status = t.properties?.Status?.select?.name || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const totalSprintPoints = sprintTasks.reduce((sum: number, t: any) => sum + (t.properties?.Estimate?.number || 0), 0);
  const donePoints = sprintTasks
    .filter((t: any) => t.properties?.Status?.select?.name === 'Done')
    .reduce((sum: number, t: any) => sum + (t.properties?.Estimate?.number || 0), 0);

  const velocity = totalSprintPoints > 0 ? Math.round((donePoints / totalSprintPoints) * 100) : 0;

  emitLog(AGENT, `Sprint velocity: ${donePoints}/${totalSprintPoints} pts (${velocity}%) — generating AI standup...`, 'info');

  const summary = `
Tasks Overview: ${JSON.stringify(tasksByStatus)}
Sprint Progress: ${JSON.stringify(sprintByStatus)}
Sprint Velocity: ${donePoints}/${totalSprintPoints} story points completed (${velocity}%)
Pending Human Approvals: ${pendingApprovals.length}
`;

  const report = await runAgent({
    systemPrompt: `You are a project manager writing a daily standup report.
Write a concise, professional daily report based on the metrics provided.
Include: what was accomplished, what's in progress, blockers, and action items.
Keep it under 200 words.`,
    userMessage: `Generate today's daily report from these metrics:\n${summary}`,
  });

  emitLog(AGENT, 'AI standup summary generated — saving to Notion...', 'ai', { preview: report.slice(0, 120) });

  const fullReport = `=== DAILY REPORT - ${new Date().toLocaleDateString()} ===\n\n${report}\n\n--- Raw Metrics ---\n${summary}`;
  await createReport(`Daily Report - ${new Date().toLocaleDateString()}`, fullReport);

  emitLog(AGENT, 'Daily report saved to Notion', 'success', { velocity, pendingApprovals: pendingApprovals.length });
}
