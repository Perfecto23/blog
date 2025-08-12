'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  caption?: string;
  loading?: 'eager' | 'lazy';
}

/**
 * SEO优化的图片组件
 * - 自动生成alt标签
 * - 支持懒加载
 * - 响应式图片
 * - 结构化数据支持
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 90,
  placeholder = 'empty',
  blurDataURL,
  caption,
  loading = 'lazy',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // 自动生成更详细的alt文本
  const enhancedAlt = alt || generateAltText(src);

  // 自动计算sizes属性
  const autoSizes = sizes || generateSizes();

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-500 ${className}`}
        style={{ width, height }}
      >
        <span className='text-sm'>图片加载失败</span>
      </div>
    );
  }

  const imageElement = (
    <Image
      src={src}
      alt={enhancedAlt}
      width={width}
      height={height}
      fill={fill}
      priority={priority}
      // 提升首屏关键图像的抓取优先级
      fetchPriority={priority ? 'high' : undefined}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes={autoSizes}
      loading={loading}
      className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );

  // 如果有说明文字，包装在figure标签中
  if (caption) {
    return (
      <figure className='relative'>
        {imageElement}
        <figcaption className='mt-2 text-center text-sm text-gray-600'>{caption}</figcaption>
      </figure>
    );
  }

  return imageElement;
}

/**
 * 基于文件名生成alt文本
 */
function generateAltText(src: string): string {
  const filename = src.split('/').pop()?.split('.')[0] || '';
  return filename.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * 生成响应式sizes属性
 */
function generateSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

/**
 * 博客文章专用图片组件
 */
export function BlogImage({ src, alt, caption, className = '', ...props }: OptimizedImageProps) {
  return (
    <div className='my-8'>
      <OptimizedImage
        src={src}
        alt={alt}
        caption={caption}
        className={`rounded-lg shadow-md ${className}`}
        sizes='(max-width: 768px) 100vw, 800px'
        quality={95}
        {...props}
      />
    </div>
  );
}

/**
 * 头像图片组件
 */
export function AvatarImage({
  src,
  alt,
  size = 64,
  className = '',
  ...props
}: OptimizedImageProps & { size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt || '用户头像'}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      priority
      quality={95}
      {...props}
    />
  );
}

/**
 * 项目预览图片组件
 */
export function ProjectImage({ src, alt, className = '', ...props }: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`aspect-video rounded-lg object-cover ${className}`}
      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
      fill
      {...props}
    />
  );
}
