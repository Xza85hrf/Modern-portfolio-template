import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// GitHub username for fetching repos
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "Xza85hrf";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages: string[];
  stars: number;
  forks: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

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

/**
 * Fetch all public repositories for the configured GitHub user
 */
export async function getAllPublicRepos(username: string = GITHUB_USERNAME): Promise<GitHubRepo[]> {
  try {
    const repos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    // Paginate through all repos
    while (true) {
      const { data } = await octokit.repos.listForUser({
        username,
        type: "owner", // Get owned repos, filter private ones below
        sort: "updated",
        direction: "desc",
        per_page: perPage,
        page,
      });

      if (data.length === 0) break;

      // Fetch languages for each repo
      for (const repo of data) {
        // Skip forks and private repos
        if (repo.fork || repo.private) continue;

        let languages: string[] = [];
        try {
          const { data: langData } = await octokit.repos.listLanguages({
            owner: username,
            repo: repo.name,
          });
          languages = Object.keys(langData);
        } catch {
          languages = repo.language ? [repo.language] : [];
        }

        repos.push({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description ?? null,
          html_url: repo.html_url,
          homepage: repo.homepage ?? null,
          language: repo.language ?? null,
          languages,
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          topics: repo.topics || [],
          created_at: repo.created_at || "",
          updated_at: repo.updated_at || "",
          pushed_at: repo.pushed_at || "",
        });
      }

      if (data.length < perPage) break;
      page++;
    }

    return repos;
  } catch (error) {
    console.error("Error fetching public repos:", error);
    throw error;
  }
}

/**
 * Generate an OpenGraph image URL for a GitHub repo
 * Uses GitHub's social preview or a placeholder
 */
export function getRepoImageUrl(owner: string, repo: string): string {
  // GitHub's OpenGraph image service
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
}

/**
 * Convert a GitHub repo to a project-compatible format
 */
export function repoToProject(repo: GitHubRepo, owner: string = GITHUB_USERNAME) {
  return {
    title: formatRepoName(repo.name),
    description: repo.description || `A ${repo.language || "software"} project`,
    image: getRepoImageUrl(owner, repo.name),
    technologies: repo.languages.length > 0 ? repo.languages : (repo.language ? [repo.language] : []),
    link: repo.homepage || null,
    githubLink: repo.html_url,
    metadata: {
      github: {
        stars: repo.stars,
        forks: repo.forks,
        language: repo.language,
        topics: repo.topics,
        lastUpdate: repo.pushed_at,
        createdAt: repo.created_at,
      },
    },
  };
}

/**
 * Format repo name to a readable title (e.g., "my-cool-project" -> "My Cool Project")
 */
function formatRepoName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
