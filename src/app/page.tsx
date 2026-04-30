import { getAllBlogPosts, getKnowledgeTree } from '@/lib/content';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import KnowledgePreview from '@/components/home/KnowledgePreview';

export default function HomePage() {
  const posts = getAllBlogPosts();
  const knowledgeTree = getKnowledgeTree();

  return (
    <>
      <HeroSection />
      <FeaturedSection posts={posts} />
      <KnowledgePreview nodes={knowledgeTree} />
    </>
  );
}
