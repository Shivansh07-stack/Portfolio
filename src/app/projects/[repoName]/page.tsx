import { fetchGithubRepos } from '@/services/github';
import { ProblemVault } from '@/components/project/ProblemVault';
import { DatasetRoom } from '@/components/project/DatasetRoom';
import { ExperimentEngine } from '@/components/project/ExperimentEngine';
import { ResultsRoom } from '@/components/project/ResultsRoom';
import Link from 'next/link';
import { ArrowLeft, Code, Star, GitFork, Cpu } from 'lucide-react';
import { getProjectDetail } from '@/data/projectDetails';

export default async function ProjectPage({ params }: { params: Promise<{ repoName: string }> }) {
  const { repoName } = await params;
  const repos = await fetchGithubRepos('Shivansh07-stack');
  const repo = repos.find(r => r.name === repoName) || repos[0];
  const details = getProjectDetail(repo.name);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {details.heroImage && (
        <div className="absolute top-0 left-0 w-full h-[50vh] z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] z-10" />
          <img src={details.heroImage} alt="Hero" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="max-w-5xl mx-auto p-8 relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors bg-black/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Digital Brain
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {repo.name}
            </h1>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Code className="w-6 h-6 text-white" />
            </a>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <span className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><Star className="w-4 h-4 mr-1 text-yellow-500" /> {repo.stargazers_count}</span>
            <span className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><GitFork className="w-4 h-4 mr-1 text-blue-400" /> {repo.forks_count}</span>
            <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{repo.language}</span>
          </div>

          {details.tags && details.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <Cpu className="w-4 h-4 text-gray-500 mr-2" />
              {details.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 text-xs font-mono rounded-md bg-white/10 text-gray-300 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">{repo.description}</p>
        </header>

        <div className="space-y-16">
          <ResultsRoom repoName={repo.name} />
          <ProblemVault repoName={repo.name} description={repo.description} />
          <DatasetRoom repoName={repo.name} />
          <ExperimentEngine repoName={repo.name} />
        </div>
      </div>
    </main>
  );
}
