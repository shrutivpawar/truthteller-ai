import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';

interface AnalysisProgressProps {
  currentStep: string;
  progress: number;
}

export function AnalysisProgress({ currentStep, progress }: AnalysisProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-5 h-5 text-primary" />
        </motion.div>
        <span className="font-display text-sm text-foreground">{currentStep}</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Animated glow */}
        <motion.div
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          animate={{ left: ['-20%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Progress percentage */}
      <div className="mt-2 flex justify-between text-xs text-muted-foreground font-display">
        <span>Analyzing...</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </motion.div>
  );
}
