import { runAgent } from '../lib/gemini';
import { createApproval, createTask } from '../lib/notion';
import { getOpenPRs, getPRFiles, addPRReviewComment } from '../lib/github';
import { emitLog } from '../lib/events';
import { config } from '../lib/config';

const AGENT = 'PRReview';

export async function runPRReviewAgent() {
  emitLog(AGENT, 'Fetching open pull requests from GitHub...', 'info');
  const prs = await getOpenPRs();

  if (prs.length === 0) {
    emitLog(AGENT, 'No open PRs found.', 'warn');
    return;
  }

  emitLog(AGENT, `Found ${prs.length} PRs — starting AI code review...`, 'info');
  const repoUrl = `https://github.com/${config.github.owner}/${config.github.repo}`;

  for (const pr of prs) {
    emitLog(AGENT, `Reviewing PR #${pr.number}: "${pr.title}"`, 'info');

    const files = await getPRFiles(pr.number);
    emitLog(AGENT, `Loaded ${files.length} changed files — sending to Gemini AI...`, 'info');

    const filesSummary = files.map(f =>
      `File: ${f.filename}\nChanges: +${f.additions} -${f.deletions}\nPatch:\n${(f.patch || '').slice(0, 500)}`
    ).join('\n\n---\n\n');

    const review = await runAgent({
      systemPrompt: `You are an expert code reviewer. Review the pull request changes and provide:
1. A quality score (1-10)
2. Summary of what the PR does
3. Key concerns or issues (if any)
4. Recommendation: APPROVE, REQUEST_CHANGES, or NEEDS_HUMAN_REVIEW
5. A comment to post on the PR

Be concise and constructive. Format your response as JSON:
{"score": 8, "summary": "...", "concerns": ["..."], "recommendation": "APPROVE|REQUEST_CHANGES|NEEDS_HUMAN_REVIEW", "comment": "..."}`,
      userMessage: `Review PR #${pr.number}: "${pr.title}"\n\nDescription: ${pr.body || 'No description'}\n\nChanged files:\n${filesSummary}`,
    });

    let reviewData: any = {};
    try {
      const jsonMatch = review.match(/\{[\s\S]*\}/);
      if (jsonMatch) reviewData = JSON.parse(jsonMatch[0]);
    } catch {
      reviewData = { score: 5, summary: review, recommendation: 'NEEDS_HUMAN_REVIEW', comment: review, concerns: [] };
    }

    emitLog(AGENT, `AI scored PR #${pr.number}: ${reviewData.score}/10 → ${reviewData.recommendation}`, 'ai', {
      score: reviewData.score,
      recommendation: reviewData.recommendation,
      preview: reviewData.summary?.slice(0, 100),
    });

    const taskPage = await createTask({
      title: `[PR #${pr.number}] ${pr.title}`,
      type: 'PR Review',
      priority: reviewData.score >= 8 ? 'Low' : reviewData.score >= 5 ? 'Medium' : 'High',
      githubUrl: `${repoUrl}/pull/${pr.number}`,
      agentNotes: `Score: ${reviewData.score}/10 | ${reviewData.recommendation}\nSummary: ${reviewData.summary}\nConcerns: ${(reviewData.concerns || []).join('; ')}`,
      status: 'In Review',
    });

    emitLog(AGENT, `Notion task created for PR #${pr.number}`, 'success');

    if (reviewData.comment) {
      await addPRReviewComment(pr.number, `## 🤖 AI Review (Score: ${reviewData.score}/10)\n\n${reviewData.comment}\n\n*Recommendation: **${reviewData.recommendation}***\n\n> Reviewed by Notion AI Workflow Engine`);
      emitLog(AGENT, `GitHub review comment posted on PR #${pr.number}`, 'success');
    }

    if (reviewData.recommendation === 'NEEDS_HUMAN_REVIEW' || reviewData.score < 6) {
      await createApproval({
        title: `Review needed: PR #${pr.number} - ${pr.title}`,
        recommendation: `Score: ${reviewData.score}/10\n${reviewData.summary}\n\nConcerns:\n${(reviewData.concerns || []).join('\n')}`,
        taskPageId: (taskPage as any).id,
      });
      emitLog(AGENT, `Human approval request created in Notion for PR #${pr.number}`, 'warn');
    }
  }

  emitLog(AGENT, `Done — reviewed ${prs.length} pull requests`, 'success', { count: prs.length });
}
