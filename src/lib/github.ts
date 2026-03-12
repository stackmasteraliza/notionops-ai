import { Octokit } from '@octokit/rest';
import { config } from './config';

const octokit = new Octokit({ auth: config.github.token });

export async function getOpenIssues() {
  const { data } = await octokit.issues.listForRepo({
    owner: config.github.owner,
    repo: config.github.repo,
    state: 'open',
    per_page: 10,
  });
  return data.filter(i => !i.pull_request);
}

export async function getOpenPRs() {
  const { data } = await octokit.pulls.list({
    owner: config.github.owner,
    repo: config.github.repo,
    state: 'open',
    per_page: 10,
  });
  return data;
}

export async function getPRFiles(prNumber: number) {
  const { data } = await octokit.pulls.listFiles({
    owner: config.github.owner,
    repo: config.github.repo,
    pull_number: prNumber,
  });
  return data;
}

export async function addIssueComment(issueNumber: number, body: string) {
  return octokit.issues.createComment({
    owner: config.github.owner,
    repo: config.github.repo,
    issue_number: issueNumber,
    body,
  });
}

export async function addPRReviewComment(prNumber: number, body: string) {
  return octokit.pulls.createReview({
    owner: config.github.owner,
    repo: config.github.repo,
    pull_number: prNumber,
    body,
    event: 'COMMENT',
  });
}
