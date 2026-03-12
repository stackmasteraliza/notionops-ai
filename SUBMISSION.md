---
title: "NotionOps AI — 4 AI Agents That Run Your Dev Workflow End-to-End"
published: true
tags: ["notionmcpchallenge", "notion", "ai", "typescript"]
---

*This is a submission for the [Notion MCP Challenge](https://dev.to/challenges/notion-2026-03-04)*

## What I Built

**NotionOps AI** is an autonomous workflow engine that connects GitHub, Google Gemini AI, and Notion into a single pipeline for software development teams.

It runs **4 specialized AI agents** that automate the daily dev lifecycle:

| Agent | What it does |
|-------|-------------|
| **Issue Triage** | Fetches open GitHub issues, classifies priority & type with Gemini, creates Notion tasks |
| **PR Review** | Reviews PR diffs, scores code quality 1-10, posts GitHub comments, creates Notion approval gates |
| **Sprint Planner** | Selects top tasks from backlog, estimates story points with AI, populates Notion sprint board |
| **Daily Report** | Aggregates sprint metrics, generates standup summary, saves report to Notion |

The agents chain together into a full pipeline:

```
GitHub Issues/PRs → Gemini AI Agents → Human Review in Notion → Notion Databases
```

The dashboard provides real-time SSE streaming of agent activity, live stat cards, a kanban sprint board, and a full pipeline visualization.

**Key design decision**: The PR Review agent creates **human-in-the-loop approval gates** in Notion when it finds low-quality PRs (score < 6). AI never takes destructive action without human sign-off.

## Video Demo

<!-- REPLACE with your video link (Loom, YouTube, etc.) -->
[VIDEO_LINK_HERE]

## Show us the code

<!-- REPLACE with your GitHub repo -->
{% github YOUR_USERNAME/YOUR_REPO %}

## How I Used Notion MCP

Notion is the **central coordination layer** between AI agents and humans. Four databases drive the entire workflow:

**1. Tasks Database**
AI-triaged GitHub issues land here with structured metadata (priority, type, status, agent notes, GitHub URL). This is the single source of truth — the Sprint Planner reads from it, and humans can override AI classifications directly in Notion.

**2. Approvals Database**
When the PR Review agent finds a problematic PR, it creates an approval page with its recommendation. Team members review and approve/reject directly in Notion. This is the human-in-the-loop gate — downstream agents respect these decisions.

**3. Sprint Database**
The Sprint Planner reads pending tasks from Notion, uses Gemini to estimate complexity and assign Fibonacci story points, then writes selected tasks back with Backlog/In Progress/Done status tracking. The dashboard renders this as a live kanban board.

**4. Reports Database**
Daily standup summaries are generated from sprint data and stored as rich-text report pages. This creates an automatic paper trail of team velocity and AI-generated insights over time.

The key unlock: **agents write structured data into Notion, humans make decisions in a familiar interface, and downstream agents read those decisions to continue the workflow.** No context switching between GitHub, AI tools, and project management — it all flows through Notion.

### Tech Stack

- **Runtime**: Node.js + TypeScript
- **AI**: Google Gemini 1.5 Flash
- **APIs**: Notion API, GitHub REST API (Octokit)
- **Server**: Express.js with Server-Sent Events
- **Frontend**: Vanilla HTML/CSS/JS (zero framework dependencies)
