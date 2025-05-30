
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import ProgressStepper from '@/components/onboarding/ProgressStepper';
import StepBasicInfo from '@/components/onboarding/StepBasicInfo';
import StepPlayerInfo from '@/components/onboarding/StepPlayerInfo';
import StepAvatarBio from '@/components/onboarding/StepAvatarBio';
import StepEmergencyContact from '@/components/onboarding/StepEmergencyContact';
import { OnboardingData } from '@/types';

const Onboarding = () => {
  const { user, isLoading, completeOnboarding } = useUserContext();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: user?.name || '',
    age: null,
    phone: '',
    position: user?.position || 'Meio-campista',
    secondaryPositions: [],
    preferredFoot: 'right',
    yearsPlaying: null,
    bio: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
    // Se o usuário já tem perfil completo, redirecionar para dashboard
    if (user && user.isProfileComplete) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const updateStepData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const success = await completeOnboarding(onboardingData);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepBasicInfo
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <StepPlayerInfo
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <StepAvatarBio
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <StepEmergencyContact
            data={onboardingData}
            onUpdate={updateStepData}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Meu Raxa! 🎉
          </h1>
          <p className="text-gray-600">
            Vamos completar seu perfil para você ter a melhor experiência
          </p>
        </div>

        <ProgressStepper currentStep={currentStep} totalSteps={4} />

        <div className="mt-8">
          {renderCurrentStep()}
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding;
