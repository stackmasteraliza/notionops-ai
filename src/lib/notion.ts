import { Client } from '@notionhq/client';
import { config } from './config';

export const notion = new Client({ auth: config.notion.apiKey });

export async function createTask(params: {
  title: string;
  type: string;
  priority: string;
  githubUrl?: string;
  agentNotes?: string;
  status?: string;
}) {
  return notion.pages.create({
    parent: { database_id: config.notion.databases.tasks },
    properties: {
      Title: { title: [{ text: { content: params.title } }] },
      Status: { select: { name: params.status || 'Pending' } },
      Type: { select: { name: params.type } },
      Priority: { select: { name: params.priority } },
      ...(params.githubUrl && { 'GitHub URL': { url: params.githubUrl } }),
      ...(params.agentNotes && { 'Agent Notes': { rich_text: [{ text: { content: params.agentNotes } }] } }),
    },
  });
}

export async function updateTask(pageId: string, updates: Record<string, any>) {
  return notion.pages.update({ page_id: pageId, properties: updates });
}

export async function getPendingTasks() {
  const response = await notion.databases.query({
    database_id: config.notion.databases.tasks,
    filter: { property: 'Status', select: { equals: 'Pending' } },
  });
  return response.results;
}

export async function createApproval(params: {
  title: string;
  recommendation: string;
  taskPageId: string;
}) {
  return notion.pages.create({
    parent: { database_id: config.notion.databases.approvals },
    properties: {
      Title: { title: [{ text: { content: params.title } }] },
      Status: { select: { name: 'Waiting' } },
      'Agent Recommendation': { rich_text: [{ text: { content: params.recommendation } }] },
    },
  });
}

export async function checkApprovalStatus(pageId: string): Promise<string> {
  const page = await notion.pages.retrieve({ page_id: pageId }) as any;
  return page.properties['Status']?.select?.name || 'Waiting';
}

export async function addToSprint(params: { title: string; estimate: number }) {
  return notion.pages.create({
    parent: { database_id: config.notion.databases.sprint },
    properties: {
      Title: { title: [{ text: { content: params.title } }] },
      Status: { select: { name: 'Backlog' } },
      Estimate: { number: params.estimate },
    },
  });
}

export async function createReport(title: string, report: string) {
  return notion.pages.create({
    parent: { database_id: config.notion.databases.reports },
    properties: {
      Title: { title: [{ text: { content: title } }] },
      Report: { rich_text: [{ text: { content: report } }] },
    },
  });
}

export async function appendToPage(pageId: string, content: string) {
  return notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content } }],
        },
      },
    ],
  });
}
