import dotenv from 'dotenv';
dotenv.config();

export const config = {
  notion: {
    apiKey: process.env.NOTION_API_KEY || '',
    clientId: process.env.NOTION_CLIENT_ID || '',
    clientSecret: process.env.NOTION_CLIENT_SECRET || '',
    redirectUri: process.env.NOTION_REDIRECT_URI || '',
    databases: {
      tasks: process.env.NOTION_TASKS_DB_ID || '',
      approvals: process.env.NOTION_APPROVALS_DB_ID || '',
      sprint: process.env.NOTION_SPRINT_DB_ID || '',
      reports: process.env.NOTION_REPORTS_DB_ID || '',
    },
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
  },
  github: {
    token: process.env.GITHUB_TOKEN || '',
    owner: process.env.GITHUB_REPO_OWNER || '',
    repo: process.env.GITHUB_REPO_NAME || '',
  },
};
