export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  topics: string[];
}

export const fetchGithubRepos = async (username: string): Promise<GithubRepo[]> => {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      next: { revalidate: 3600 },
      headers: process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}
    });

    if (!res.ok) {
      if (res.status === 403) {
        console.warn('GitHub API rate limit exceeded, returning mock data.');
        return getMockRepos();
      }
      throw new Error(`Failed to fetch repositories: ${res.statusText}`);
    }

    const excludedRepos = [
      'user_authentication', 'curr-weather', 'user_registration', 'cabin-price-ai', 'cabin_price_ai',
      'mit license', 'shivansh07-stack'
    ];
    const repos: GithubRepo[] = await res.json();
    return repos.filter(repo => !excludedRepos.includes(repo.name.toLowerCase()));
  } catch (error) {
    console.error('Error fetching repos:', error);
    return getMockRepos();
  }
};

const getMockRepos = (): GithubRepo[] => [
  {
    id: 1,
    name: 'ai-job-analyzer',
    full_name: 'shivansh/ai-job-analyzer',
    description: 'Analyzes job descriptions against resumes to find skill gaps and recommend improvements.',
    html_url: 'https://github.com/shivansh/ai-job-analyzer',
    stargazers_count: 145,
    forks_count: 32,
    language: 'Python',
    updated_at: new Date().toISOString(),
    topics: ['nlp', 'openai', 'resume', 'fastapi']
  },
  {
    id: 2,
    name: 'bank-churn-prediction',
    full_name: 'shivansh/bank-churn-prediction',
    description: 'Predicting bank customer churn using advanced machine learning models.',
    html_url: 'https://github.com/shivansh/bank-churn-prediction',
    stargazers_count: 89,
    forks_count: 12,
    language: 'Jupyter Notebook',
    updated_at: new Date().toISOString(),
    topics: ['machine-learning', 'random-forest', 'xgboost', 'data-science']
  },
  {
    id: 3,
    name: 'multi-document-rag',
    full_name: 'shivansh/multi-document-rag',
    description: 'A robust RAG (Retrieval-Augmented Generation) chatbot capable of answering questions from multiple PDFs.',
    html_url: 'https://github.com/shivansh/multi-document-rag',
    stargazers_count: 210,
    forks_count: 45,
    language: 'TypeScript',
    updated_at: new Date().toISOString(),
    topics: ['rag', 'langchain', 'llm', 'vector-db']
  }
];
