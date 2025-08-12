'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/types';

interface CategoryNode {
  name: string;
  fullPath: string;
  level: number;
  children: CategoryNode[];
  postCount: number;
}

interface CategoryHierarchyProps {
  categories: string[];
  currentCategory?: string;
  posts?: BlogPost[]; // 所有文章，用于统计与展示
}

// 构建分类树结构
function buildCategoryTree(categories: string[]): CategoryNode[] {
  const tree: CategoryNode[] = [];
  const nodeMap = new Map<string, CategoryNode>();

  // 第一遍：创建所有节点和层级关系
  categories.forEach(category => {
    const parts = category.split('/');
    let currentPath = '';

    parts.forEach((part, index) => {
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!nodeMap.has(currentPath)) {
        const node: CategoryNode = {
          name: part,
          fullPath: currentPath,
          level: index,
          children: [],
          postCount: 0,
        };

        nodeMap.set(currentPath, node);

        if (index === 0) {
          // 一级分类
          tree.push(node);
        } else {
          // 子分类
          const parent = nodeMap.get(parentPath);
          if (parent) {
            parent.children.push(node);
          }
        }
      }
    });
  });

  // 第二遍：统计每个分类的文章数量（对所有涉及的分类路径计数）
  categories.forEach(category => {
    const parts = category.split('/');
    let currentPath = '';

    // 为每个路径层级都增加计数
    parts.forEach(part => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const node = nodeMap.get(currentPath);
      if (node) {
        node.postCount++;
      }
    });
  });

  return tree;
}

export function CategoryHierarchy({ categories, currentCategory, posts = [] }: CategoryHierarchyProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const tree = buildCategoryTree(categories);

  // category -> 直接文章（用于展示文章列表）
  const postsByCategory = useMemo(() => {
    const byCat: Record<string, BlogPost[]> = {};
    for (const p of posts) {
      if (!byCat[p.category]) byCat[p.category] = [];
      byCat[p.category].push(p);
    }
    return byCat;
  }, [posts]);

  // 分类路径 -> 含子级在内的文章总数
  // 例如 "技术实践/前端开发" 会统计该路径及其所有下级分类的文章数量
  const postCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of posts) {
      const parts = p.category.split('/');
      let acc = '';
      for (const part of parts) {
        acc = acc ? `${acc}/${part}` : part;
        counts[acc] = (counts[acc] || 0) + 1;
      }
    }
    return counts;
  }, [posts]);

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const isExpanded = (path: string) => expandedNodes.has(path);
  const isActive = (path: string) => currentCategory === path;

  // 当有当前分类时，自动展开其父级路径链，保证进入页面时能看到对应节点与文章
  useEffect(() => {
    if (!currentCategory) return;
    const parts = currentCategory.split('/');
    const toExpand: string[] = [];
    let acc = '';
    for (const part of parts) {
      acc = acc ? `${acc}/${part}` : part;
      toExpand.push(acc);
    }
    setExpandedNodes(prev => {
      const next = new Set(prev);
      toExpand.forEach(p => next.add(p));
      return next;
    });
  }, [currentCategory]);

  const renderNode = (node: CategoryNode, depth: number = 0) => {
    const hasChildren = node.children.length > 0;
    const expanded = isExpanded(node.fullPath);
    const active = isActive(node.fullPath);
    const directPosts = postsByCategory[node.fullPath] || [];
    const totalCount = postCounts[node.fullPath] || 0; // 改为统计该分类及所有子级下的文章总数
    const isExpandable = hasChildren || directPosts.length > 0;

    return (
      <div key={node.fullPath} className='select-none'>
        <div
          className={`group flex min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-gray-50 ${
            active ? 'border border-blue-200/80 bg-blue-50/80 text-blue-700' : ''
          }`}
        >
          <div className='flex items-center'>
            {/* 展开/收起按钮 */}
            {isExpandable ? (
              <Button
                variant='ghost'
                size='sm'
                className='h-6 w-6 p-0 hover:bg-transparent'
                onClick={() => toggleExpanded(node.fullPath)}
              >
                {expanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
              </Button>
            ) : (
              <div className='w-6' />
            )}

            {/* 图标 */}
            <span className='mr-2w-5 flex h-5 items-center justify-center'>
              {expanded ? (
                <FolderOpen
                  className={`h-4 w-4 transition-colors duration-200 ${
                    expanded || active ? 'text-blue-600' : 'text-gray-500'
                  } group-hover:text-blue-600`}
                />
              ) : (
                <Folder
                  className={`h-4 w-4 transition-colors duration-200 ${
                    expanded || active ? 'text-blue-600' : 'text-gray-500'
                  } group-hover:text-blue-600`}
                />
              )}
            </span>
          </div>

          {/* 分类名称和链接 */}
          <Link
            href={`/blog?category=${encodeURIComponent(node.fullPath)}`}
            className='flex min-w-0 flex-1 items-center justify-between transition-colors hover:text-blue-600'
          >
            <span className='mr-2 min-w-0 flex-1 truncate text-sm font-medium' title={node.name}>
              {node.name}
            </span>
            {totalCount > 0 && (
              <span
                className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-blue-100 to-blue-200/80 text-blue-700 shadow-sm'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200/80 text-gray-600 hover:from-blue-100 hover:to-blue-200/80 hover:text-blue-700'
                }`}
              >
                {totalCount}
              </span>
            )}
          </Link>
        </div>

        {/* 子分类 */}
        {hasChildren && expanded && (
          <div className='mt-2 space-y-1 border-l border-gray-100' style={{ paddingLeft: `16px` }}>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}

        {/* 展开时显示直接隶属此分类的文章 */}
        {expanded && directPosts.length > 0 && (
          <div className='mt-1 space-y-1 border-l border-gray-100' style={{ paddingLeft: `16px` }}>
            {directPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className='group flex max-w-full items-center gap-2 rounded px-2 py-1 pl-8 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-700'
                title={post.title}
              >
                <FileText className='h-4 w-4 flex-shrink-0 text-gray-500 transition-colors duration-200 group-hover:text-blue-600' />
                <span className='min-w-0 flex-1 truncate'>{post.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='space-y-3'>
      <div className='mb-4 lg:mb-6'>
        <h3 className='mb-3 flex items-center gap-2 text-base font-semibold text-gray-900 lg:text-lg'>
          <Folder className='h-5 w-5 text-gray-600' />
          分类目录
        </h3>
        <Button
          variant='outline'
          size='sm'
          asChild
          className={`w-full justify-start rounded-lg transition-all duration-300 ${
            !currentCategory
              ? 'border-blue-200/80 bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-700 shadow-lg shadow-blue-200/50 hover:shadow-xl'
              : 'hover:scale-[1.01] hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50'
          }`}
        >
          <Link href='/blog'>全部文章</Link>
        </Button>
      </div>

      {/* 列表在移动端限制高度并可滚动，保证不超出视口 */}
      <div className='max-h-[60vh] space-y-1 overflow-auto overscroll-contain pr-1 sm:max-h-none sm:overflow-visible sm:pr-0'>
        {tree.map((node, idx) => (
          <div key={`${node.fullPath}-${idx}`}>{renderNode(node, 0)}</div>
        ))}
      </div>
    </div>
  );
}
