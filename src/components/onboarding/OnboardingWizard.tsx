
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { OnboardingStep, OnboardingStepProps } from '@/types/onboarding';

interface OnboardingWizardProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip: () => void;
  initialStep?: number;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  steps,
  onComplete,
  onSkip,
  initialStep = 0
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [direction, setDirection] = useState(0);

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setDirection(1);
      setCurrentStepIndex(prev => prev + 1);
      setCompletedSteps(prev => [...prev, currentStep.id]);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => [...prev, currentStep.id]);
    onComplete();
  };

  const handleStepClick = (index: number) => {
    if (index <= currentStepIndex || completedSteps.includes(steps[index].id)) {
      setDirection(index > currentStepIndex ? 1 : -1);
      setCurrentStepIndex(index);
    }
  };

  const stepProps: OnboardingStepProps = {
    onNext: handleNext,
    onPrevious: handlePrevious,
    onComplete: handleComplete,
    isFirst: currentStepIndex === 0,
    isLast: currentStepIndex === steps.length - 1,
    currentStep: currentStepIndex + 1,
    totalSteps: steps.length
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Configuração do Perfil
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Pular
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Etapa {currentStepIndex + 1} de {steps.length}</span>
              <span>{Math.round(progress)}% concluído</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                  index === currentStepIndex
                    ? 'bg-primary text-white shadow-lg scale-110'
                    : completedSteps.includes(step.id)
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : index < currentStepIndex
                    ? 'bg-gray-300 text-gray-600 hover:bg-gray-400 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={index > currentStepIndex && !completedSteps.includes(step.id)}
              >
                {completedSteps.includes(step.id) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0 min-h-[500px]">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentStep.title}
            </h2>
            <p className="text-gray-600">{currentStep.description}</p>
          </CardHeader>
          
          <CardContent className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full"
              >
                <currentStep.component {...stepProps} />
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Pressione</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd>
            <span>para continuar</span>
          </div>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            {currentStepIndex === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
