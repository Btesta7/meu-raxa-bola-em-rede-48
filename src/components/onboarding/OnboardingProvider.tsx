
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { usePreferencesContext } from '@/contexts/PreferencesContext';
import OnboardingTutorial from './OnboardingTutorial';
import { toast } from '@/components/ui/sonner';

interface OnboardingContextType {
  showOnboarding: boolean;
  showTutorial: boolean;
  currentStep: number;
  totalSteps: number;
  startOnboarding: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  startTutorial: () => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { user, isNewUser } = useUserContext();
  const { preferences, updatePreferences } = usePreferencesContext();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  useEffect(() => {
    if (user && isNewUser && !preferences.onboardingCompleted) {
      // Delay para permitir que a UI carregue completamente
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, isNewUser, preferences.onboardingCompleted]);

  const startOnboarding = () => {
    setShowOnboarding(true);
    setCurrentStep(0);
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    updatePreferences({ onboardingCompleted: true });
    
    // Inicia o tutorial após completar o onboarding
    setTimeout(() => {
      setShowTutorial(true);
      toast.success('Perfil configurado com sucesso! Agora vamos conhecer o dashboard.');
    }, 500);
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    updatePreferences({ onboardingCompleted: true });
    
    toast.info('Você pode configurar seu perfil a qualquer momento nas configurações.');
  };

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    toast.success('Tutorial concluído! Você está pronto para usar o Meu Raxa! 🎉');
  };

  const skipTutorial = () => {
    setShowTutorial(false);
    toast.info('Você pode acessar o tutorial novamente nas configurações.');
  };

  const value = {
    showOnboarding,
    showTutorial,
    currentStep,
    totalSteps,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    startTutorial,
    completeTutorial,
    skipTutorial
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      
      {/* Tutorial overlay */}
      <OnboardingTutorial
        isVisible={showTutorial}
        onComplete={completeTutorial}
        onSkip={skipTutorial}
      />
    </OnboardingContext.Provider>
  );
};
