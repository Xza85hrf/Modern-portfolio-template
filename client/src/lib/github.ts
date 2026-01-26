import { Octokit } from "octokit";

class GitHubService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  async getRepositoryDetails(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });
      
      return {
        name: data.name,
        description: data.description,
        stars: data.stargazers_count,
        language: data.language,
        updatedAt: data.updated_at,
        url: data.html_url,
      };
    } catch (error) {
      console.error('Error fetching repository details:', error);
      throw error;
    }
  }

  async getRepositoryLanguages(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.rest.repos.listLanguages({
        owner,
        repo,
      });
      
      return Object.keys(data);
    } catch (error) {
      console.error('Error fetching repository languages:', error);
      throw error;
    }
  }
}

export const githubService = new GitHubService();
