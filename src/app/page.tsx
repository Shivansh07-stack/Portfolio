import { fetchGithubRepos } from '@/services/github';
import { DashboardClient } from '@/components/home/DashboardClient';

export default async function Home() {
  const repos = await fetchGithubRepos('Shivansh07-stack');

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <DashboardClient repos={repos} />
    </main>
  );
}
