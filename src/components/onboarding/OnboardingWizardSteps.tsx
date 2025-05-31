
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import StepBasicInfo from './StepBasicInfo';
import StepPlayerInfo from './StepPlayerInfo';
import StepAvatarBio from './StepAvatarBio';
import StepEmergencyContact from './StepEmergencyContact';
import { OnboardingData } from '@/types';

interface OnboardingWizardStepsProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
  initialData?: Partial<OnboardingData>;
}

const OnboardingWizardSteps: React.FC<OnboardingWizardStepsProps> = ({
  onComplete,
  onSkip,
  initialData = {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: initialData.name || '',
    age: initialData.age || null,
    phone: initialData.phone || '',
    position: initialData.position || 'Meio-campista',
    secondaryPositions: initialData.secondaryPositions || [],
    preferredFoot: initialData.preferredFoot || 'right',
    yearsPlaying: initialData.yearsPlaying || null,
    bio: initialData.bio || '',
    emergencyContact: initialData.emergencyContact || {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const steps = [
    {
      id: 'basic-info',
      title: 'Informações Básicas',
      description: 'Conte-nos um pouco sobre você',
      component: StepBasicInfo,
      icon: '👤'
    },
    {
      id: 'player-info',
      title: 'Perfil de Jogador',
      description: 'Suas preferências no campo',
      component: StepPlayerInfo,
      icon: '⚽'
    },
    {
      id: 'avatar-bio',
      title: 'Avatar e Biografia',
      description: 'Personalize seu perfil',
      component: StepAvatarBio,
      icon: '📸'
    },
    {
      id: 'emergency-contact',
      title: 'Contato de Emergência',
      description: 'Para sua segurança',
      component: StepEmergencyContact,
      icon: '🚨'
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateStepData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(onboardingData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      setDirection(stepIndex < currentStep ? -1 : 1);
      setCurrentStep(stepIndex);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    })
  };

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header com progresso */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Configuração do Perfil
                </h1>
                <p className="text-muted-foreground">
                  Vamos configurar tudo para você ter a melhor experiência
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Pular configuração
              </Button>
            </div>

            {/* Indicador de progresso com etapas */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Etapa {currentStep + 1} de {steps.length}</span>
                <span>{Math.round(progress)}% concluído</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              {/* Step indicators */}
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <motion.button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    disabled={index > currentStep}
                    className={`flex flex-col items-center space-y-2 p-2 rounded-lg transition-colors ${
                      index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                    whileHover={index <= currentStep ? { scale: 1.05 } : {}}
                    whileTap={index <= currentStep ? { scale: 0.95 } : {}}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-colors ${
                        index === currentStep
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : index < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span>{step.icon}</span>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-medium ${
                        index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Conteúdo da etapa */}
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2"
              >
                <div className="text-4xl mb-2">{currentStepData.icon}</div>
                <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </motion.div>
            </CardHeader>
            
            <CardContent className="min-h-[400px] flex flex-col">
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 }
                    }}
                    className="h-full"
                  >
                    <StepComponent
                      data={onboardingData}
                      onUpdate={updateStepData}
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 mt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Pressione</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd>
                  <span>para continuar</span>
                </div>

                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Finalizar
                      <CheckCircle className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Próximo
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizardSteps;
