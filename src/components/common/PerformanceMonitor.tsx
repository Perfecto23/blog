'use client';

import { useEffect } from 'react';
import { log } from '@/lib/logger';

// 性能监控相关类型定义
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// 性能监控相关类型定义

export function PerformanceMonitor() {
  useEffect(() => {
    log.info('性能监控组件初始化', { component: 'PerformanceMonitor' });

    // 监控布局偏移和其他性能指标
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // 监控最大内容绘制 (LCP)
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcpTime = Math.round(lastEntry.startTime);

        log.info('LCP性能指标', {
          value: lcpTime,
          unit: 'ms',
          type: 'LCP',
          action: '性能监控',
        });

        // 生产环境上报分析数据
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (process.env.NODE_ENV === 'production' && (window as any).gtag) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).gtag('event', 'web_vitals', {
            name: 'LCP',
            value: lcpTime,
            event_category: 'performance',
          });
        }
      });

      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        log.debug('LCP监控启动成功', { type: 'LCP', action: '性能监控' });
      } catch (e) {
        log.warn('浏览器不支持LCP监控', { action: '性能监控' });
      }

      // 监控累积布局偏移 (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as LayoutShiftEntry;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }

        log.info('CLS性能指标', {
          value: clsValue.toFixed(4),
          type: 'CLS',
          action: '性能监控',
        });
      });

      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        log.debug('CLS监控启动成功', { type: 'CLS', action: '性能监控' });
      } catch (e) {
        log.warn('浏览器不支持CLS监控', { action: '性能监控' });
      }

      // 监控首次输入延迟 (使用 INP 作为后备)
      const inpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        log.info('INP性能指标', {
          value: Math.round(lastEntry.duration || 0),
          unit: 'ms',
          type: 'INP',
          action: '性能监控',
        });
      });

      try {
        inpObserver.observe({ type: 'first-input', buffered: true });
        log.debug('INP监控启动成功', { type: 'INP', action: '性能监控' });
      } catch (e) {
        log.warn('浏览器不支持INP监控', { action: '性能监控' });
      }

      // 清理监听器
      return () => {
        lcpObserver.disconnect();
        clsObserver.disconnect();
        inpObserver.disconnect();
        log.debug('性能监控清理完成', { action: '性能监控' });
      };
    }
  }, []);

  // 该组件不渲染任何内容
  return null;
}
