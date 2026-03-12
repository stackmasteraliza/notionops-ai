import { runAgent } from '../lib/gemini';
import { getPendingTasks, addToSprint, createReport } from '../lib/notion';
import { emitLog } from '../lib/events';

const AGENT = 'SprintPlanner';

export async function runSprintPlannerAgent() {
  emitLog(AGENT, 'Fetching pending tasks from Notion...', 'info');
  const tasks = await getPendingTasks();

  if (tasks.length === 0) {
    emitLog(AGENT, 'No pending tasks to plan.', 'warn');
    return;
  }

  emitLog(AGENT, `${tasks.length} pending tasks — asking AI to plan the sprint...`, 'info');

  const tasksSummary = tasks.map((t: any) => {
    const props = t.properties;
    const title = props.Title?.title?.[0]?.text?.content || 'Untitled';
    const type = props.Type?.select?.name || 'Unknown';
    const priority = props.Priority?.select?.name || 'Medium';
    const notes = props['Agent Notes']?.rich_text?.[0]?.text?.content || '';
    return `- ${title} [${type}] [${priority}]\n  Notes: ${notes}`;
  }).join('\n');

  const plan = await runAgent({
    systemPrompt: `You are a scrum master planning a 2-week sprint.
Given a list of tasks, select the most important ones for the sprint (max 6 tasks) and estimate story points (1, 2, 3, 5, or 8).
Prioritize High priority bugs first, then features, then improvements.

Respond as JSON:
{"sprint_goal": "...", "tasks": [{"title": "...", "estimate": 3, "reason": "..."}], "deferred": ["task titles deferred to next sprint"]}`,
    userMessage: `Plan a sprint from these pending tasks:\n\n${tasksSummary}`,
  });

  let sprintData: any = {};
  try {
    const jsonMatch = plan.match(/\{[\s\S]*\}/);
    if (jsonMatch) sprintData = JSON.parse(jsonMatch[0]);
  } catch {
    emitLog(AGENT, 'Failed to parse sprint plan JSON', 'error');
    return;
  }

  emitLog(AGENT, `AI sprint goal: "${sprintData.sprint_goal}"`, 'ai', {
    taskCount: sprintData.tasks?.length,
    deferred: sprintData.deferred?.length,
    preview: sprintData.sprint_goal,
  });

  const reportLines: string[] = [
    `Sprint Plan - ${new Date().toLocaleDateString()}`,
    `Goal: ${sprintData.sprint_goal || 'Improve system quality'}`,
    '',
    'Selected Tasks:',
  ];

  for (const task of (sprintData.tasks || [])) {
    await addToSprint({ title: task.title, estimate: task.estimate });
    reportLines.push(`  ✓ ${task.title} (${task.estimate} pts) - ${task.reason}`);
    emitLog(AGENT, `Sprint → "${task.title}" (${task.estimate} story points)`, 'success');
  }

  if (sprintData.deferred?.length > 0) {
    reportLines.push('', 'Deferred to next sprint:');
    sprintData.deferred.forEach((t: string) => reportLines.push(`  - ${t}`));
    emitLog(AGENT, `Deferred ${sprintData.deferred.length} tasks to next sprint`, 'info');
  }

  const totalPoints = (sprintData.tasks || []).reduce((sum: number, t: any) => sum + (t.estimate || 0), 0);
  reportLines.push('', `Total story points: ${totalPoints}`);

  await createReport(`Sprint Plan - ${new Date().toLocaleDateString()}`, reportLines.join('\n'));

  emitLog(AGENT, `Done — ${(sprintData.tasks || []).length} tasks planned, ${totalPoints} story points total`, 'success', {
    tasks: sprintData.tasks?.length,
    points: totalPoints,
  });
}
