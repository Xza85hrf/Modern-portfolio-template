import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function getRepositoryInfo(owner: string, repo: string) {
  try {
    const { data } = await octokit.repos.get({
      owner,
      repo,
    });

    return {
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error("Error fetching repository info:", error);
    throw error;
  }
}

export async function extractRepoInfo(githubUrl: string) {
  try {
    const url = new URL(githubUrl);
    const [, owner, repo] = url.pathname.split('/');
    if (!owner || !repo) {
      throw new Error('Invalid GitHub URL format');
    }
    return { owner, repo };
  } catch (error) {
    throw new Error('Invalid GitHub URL');
  }
}
