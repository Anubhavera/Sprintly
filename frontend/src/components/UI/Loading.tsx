/**
 * Loading component with premium spinner
 */

import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-[3px]',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-6 py-12 p-8"
    >
      <div className="relative">
        {/* Outer Glow */}
        <div className={`absolute inset-0 rounded-full blur-md bg-emerald-500/30 animate-pulse`} />

        {/* Spinner */}
        <div
          className={`
            ${sizeClasses[size]} 
            border-slate-200 border-t-emerald-500 
            rounded-full animate-spin
            relative z-10
          `}
        />
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-sm font-medium tracking-wide uppercase"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}

export default Loading;
