import './globals.css';
import { PersonaProvider } from '@/context/PersonaContext';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shivansh Sharma | The Data Scientist's Mind",
  description: 'Interactive Data Science Portfolio by Shivansh Sharma. Explore ML models, robotics vision systems, and full-stack GenAI projects.',
  keywords: ['Data Scientist', 'Machine Learning', 'GenAI', 'Shivansh Sharma', 'Computer Vision', 'Portfolio'],
  authors: [{ name: 'Shivansh Sharma' }],
  openGraph: {
    title: "Shivansh Sharma | The Data Scientist's Mind",
    description: 'Explore my neural-network inspired portfolio showcasing end-to-end ML deployments, RAG chatbots, and more.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shivansh Sharma Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shivansh Sharma | Data Scientist",
    description: 'Explore my neural-network inspired portfolio.',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased"><PersonaProvider>{children}</PersonaProvider></body>
    </html>
  );
}
