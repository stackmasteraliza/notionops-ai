import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { config } from './lib/config';
import { notion } from './lib/notion';
import { dashboardHTML, callbackHTML } from './dashboard';
import { agentEmitter } from './lib/events';
import { runIssueTriageAgent } from './agents/issueTriageAgent';
import { runPRReviewAgent } from './agents/prReviewAgent';
import { runSprintPlannerAgent } from './agents/sprintPlannerAgent';
import { runDailyReportAgent } from './agents/dailyReportAgent';

const app = express();
app.use(express.json());

// Dashboard
app.get('/', (_req, res) => {
  res.send(dashboardHTML);
});

// ── SSE: real-time agent log stream ──────────────────────────────────────────
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Heartbeat every 15s so connection stays alive
  const hb = setInterval(() => res.write(': ping\n\n'), 15_000);

  const listener = (data: unknown) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  agentEmitter.on('log', listener);
  req.on('close', () => {
    clearInterval(hb);
    agentEmitter.off('log', listener);
  });
});

// Stats API
app.get('/api/stats', async (_req, res) => {
  try {
    const [tasks, approvals, sprint, reports] = await Promise.all([
      notion.databases.query({ database_id: config.notion.databases.tasks, page_size: 10 }),
      notion.databases.query({ database_id: config.notion.databases.approvals, filter: { property: 'Status', select: { equals: 'Waiting' } } }),
      notion.databases.query({ database_id: config.notion.databases.sprint }),
      notion.databases.query({ database_id: config.notion.databases.reports }),
    ]);

    const recentTasks = tasks.results.slice(0, 5).map((t: any) => ({
      title: t.properties?.Title?.title?.[0]?.text?.content || 'Untitled',
      status: t.properties?.Status?.select?.name || '',
      type: t.properties?.Type?.select?.name || '',
      priority: t.properties?.Priority?.select?.name || '',
    }));

    res.json({
      tasks: tasks.results.length,
      approvals: approvals.results.length,
      sprint: sprint.results.length,
      reports: reports.results.length,
      recentTasks,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// OAuth callback
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

  try {
    const encoded = Buffer.from(`${config.notion.clientId}:${config.notion.clientSecret}`).toString('base64');
    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: { Authorization: `Basic ${encoded}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'authorization_code', code, redirect_uri: config.notion.redirectUri }),
    });
    const data = await response.json() as any;
    if (data.access_token) {
      console.log(`\n✅ NOTION_API_KEY=${data.access_token}\n`);
      res.send(callbackHTML(data.access_token));
    } else {
      res.status(400).send(`OAuth failed: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    res.status(500).send(`Error: ${err}`);
  }
});

// Agent endpoints
app.post('/run/triage', (_req, res) => {
  res.json({ status: 'started', agent: 'IssueTriageAgent' });
  runIssueTriageAgent().catch(console.error);
});

app.post('/run/pr-review', (_req, res) => {
  res.json({ status: 'started', agent: 'PRReviewAgent' });
  runPRReviewAgent().catch(console.error);
});

app.post('/run/sprint-plan', (_req, res) => {
  res.json({ status: 'started', agent: 'SprintPlannerAgent' });
  runSprintPlannerAgent().catch(console.error);
});

app.post('/run/daily-report', (_req, res) => {
  res.json({ status: 'started', agent: 'DailyReportAgent' });
  runDailyReportAgent().catch(console.error);
});

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

const PORT = 3000;

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === 'triage') return runIssueTriageAgent();
  if (args[0] === 'pr-review') return runPRReviewAgent();
  if (args[0] === 'sprint-plan') return runSprintPlannerAgent();
  if (args[0] === 'daily-report') return runDailyReportAgent();
  if (args[0] === 'run-all') {
    await runIssueTriageAgent();
    await runPRReviewAgent();
    await runSprintPlannerAgent();
    await runDailyReportAgent();
    return;
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Dashboard: http://localhost:${PORT}\n`);
  });
}

main().catch(console.error);
