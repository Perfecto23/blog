import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 基础配置
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier 集成（必须放在最后）
  ...compat.extends('prettier'),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // TypeScript 相关规则
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // React 相关规则
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-children-prop': 'error',
      'react/no-unescaped-entities': 'warn',
      'react/prop-types': 'off', // 使用 TypeScript 进行属性验证
      'react/react-in-jsx-scope': 'off', // Next.js 中不需要

      // React Hooks 规则
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 导入规则
      'import/order': 'off',
      'import/no-unresolved': 'off', // TypeScript 处理这个
      'import/no-duplicates': 'error',

      // 通用 JavaScript 规则
      'no-console': 'off', // 允许使用 console，生产环境通过构建配置移除
      'no-debugger': 'error',
      'no-unused-vars': 'off', // 使用 TypeScript 版本
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',

      // 无障碍规则
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
    },
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'public/**',
      '*.config.{js,ts,mjs}',
      '*.d.ts',
    ],
  },
];

export default eslintConfig;
