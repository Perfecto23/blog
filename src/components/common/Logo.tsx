interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 个人网站Logo组件
 * 基于姓名"柯芃丞"(K.P.C)设计的现代化SVG logo
 */
export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`cursor-pointer ${sizeClasses[size]} ${className} group`}>
      <svg
        viewBox='0 0 48 48'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='h-full w-full transition-all duration-500 ease-in-out group-hover:scale-105'
      >
        {/* 渐变定义 */}
        <defs>
          <linearGradient id={`logoGradient-${size}`} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#4F46E5' />
            <stop offset='30%' stopColor='#7C3AED' />
            <stop offset='70%' stopColor='#06B6D4' />
            <stop offset='100%' stopColor='#10B981' />
          </linearGradient>

          <radialGradient id={`logoGlow-${size}`} cx='50%' cy='50%' r='60%'>
            <stop offset='0%' stopColor='rgba(79, 70, 229, 0.3)' />
            <stop offset='50%' stopColor='rgba(124, 58, 237, 0.2)' />
            <stop offset='100%' stopColor='rgba(16, 185, 129, 0.1)' />
          </radialGradient>

          {/* 发光效果滤镜 */}
          <filter id={`glow-${size}`} x='-20%' y='-20%' width='140%' height='140%'>
            <feGaussianBlur stdDeviation='1.5' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>

          {/* 阴影滤镜 */}
          <filter id={`shadow-${size}`} x='-50%' y='-50%' width='200%' height='200%'>
            <feDropShadow dx='0' dy='2' stdDeviation='3' floodOpacity='0.3' />
          </filter>
        </defs>

        {/* 背景发光圆 */}
        <circle
          cx='24'
          cy='24'
          r='20'
          fill={`url(#logoGlow-${size})`}
          className='opacity-0 transition-opacity duration-500 group-hover:opacity-100'
        />

        {/* 主圆形背景 */}
        <circle
          cx='24'
          cy='24'
          r='20'
          fill={`url(#logoGradient-${size})`}
          filter={`url(#shadow-${size})`}
          className='transition-all duration-500'
        />

        {/* 内层装饰圆环 */}
        <circle
          cx='24'
          cy='24'
          r='16'
          fill='none'
          stroke='rgba(255,255,255,0.25)'
          strokeWidth='0.5'
          className='group-hover:stroke-opacity-40 transition-all duration-500 group-hover:stroke-white'
        />

        {/* 主字母 K - 更清晰的设计 */}
        <g className='transition-all duration-500'>
          {/* K的左竖线 - 加粗以提高可见性 */}
          <line
            x1='15'
            y1='14'
            x2='15'
            y2='34'
            stroke='white'
            strokeWidth='3.5'
            strokeLinecap='round'
            className='drop-shadow-lg'
          />

          {/* K的右上斜线 - 优化角度和粗细 */}
          <path d='M15 24 L29 14' stroke='white' strokeWidth='3.5' strokeLinecap='round' className='drop-shadow-lg' />

          {/* K的右下斜线 - 优化角度和粗细 */}
          <path d='M15 24 L29 34' stroke='white' strokeWidth='3.5' strokeLinecap='round' className='drop-shadow-lg' />

          {/* 强化装饰点 - 增加科技感 */}
          <circle
            cx='31'
            cy='18'
            r='1.8'
            fill='white'
            className='opacity-90 transition-all duration-500 group-hover:opacity-100'
          />

          <circle
            cx='33'
            cy='30'
            r='1.2'
            fill='white'
            className='opacity-75 transition-all duration-500 group-hover:opacity-95'
          />

          {/* 小装饰点增强科技感 */}
          <circle
            cx='32'
            cy='24'
            r='0.6'
            fill='white'
            className='opacity-60 transition-all duration-500 group-hover:opacity-80'
          />
        </g>

        {/* 科技感装饰 - 增强版 */}
        <g opacity='0.2' className='transition-opacity duration-500 group-hover:opacity-40'>
          {/* 主六边形 */}
          <polygon
            points='32,16 35,18 35,22 32,24 29,22 29,18'
            stroke='white'
            strokeWidth='0.8'
            fill='rgba(255,255,255,0.05)'
            className='group-hover:fill-opacity-15 transition-all duration-500'
          />

          {/* 次六边形 */}
          <polygon
            points='27,28 29,29 29,31 27,32 25,31 25,29'
            stroke='white'
            strokeWidth='0.6'
            fill='rgba(255,255,255,0.03)'
          />

          {/* 连接线 - 科技电路感 */}
          <path
            d='M30 20 L28 22 M34 20 L36 18'
            stroke='white'
            strokeWidth='0.5'
            strokeLinecap='round'
            className='opacity-40 transition-opacity duration-500 group-hover:opacity-70'
          />

          {/* 小装饰三角形 */}
          <polygon points='36,26 38,28 36,30' stroke='white' strokeWidth='0.4' fill='rgba(255,255,255,0.1)' />
        </g>

        {/* 动态光点 */}
        <circle
          cx='20'
          cy='14'
          r='0.5'
          fill='white'
          className='opacity-70 transition-all duration-1000 group-hover:opacity-100'
        >
          <animate attributeName='opacity' values='0.7;1;0.7' dur='2s' repeatCount='indefinite' />
        </circle>
      </svg>
    </div>
  );
}
