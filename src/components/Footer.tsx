import { motion } from 'framer-motion';
import { Shield, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-border/30 py-8 mt-16"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-display">DeepGuard</span>
            <span>• eRaksha Hackathon 2024</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Built with <Heart className="w-4 h-4 text-destructive mx-1" /> for cybersecurity awareness
          </div>

          <div className="flex items-center gap-4 text-sm">
            <a
              href="#"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="#"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/20 text-center text-xs text-muted-foreground">
          <p>
            This tool is for educational and research purposes only. 
            Deepfake detection technology is not 100% accurate and results should be independently verified.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
