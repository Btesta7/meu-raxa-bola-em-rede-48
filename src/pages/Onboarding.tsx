
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
import OnboardingWizardSteps from '@/components/onboarding/OnboardingWizardSteps';
import CompletedOnboardingCelebration from '@/components/onboarding/CompletedOnboardingCelebration';
import { OnboardingData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const Onboarding = () => {
  const { user, isLoading, completeOnboarding } = useUserContext();
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'wizard' | 'celebration'>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
    // Se o usuário já tem perfil completo, redirecionar para dashboard
    if (user && user.isProfileComplete) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const handleStartWizard = () => {
    setCurrentPhase('wizard');
  };

  const handleSkipOnboarding = () => {
    navigate('/');
  };

  const handleCompleteOnboarding = async (data: OnboardingData) => {
    setIsSubmitting(true);
    try {
      const success = await completeOnboarding(data);
      if (success) {
        setCurrentPhase('celebration');
      }
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishCelebration = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentPhase === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WelcomeScreen
              onStart={handleStartWizard}
              onSkip={handleSkipOnboarding}
              userName={user.name}
            />
          </motion.div>
        )}

        {currentPhase === 'wizard' && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <OnboardingWizardSteps
              onComplete={handleCompleteOnboarding}
              onSkip={handleSkipOnboarding}
              initialData={{
                name: user.name,
                position: user.position
              }}
            />
          </motion.div>
        )}

        {currentPhase === 'celebration' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <CompletedOnboardingCelebration
              userName={user.name}
              onContinue={handleFinishCelebration}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay para submissão */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-gray-700">Finalizando configuração...</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Onboarding;
