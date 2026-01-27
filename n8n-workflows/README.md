# n8n Workflows for Portfolio

Automated workflows to sync GitHub repositories with your portfolio.

## Available Workflows

### 1. `github-portfolio-sync.json` (Simple)
Basic weekly sync that calls your portfolio API.

**Setup:**
1. Import into n8n
2. Set environment variable: `PORTFOLIO_API_URL` (e.g., `https://your-portfolio.com`)
3. Activate the workflow

### 2. `github-ai-description-sync.json` (With AI)
Advanced sync with AI-generated descriptions using OpenAI.

**Setup:**
1. Import into n8n
2. Configure OpenAI credentials in n8n
3. Set environment variables:
   - `PORTFOLIO_API_URL`: Your portfolio URL
   - `GITHUB_USERNAME`: Your GitHub username (Xza85hrf)
   - `GITHUB_TOKEN`: Your GitHub personal access token
4. Activate the workflow

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORTFOLIO_API_URL` | Your deployed portfolio URL | `https://portfolio.example.com` |
| `GITHUB_USERNAME` | Your GitHub username | `Xza85hrf` |
| `GITHUB_TOKEN` | GitHub PAT with `repo` scope | `ghp_xxxx...` |

## Manual Trigger

You can also trigger the sync manually:

```bash
# Simple sync via your portfolio API
curl -X POST http://localhost:5001/api/projects/sync-github-all

# Or use the admin dashboard "Sync All GitHub Repos" button
```

## Customization

- **Schedule**: Edit the "Weekly Schedule" node to change frequency
- **Notifications**: Add Slack/Discord/Email nodes after the success/error nodes
- **AI Model**: Change from `gpt-4o-mini` to other models in the OpenAI node
