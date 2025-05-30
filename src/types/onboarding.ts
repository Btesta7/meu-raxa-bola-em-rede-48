
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
  isOptional: boolean;
  isCompleted: boolean;
}

export interface OnboardingStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentStep: number;
  totalSteps: number;
}

export interface TutorialTip {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  isOptional: boolean;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  skippedSteps: string[];
  isCompleted: boolean;
  startedAt: Date;
  completedAt?: Date;
}
