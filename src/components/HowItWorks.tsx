import { motion } from 'framer-motion';
import { Upload, Scan, BarChart3, Shield, Brain, Eye, Palette, Lightbulb } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Media',
    description: 'Upload an image you want to analyze. Supports JPEG, PNG, WebP, and GIF formats.'
  },
  {
    icon: Brain,
    title: 'AI Processing',
    description: 'Our detection engine analyzes multiple features including facial landmarks, textures, and lighting patterns.'
  },
  {
    icon: BarChart3,
    title: 'Confidence Score',
    description: 'Receive a confidence score from 0-100% indicating the likelihood of manipulation.'
  },
  {
    icon: Shield,
    title: 'Detailed Report',
    description: 'Get a comprehensive breakdown of detection factors with explanations for each finding.'
  }
];

const detectionMethods = [
  {
    icon: Eye,
    title: 'Facial Symmetry Analysis',
    description: 'Detects unnatural asymmetry patterns common in AI-generated faces.'
  },
  {
    icon: Palette,
    title: 'Texture Pattern Detection',
    description: 'Identifies artificial smoothing, unusual gradients, and compression artifacts.'
  },
  {
    icon: Lightbulb,
    title: 'Lighting Consistency',
    description: 'Analyzes shadow directions and lighting sources for inconsistencies.'
  },
  {
    icon: BarChart3,
    title: 'Color Distribution',
    description: 'Examines histogram patterns for signs of synthetic generation.'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            DeepGuard uses multiple analysis techniques to detect potential deepfakes 
            and AI-generated content in images.
          </p>
        </motion.div>

        {/* Process steps */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="glass-card p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-display text-2xl font-bold text-primary/30">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-display font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-primary/30" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Detection methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          <h3 className="font-display text-xl font-semibold mb-6 text-center">
            Detection Methods
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {detectionMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-3 rounded-full bg-secondary mb-3">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display font-medium mb-2 text-sm">{method.title}</h4>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
