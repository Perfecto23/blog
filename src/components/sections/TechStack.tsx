export function TechStack() {
  return (
    <section className='py-24'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='mb-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            技术<span className='gradient-text'>栈</span>
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600'>
            专注现代前端技术，持续学习和实践最新的开发工具和框架
          </p>
        </div>

        <div className='grid grid-cols-3 gap-8 md:grid-cols-6'>
          <div className='group animate-scale-in text-center' style={{ animationDelay: '0.1s' }}>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-lg transition-transform duration-300 group-hover:scale-110'>
              <svg className='h-8 w-8 text-[#42b883]' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z' />
              </svg>
            </div>
            <span className='text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600'>Vue</span>
          </div>

          <div className='group animate-scale-in text-center' style={{ animationDelay: '0.2s' }}>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-lg transition-transform duration-300 group-hover:scale-110'>
              <span className='text-xl font-bold text-[#3178C6]'>TS</span>
            </div>
            <span className='text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600'>
              TypeScript
            </span>
          </div>

          <div className='group animate-scale-in text-center' style={{ animationDelay: '0.3s' }}>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-lg transition-transform duration-300 group-hover:scale-110'>
              <span className='text-xl font-bold text-[#646CFF]'>V</span>
            </div>
            <span className='text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600'>Vite</span>
          </div>

          <div className='group animate-scale-in text-center' style={{ animationDelay: '0.4s' }}>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-lg transition-transform duration-300 group-hover:scale-110'>
              <span className='text-sm font-bold text-[#1C78C0]'>WP</span>
            </div>
            <span className='text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600'>
              Webpack
            </span>
          </div>

          <div className='group animate-scale-in text-center' style={{ animationDelay: '0.5s' }}>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-lg transition-transform duration-300 group-hover:scale-110'>
              <span className='text-sm font-bold text-[#06B6D4]'>TW</span>
            </div>
            <span className='text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600'>
              Tailwind
            </span>
          </div>

          <div className='group animate-scale-in text-center' style={{ animationDelay: '0.6s' }}>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-lg transition-transform duration-300 group-hover:scale-110'>
              <span className='text-sm font-bold text-[#68A063]'>Node</span>
            </div>
            <span className='text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600'>
              Node.js
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
