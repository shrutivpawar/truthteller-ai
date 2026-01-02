import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, RotateCcw, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileUpload } from '@/components/FileUpload';
import { ImagePreview } from '@/components/ImagePreview';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { AnalysisResult } from '@/components/AnalysisResult';
import { HowItWorks } from '@/components/HowItWorks';
import { Button } from '@/components/ui/button';
import { 
  analyzeImage, 
  createAnalysisSimulator,
  type AnalysisResult as AnalysisResultType 
} from '@/lib/deepfakeAnalyzer';

type AppState = 'idle' | 'preview' | 'analyzing' | 'result';

export default function Index() {
  const [state, setState] = useState<AppState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState({ step: '', progress: 0 });
  const [result, setResult] = useState<AnalysisResultType | null>(null);

  const handleFileSelect = useCallback((file: File, preview: string) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
    setState('preview');
    setResult(null);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl('');
    setState('idle');
    setResult(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!previewUrl) return;

    setState('analyzing');
    setAnalysisProgress({ step: 'Initializing...', progress: 0 });

    try {
      // Run progress simulation alongside actual analysis
      const progressPromise = createAnalysisSimulator((step, progress) => {
        setAnalysisProgress({ step, progress });
      });

      // Load image and run analysis
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const [analysisResult] = await Promise.all([
        analyzeImage(img),
        progressPromise
      ]);

      setResult(analysisResult);
      setState('result');
    } catch (error) {
      console.error('Analysis failed:', error);
      setState('preview');
    }
  }, [previewUrl]);

  const handleReset = useCallback(() => {
    handleRemoveFile();
  }, [handleRemoveFile]);

  return (
    <div className="min-h-screen flex flex-col matrix-bg">
      <Header />

      <main className="flex-1">
        {/* Hero section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-display mb-6"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Detection • 100% Browser-Based
              </motion.div>

              <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">Detect </span>
                <span className="text-primary">Deepfakes</span>
                <br />
                <span className="text-foreground">Instantly</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload an image and let our AI analyze it for signs of manipulation. 
                Get detailed reports with confidence scores and explanations.
              </p>
            </motion.div>

            {/* Main scanner interface */}
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                {state === 'idle' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FileUpload onFileSelect={handleFileSelect} />
                  </motion.div>
                )}

                {(state === 'preview' || state === 'analyzing') && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <ImagePreview
                      src={previewUrl}
                      fileName={selectedFile?.name || 'image'}
                      onRemove={handleRemoveFile}
                      isAnalyzing={state === 'analyzing'}
                    />

                    {state === 'analyzing' ? (
                      <AnalysisProgress
                        currentStep={analysisProgress.step}
                        progress={analysisProgress.progress}
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center"
                      >
                        <Button
                          size="lg"
                          onClick={handleAnalyze}
                          className="font-display text-lg px-8 py-6 cyber-glow"
                        >
                          <Scan className="w-5 h-5 mr-2" />
                          Start Analysis
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {state === 'result' && result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Small preview */}
                    <div className="flex items-center gap-4 glass-card p-4">
                      <img
                        src={previewUrl}
                        alt="Analyzed image"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-display text-sm text-muted-foreground">
                          Analyzed Image
                        </p>
                        <p className="text-sm truncate">{selectedFile?.name}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="font-display"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        New Scan
                      </Button>
                    </div>

                    <AnalysisResult result={result} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
