import { motion } from 'framer-motion';
import { Shield, Scan, Github, BookOpen } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                DeepGuard
              </h1>
              <p className="text-xs text-muted-foreground">Deepfake Scanner</p>
            </div>
          </motion.div>

          {/* Nav links */}
          <nav className="flex items-center gap-2">
            <motion.a
              href="#how-it-works"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">How it works</span>
            </motion.a>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Source</span>
            </motion.a>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
