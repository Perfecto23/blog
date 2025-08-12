'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  title: string;
  description: string;
  url: string;
}

export function ShareButton({ title, description, url }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch {
        // 用户取消了分享
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        // 可以在这里添加提示通知
      } catch {
        // 复制URL失败
      }
    }
  };

  return (
    <Button variant='outline' size='sm' onClick={handleShare}>
      <Share2 className='h-4 w-4' />
    </Button>
  );
}
