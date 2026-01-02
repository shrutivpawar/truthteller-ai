import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldQuestion, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { AnalysisResult as AnalysisResultType, AnalysisFactor } from '@/lib/deepfakeAnalyzer';

interface AnalysisResultProps {
  result: AnalysisResultType;
}

function getVerdictConfig(verdict: AnalysisResultType['verdict']) {
  switch (verdict) {
    case 'LIKELY_REAL':
      return {
        icon: Shield,
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/30',
        label: 'LIKELY REAL',
        glowClass: 'success-glow'
      };
    case 'POTENTIAL_DEEPFAKE':
      return {
        icon: ShieldAlert,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/30',
        label: 'POTENTIAL DEEPFAKE',
        glowClass: 'danger-glow'
      };
    case 'INCONCLUSIVE':
    default:
      return {
        icon: ShieldQuestion,
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/30',
        label: 'INCONCLUSIVE',
        glowClass: ''
      };
  }
}

function getCategoryIcon(category: AnalysisFactor['category']) {
  switch (category) {
    case 'facial':
      return '👤';
    case 'texture':
      return '🔍';
    case 'lighting':
      return '💡';
    case 'metadata':
      return '📊';
    default:
      return '📋';
  }
}

function getScoreColor(score: number) {
  if (score >= 60) return 'text-destructive';
  if (score >= 35) return 'text-warning';
  return 'text-success';
}

function getScoreBarColor(score: number) {
  if (score >= 60) return 'bg-destructive';
  if (score >= 35) return 'bg-warning';
  return 'bg-success';
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const config = getVerdictConfig(result.verdict);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main verdict card */}
      <motion.div
        className={`glass-card p-6 ${config.borderColor} ${config.glowClass}`}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <div className="flex items-start gap-4">
          <motion.div
            className={`p-4 rounded-xl ${config.bgColor}`}
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <Icon className={`w-10 h-10 ${config.color}`} />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className={`font-display text-2xl font-bold ${config.color}`}>
                {config.label}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-display ${config.bgColor} ${config.color}`}>
                {result.confidence}% confidence
              </span>
            </div>
            
            <p className="text-muted-foreground">
              {result.summary}
            </p>
          </div>
        </div>

        {/* Confidence meter */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2 font-display">
            <span>LIKELY REAL</span>
            <span>POTENTIAL DEEPFAKE</span>
          </div>
          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="flex-1 bg-gradient-to-r from-success/30 to-warning/30" />
              <div className="flex-1 bg-gradient-to-r from-warning/30 to-destructive/30" />
            </div>
            <motion.div
              className="absolute top-0 bottom-0 w-1 bg-foreground rounded-full shadow-lg"
              initial={{ left: 0 }}
              animate={{ left: `${result.confidence}%` }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Analysis factors */}
      <div>
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Detection Analysis
        </h3>
        
        <div className="grid gap-3">
          {result.factors.map((factor, index) => (
            <motion.div
              key={factor.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getCategoryIcon(factor.category)}</span>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-display font-medium">{factor.name}</h4>
                    <span className={`font-display font-bold ${getScoreColor(factor.score)}`}>
                      {factor.score}%
                    </span>
                  </div>
                  
                  {/* Score bar */}
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                    <motion.div
                      className={`h-full rounded-full ${getScoreBarColor(factor.score)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.score}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {factor.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-start gap-3 p-4 rounded-lg bg-warning/5 border border-warning/20"
      >
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-warning mb-1">Disclaimer</p>
          <p>
            This analysis is for educational and research purposes only. 
            No detection system is 100% accurate. Results should be verified 
            through additional means before making any conclusions.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
