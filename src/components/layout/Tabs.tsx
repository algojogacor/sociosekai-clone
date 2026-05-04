'use client';

import { usePathname, useRouter } from 'next/navigation';
import { MessageSquareText, BookOpenText } from 'lucide-react';
import { Tabs as ShadTabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Tabs() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = pathname === '/blogs' ? 'blogs' : 'posts';

  return (
    <div id="content" className="w-full mt-4">
      <ShadTabs defaultValue={activeTab} className="w-full">
        <TabsList className="flex mx-auto w-96">
          <TabsTrigger
            value="posts"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 flex-1"
          >
            <MessageSquareText className="w-4 h-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="blogs"
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 flex-1"
          >
            <BookOpenText className="w-4 h-4" />
            Blogs
          </TabsTrigger>
        </TabsList>
      </ShadTabs>
    </div>
  );
}
