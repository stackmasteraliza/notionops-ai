import { runAgent } from '../lib/gemini';
import { createTask, createReport } from '../lib/notion';
import { getOpenIssues } from '../lib/github';
import { emitLog } from '../lib/events';
import { config } from '../lib/config';

const AGENT = 'IssueTriage';

export async function runIssueTriageAgent() {
  emitLog(AGENT, 'Fetching open GitHub issues...', 'info');
  const issues = await getOpenIssues();

  if (issues.length === 0) {
    emitLog(AGENT, 'No open issues found.', 'warn');
    return;
  }

  emitLog(AGENT, `Found ${issues.length} issues — sending to Gemini AI for analysis...`, 'info');

  const issuesSummary = issues.map(i =>
    `#${i.number}: ${i.title}\nBody: ${(i.body || '').slice(0, 300)}\nLabels: ${i.labels.map((l: any) => l.name).join(', ')}`
  ).join('\n\n---\n\n');

  const analysis = await runAgent({
    systemPrompt: `You are a senior software engineer triaging GitHub issues.
For each issue, determine:
1. Type: Bug, Feature, Issue, or PR Review
2. Priority: High, Medium, or Low
3. A brief agent note (1-2 sentences) about what needs to be done

Respond in this exact JSON format:
[{"number": 1, "title": "...", "type": "Bug|Feature|Issue", "priority": "High|Medium|Low", "note": "..."}]`,
    userMessage: `Triage these GitHub issues:\n\n${issuesSummary}`,
  });

  emitLog(AGENT, 'Gemini AI analysis complete — parsing results...', 'ai', { preview: analysis.slice(0, 120) });

  let triaged: any[] = [];
  try {
    const jsonMatch = analysis.match(/\[[\s\S]*\]/);
    if (jsonMatch) triaged = JSON.parse(jsonMatch[0]);
  } catch {
    emitLog(AGENT, 'Failed to parse analysis JSON', 'error');
    return;
  }

  const repoUrl = `https://github.com/${config.github.owner}/${config.github.repo}`;
  let reportLines: string[] = [`Issue Triage Report - ${new Date().toISOString()}\n`];

  for (const item of triaged) {
    const issue = issues.find(i => i.number === item.number);
    if (!issue) continue;

    await createTask({
      title: `[Issue #${issue.number}] ${issue.title}`,
      type: item.type,
      priority: item.priority,
      githubUrl: `${repoUrl}/issues/${issue.number}`,
      agentNotes: item.note,
      status: 'Pending',
    });

    reportLines.push(`✓ #${issue.number} → ${item.type} | ${item.priority} priority`);
    reportLines.push(`  Note: ${item.note}`);
    emitLog(AGENT, `Created Notion task → Issue #${issue.number} [${item.priority} ${item.type}]`, 'success');
  }

  await createReport(
    `Issue Triage - ${new Date().toLocaleDateString()}`,
    reportLines.join('\n')
  );

  emitLog(AGENT, `Done — ${triaged.length} tasks created in Notion`, 'success', { count: triaged.length });
}
