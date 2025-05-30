
import { useState, useEffect } from 'react';
import { OnboardingProgress, OnboardingStep } from '@/types/onboarding';
import { useUserContext } from '@/contexts/UserContext';

export const useOnboardingProgress = (steps: OnboardingStep[]) => {
  const { user } = useUserContext();
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 0,
    completedSteps: [],
    skippedSteps: [],
    isCompleted: false,
    startedAt: new Date()
  });

  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`onboarding_progress_${user.id}`);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setProgress({
          ...parsed,
          startedAt: new Date(parsed.startedAt),
          completedAt: parsed.completedAt ? new Date(parsed.completedAt) : undefined
        });
      }
    }
  }, [user]);

  const saveProgress = (newProgress: OnboardingProgress) => {
    if (user) {
      localStorage.setItem(`onboarding_progress_${user.id}`, JSON.stringify(newProgress));
      setProgress(newProgress);
    }
  };

  const completeStep = (stepId: string) => {
    const newProgress = {
      ...progress,
      completedSteps: [...progress.completedSteps, stepId],
      currentStep: Math.min(progress.currentStep + 1, steps.length - 1)
    };
    saveProgress(newProgress);
  };

  const skipStep = (stepId: string) => {
    const newProgress = {
      ...progress,
      skippedSteps: [...progress.skippedSteps, stepId],
      currentStep: Math.min(progress.currentStep + 1, steps.length - 1)
    };
    saveProgress(newProgress);
  };

  const goToStep = (stepIndex: number) => {
    const newProgress = {
      ...progress,
      currentStep: stepIndex
    };
    saveProgress(newProgress);
  };

  const completeOnboarding = () => {
    const newProgress = {
      ...progress,
      isCompleted: true,
      completedAt: new Date()
    };
    saveProgress(newProgress);
  };

  const resetProgress = () => {
    const newProgress = {
      currentStep: 0,
      completedSteps: [],
      skippedSteps: [],
      isCompleted: false,
      startedAt: new Date()
    };
    saveProgress(newProgress);
  };

  const getStepStatus = (stepId: string) => {
    if (progress.completedSteps.includes(stepId)) return 'completed';
    if (progress.skippedSteps.includes(stepId)) return 'skipped';
    return 'pending';
  };

  const getProgressPercentage = () => {
    const totalSteps = steps.length;
    const completedCount = progress.completedSteps.length + progress.skippedSteps.length;
    return Math.round((completedCount / totalSteps) * 100);
  };

  return {
    progress,
    completeStep,
    skipStep,
    goToStep,
    completeOnboarding,
    resetProgress,
    getStepStatus,
    getProgressPercentage
  };
};
