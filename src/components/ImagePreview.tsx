import { motion } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  fileName: string;
  onRemove: () => void;
  isAnalyzing?: boolean;
}

export function ImagePreview({ src, fileName, onRemove, isAnalyzing }: ImagePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative glass-card p-4 overflow-hidden"
    >
      {/* Remove button */}
      {!isAnalyzing && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-20 p-2 rounded-full bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Image container */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary/50">
        <img
          src={src}
          alt={fileName}
          className="w-full h-full object-contain"
        />

        {/* Scanning overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-background/30 backdrop-blur-sm">
            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-primary to-transparent"
              initial={{ top: 0 }}
              animate={{ top: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
            />

            {/* Grid overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />

            {/* Corner brackets */}
            <div className="absolute inset-4">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
            </div>

            {/* Scanning label */}
            <motion.div
              className="absolute top-4 left-4 px-3 py-1 rounded bg-primary/20 border border-primary text-primary text-xs font-display"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              SCANNING...
            </motion.div>
          </div>
        )}
      </div>

      {/* File info */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground truncate max-w-[200px]" title={fileName}>
          {fileName}
        </p>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ZoomIn className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
}
