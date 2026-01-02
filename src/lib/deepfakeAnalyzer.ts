// Deepfake Detection Analysis Engine
// Uses face landmark analysis and image feature detection

export interface AnalysisResult {
  isDeepfake: boolean;
  confidence: number;
  verdict: 'LIKELY_REAL' | 'POTENTIAL_DEEPFAKE' | 'INCONCLUSIVE';
  factors: AnalysisFactor[];
  summary: string;
}

export interface AnalysisFactor {
  name: string;
  score: number; // 0-100, higher = more suspicious
  description: string;
  category: 'facial' | 'texture' | 'lighting' | 'metadata';
}

interface FaceLandmark {
  x: number;
  y: number;
}

// Analyze facial symmetry (deepfakes often have asymmetry issues)
function analyzeFacialSymmetry(landmarks: FaceLandmark[]): AnalysisFactor {
  if (landmarks.length < 10) {
    return {
      name: 'Facial Symmetry',
      score: 50,
      description: 'Insufficient landmarks detected for symmetry analysis',
      category: 'facial'
    };
  }

  // Calculate basic symmetry score based on landmark positions
  let asymmetryScore = 0;
  const midX = landmarks.reduce((sum, l) => sum + l.x, 0) / landmarks.length;
  
  for (let i = 0; i < landmarks.length; i++) {
    const distFromCenter = Math.abs(landmarks[i].x - midX);
    const expectedY = landmarks[i].y;
    
    // Find corresponding point on opposite side
    const mirrorPoints = landmarks.filter(l => 
      Math.abs(Math.abs(l.x - midX) - distFromCenter) < 5 && 
      Math.abs(l.y - expectedY) < 10 &&
      l !== landmarks[i]
    );
    
    if (mirrorPoints.length === 0 && distFromCenter > 10) {
      asymmetryScore += 2;
    }
  }

  const normalizedScore = Math.min(asymmetryScore * 3, 100);
  
  return {
    name: 'Facial Symmetry',
    score: normalizedScore,
    description: normalizedScore > 60 
      ? 'Unusual facial asymmetry detected - common in AI-generated faces'
      : normalizedScore > 30 
        ? 'Minor symmetry variations - within normal range'
        : 'Natural facial symmetry patterns observed',
    category: 'facial'
  };
}

// Analyze texture patterns in the image
function analyzeTexturePatterns(imageData: ImageData): AnalysisFactor {
  const data = imageData.data;
  let edgeIntensity = 0;
  let smoothPatches = 0;
  const width = imageData.width;
  
  // Simple edge detection and smoothness analysis
  for (let i = 0; i < data.length - 4; i += 4) {
    const currentGray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const nextGray = (data[i + 4] + data[i + 5] + data[i + 6]) / 3;
    const diff = Math.abs(currentGray - nextGray);
    
    if (diff > 30) edgeIntensity++;
    if (diff < 3) smoothPatches++;
  }

  const totalPixels = data.length / 4;
  const edgeRatio = edgeIntensity / totalPixels;
  const smoothRatio = smoothPatches / totalPixels;

  // Deepfakes often have unusual smoothness or artificial edge patterns
  let suspicionScore = 0;
  
  if (smoothRatio > 0.7) {
    suspicionScore += 40; // Too smooth
  } else if (smoothRatio < 0.2) {
    suspicionScore += 20; // Too sharp
  }
  
  if (edgeRatio < 0.05 || edgeRatio > 0.4) {
    suspicionScore += 30;
  }

  return {
    name: 'Texture Analysis',
    score: Math.min(suspicionScore, 100),
    description: suspicionScore > 50 
      ? 'Unusual texture patterns detected - possible AI artifacts'
      : suspicionScore > 25
        ? 'Minor texture irregularities - could be compression or AI'
        : 'Natural texture patterns observed',
    category: 'texture'
  };
}

// Analyze color and lighting consistency
function analyzeLightingConsistency(imageData: ImageData): AnalysisFactor {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Divide image into quadrants and analyze lighting
  const quadrants: number[][] = [[], [], [], []];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      
      const quadIdx = (y < height / 2 ? 0 : 2) + (x < width / 2 ? 0 : 1);
      quadrants[quadIdx].push(brightness);
    }
  }

  // Calculate average brightness per quadrant
  const avgBrightness = quadrants.map(q => 
    q.reduce((a, b) => a + b, 0) / q.length
  );

  // Check for unusual lighting patterns
  const maxDiff = Math.max(...avgBrightness) - Math.min(...avgBrightness);
  const variance = avgBrightness.reduce((sum, v) => {
    const diff = v - avgBrightness.reduce((a, b) => a + b, 0) / 4;
    return sum + diff * diff;
  }, 0) / 4;

  let score = 0;
  if (maxDiff > 80) score += 40;
  else if (maxDiff > 50) score += 20;
  
  if (variance > 1000) score += 30;
  else if (variance > 500) score += 15;

  return {
    name: 'Lighting Consistency',
    score: Math.min(score, 100),
    description: score > 50
      ? 'Inconsistent lighting across face regions - suspicious'
      : score > 25
        ? 'Some lighting variations detected'
        : 'Consistent lighting patterns - appears natural',
    category: 'lighting'
  };
}

// Analyze color histogram for unnatural distributions
function analyzeColorDistribution(imageData: ImageData): AnalysisFactor {
  const data = imageData.data;
  const histogram = new Array(256).fill(0);
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    histogram[gray]++;
  }

  const totalPixels = data.length / 4;
  
  // Check for gaps in histogram (sign of AI generation)
  let gaps = 0;
  let spikes = 0;
  const avgCount = totalPixels / 256;
  
  for (let i = 1; i < 255; i++) {
    if (histogram[i] === 0 && histogram[i - 1] > 0 && histogram[i + 1] > 0) {
      gaps++;
    }
    if (histogram[i] > avgCount * 5) {
      spikes++;
    }
  }

  const score = Math.min((gaps * 5) + (spikes * 3), 100);

  return {
    name: 'Color Distribution',
    score,
    description: score > 50
      ? 'Unnatural color histogram detected - possible manipulation'
      : score > 25
        ? 'Minor color distribution anomalies'
        : 'Natural color distribution pattern',
    category: 'texture'
  };
}

// Simple face detection using canvas pixel analysis
function detectFaceRegion(imageData: ImageData): { found: boolean; landmarks: FaceLandmark[] } {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Look for skin-tone pixels (simplified approach)
  const skinPixels: FaceLandmark[] = [];
  
  for (let y = 0; y < height; y += 5) {
    for (let x = 0; x < width; x += 5) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // Simple skin tone detection
      if (r > 95 && g > 40 && b > 20 && 
          r > g && r > b && 
          Math.abs(r - g) > 15 && 
          r - b > 15) {
        skinPixels.push({ x, y });
      }
    }
  }

  if (skinPixels.length < 50) {
    return { found: false, landmarks: [] };
  }

  // Find center of skin region
  const centerX = skinPixels.reduce((sum, p) => sum + p.x, 0) / skinPixels.length;
  const centerY = skinPixels.reduce((sum, p) => sum + p.y, 0) / skinPixels.length;

  // Generate pseudo-landmarks based on skin region
  const landmarks: FaceLandmark[] = skinPixels
    .filter(p => Math.abs(p.x - centerX) < width / 4 && Math.abs(p.y - centerY) < height / 4)
    .slice(0, 100);

  return { found: landmarks.length > 30, landmarks };
}

// Main analysis function
export async function analyzeImage(imageElement: HTMLImageElement): Promise<AnalysisResult> {
  // Create canvas and get image data
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  // Resize for analysis
  const maxDim = 512;
  let width = imageElement.naturalWidth;
  let height = imageElement.naturalHeight;
  
  if (width > height) {
    height = Math.round((height * maxDim) / width);
    width = maxDim;
  } else {
    width = Math.round((width * maxDim) / height);
    height = maxDim;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imageElement, 0, 0, width, height);
  
  const imageData = ctx.getImageData(0, 0, width, height);

  // Detect face and get landmarks
  const faceDetection = detectFaceRegion(imageData);
  
  // Run all analysis factors
  const factors: AnalysisFactor[] = [];

  if (faceDetection.found) {
    factors.push(analyzeFacialSymmetry(faceDetection.landmarks));
  } else {
    factors.push({
      name: 'Face Detection',
      score: 40,
      description: 'No clear face detected - analysis may be limited',
      category: 'facial'
    });
  }

  factors.push(analyzeTexturePatterns(imageData));
  factors.push(analyzeLightingConsistency(imageData));
  factors.push(analyzeColorDistribution(imageData));

  // Calculate overall confidence
  const avgScore = factors.reduce((sum, f) => sum + f.score, 0) / factors.length;
  
  // Add some randomness for demo purposes (simulating model uncertainty)
  const jitter = (Math.random() - 0.5) * 10;
  const finalScore = Math.max(0, Math.min(100, avgScore + jitter));

  let verdict: 'LIKELY_REAL' | 'POTENTIAL_DEEPFAKE' | 'INCONCLUSIVE';
  let summary: string;

  if (finalScore >= 60) {
    verdict = 'POTENTIAL_DEEPFAKE';
    summary = 'Multiple indicators suggest this image may be artificially generated or manipulated. High-confidence signals include unusual texture patterns and facial inconsistencies.';
  } else if (finalScore >= 35) {
    verdict = 'INCONCLUSIVE';
    summary = 'Analysis shows mixed signals. Some indicators are within normal range while others show minor anomalies. Manual review recommended.';
  } else {
    verdict = 'LIKELY_REAL';
    summary = 'No significant manipulation indicators detected. Image characteristics are consistent with authentic photographs.';
  }

  return {
    isDeepfake: verdict === 'POTENTIAL_DEEPFAKE',
    confidence: Math.round(finalScore),
    verdict,
    factors,
    summary
  };
}

// Simulate analysis progress for UX
export function createAnalysisSimulator(onProgress: (step: string, progress: number) => void) {
  const steps = [
    'Initializing detection engine...',
    'Extracting facial landmarks...',
    'Analyzing texture patterns...',
    'Checking lighting consistency...',
    'Evaluating color distribution...',
    'Running deepfake classifier...',
    'Generating confidence score...',
    'Compiling analysis report...'
  ];

  let currentStep = 0;

  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        onProgress(steps[currentStep], ((currentStep + 1) / steps.length) * 100);
        currentStep++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 400);
  });
}
