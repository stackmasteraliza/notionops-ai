---
title: "NotionOps AI — 4 AI Agents That Run Your Dev Workflow End-to-End"
published: true
tags: ["notionmcpchallenge", "notion", "ai", "typescript"]
---

*This is a submission for the [Notion MCP Challenge](https://dev.to/challenges/notion-2026-03-04)*

## What I Built

**NotionOps AI** is an autonomous workflow engine that connects GitHub, OpenAI, and Notion into a single pipeline for software development teams.

It runs **4 specialized AI agents** that automate the daily dev lifecycle:

| Agent | What it does |
|-------|-------------|
| **Issue Triage** | Fetches open GitHub issues, classifies priority & type with AI, creates Notion tasks |
| **PR Review** | Reviews PR diffs, scores code quality 1-10, posts GitHub comments, creates Notion approval gates |
| **Sprint Planner** | Selects top tasks from backlog, estimates story points with AI, populates Notion sprint board |
| **Daily Report** | Aggregates sprint metrics, generates standup summary, saves report to Notion |

The agents chain together into a full pipeline:

```
GitHub Issues/PRs → OpenAI Agents → Human Review in Notion → Notion Databases
```

The dashboard provides real-time SSE streaming of agent activity, live stat cards, a kanban sprint board, and a full pipeline visualization.

**Key design decision**: The PR Review agent creates **human-in-the-loop approval gates** in Notion when it finds low-quality PRs (score < 6). AI never takes destructive action without human sign-off.

### Screenshots

**Dashboard**
![Dashboard](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y598k0bj55joeb7y84ho.png)

**Pipeline Running**
![Pipeline Running](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/llpw7wi0rqazw3fwq76u.png)

**AI Agent Output**
![AI Output](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dzbuejofzeb8u01a3hwl.png)

| Tasks View | Sprint Board | Reports |
|------------|-------------|---------|
| ![Tasks](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y718486i2ng6mfkox36o.png) | ![Sprint](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vbboeyy5yuue6ado38v0.png) | ![Reports](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tlio4cugl0r9btgr0f1j.png) |

**Notion Integration**

| Tasks Database | Sprint Board | Agent Reports |
|---------------|-------------|---------------|
| ![Notion Tasks](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7ng35ye51mm9fny9hyx5.png) | ![Notion Sprint](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oq3iq127a414as4g7nx4.png) | ![Notion Reports](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qo0v9gx7gob6tl329p5v.png) |

## Video Demo

{% embed https://youtu.be/_Ksiqn_yz4s %}

## Show us the code

{% github stackmasteraliza/notionops-ai %}

## How I Used Notion MCP

Notion is the **central coordination layer** between AI agents and humans. Four databases drive the entire workflow:

**1. Tasks Database**
AI-triaged GitHub issues land here with structured metadata (priority, type, status, agent notes, GitHub URL). This is the single source of truth — the Sprint Planner reads from it, and humans can override AI classifications directly in Notion.

**2. Approvals Database**
When the PR Review agent finds a problematic PR, it creates an approval page with its recommendation. Team members review and approve/reject directly in Notion. This is the human-in-the-loop gate — downstream agents respect these decisions.

**3. Sprint Database**
The Sprint Planner reads pending tasks from Notion, uses AI to estimate complexity and assign Fibonacci story points, then writes selected tasks back with Backlog/In Progress/Done status tracking. The dashboard renders this as a live kanban board.

**4. Reports Database**
Daily standup summaries are generated from sprint data and stored as rich-text report pages. This creates an automatic paper trail of team velocity and AI-generated insights over time.

The key unlock: **agents write structured data into Notion, humans make decisions in a familiar interface, and downstream agents read those decisions to continue the workflow.** No context switching between GitHub, AI tools, and project management — it all flows through Notion.

### Tech Stack

- **Runtime**: Node.js + TypeScript
- **AI**: OpenAI via OpenRouter (structured JSON outputs)
- **APIs**: Notion API, GitHub REST API (Octokit)
- **Server**: Express.js with Server-Sent Events
- **Frontend**: Vanilla HTML/CSS/JS (zero framework dependencies)

---

## About Me

I'm **Aliza Ali** — a developer who loves building AI-powered tools that solve real workflow problems. If you liked this project, check out my other challenge submission:

**[FixForward: One Command to Go from Broken Build to Ready-to-Merge PR](https://github.com/stackmasteraliza/fixforward)** — A CLI autopilot that detects failing tests, classifies bugs, generates fixes via GitHub Copilot CLI, and creates verified PRs. One command. Three ecosystems. Zero manual patching.

Want to know more? Visit [alizaali.com](https://alizaali.com)
