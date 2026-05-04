import { Hero } from '@/components/layout/Hero';
import { Tabs } from '@/components/layout/Tabs';

export default function BlogsPage() {
  return (
    <>
      <Hero />
      <Tabs />
      <div className="py-20 pb-24 text-center">
        <h1 className="text-4xl font-bold text-foreground">Blogs</h1>
        <p className="mt-3 text-muted-foreground">Coming soon.</p>
      </div>
    </>
  );
}
