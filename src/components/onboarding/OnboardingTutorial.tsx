
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Lightbulb, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserContext } from '@/contexts/UserContext';

interface TutorialStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface OnboardingTutorialProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  isVisible,
  onComplete,
  onSkip
}) => {
  const { user } = useUserContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'dashboard',
      target: '.dashboard-main',
      title: 'Bem-vindo ao seu Dashboard! 🎉',
      content: 'Este é o seu centro de controle. Aqui você pode ver suas estatísticas, próximas partidas e notificações.',
      position: 'bottom'
    },
    {
      id: 'stats-widget',
      target: '.stats-widget',
      title: 'Suas Estatísticas Pessoais 📊',
      content: 'Acompanhe seus gols, assistências e outras métricas importantes. Elas são atualizadas automaticamente!',
      position: 'bottom'
    },
    {
      id: 'matches-widget',
      target: '.matches-widget',
      title: 'Próximas Partidas ⚽',
      content: 'Veja as partidas agendadas e confirme sua presença com um clique. Nunca mais perca um jogo!',
      position: 'left'
    },
    {
      id: 'notifications',
      target: '.notifications-widget',
      title: 'Central de Notificações 🔔',
      content: 'Receba alertas sobre novas partidas, mudanças de horário e mensagens importantes.',
      position: 'left'
    },
    {
      id: 'quick-actions',
      target: '.quick-actions-widget',
      title: 'Ações Rápidas ⚡',
      content: 'Acesse rapidamente as funcionalidades mais usadas: criar partida, editar perfil e muito mais.',
      position: 'top'
    },
    {
      id: 'navigation',
      target: '.main-navigation',
      title: 'Navegação Principal 🧭',
      content: 'Use o menu para navegar entre partidas, perfil, estatísticas e configurações.',
      position: 'bottom'
    }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const targetElement = document.querySelector(tutorialSteps[currentStep]?.target);
    if (targetElement) {
      setHighlightedElement(targetElement);
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, isVisible]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setHighlightedElement(null);
    onSkip();
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  if (!isVisible || !currentTutorialStep) return null;

  const getTooltipPosition = () => {
    if (!highlightedElement) return { top: '50%', left: '50%' };

    const rect = highlightedElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    switch (currentTutorialStep.position) {
      case 'top':
        return {
          top: rect.top + scrollTop - 20,
          left: rect.left + scrollLeft + rect.width / 2,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: rect.bottom + scrollTop + 20,
          left: rect.left + scrollLeft + rect.width / 2,
          transform: 'translate(-50%, 0%)'
        };
      case 'left':
        return {
          top: rect.top + scrollTop + rect.height / 2,
          left: rect.left + scrollLeft - 20,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: rect.top + scrollTop + rect.height / 2,
          left: rect.right + scrollLeft + 20,
          transform: 'translate(0%, -50%)'
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  return (
    <>
      {/* Overlay escuro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-40"
        onClick={handleSkip}
      />

      {/* Highlight do elemento */}
      {highlightedElement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 pointer-events-none"
          style={{
            top: highlightedElement.getBoundingClientRect().top + window.pageYOffset,
            left: highlightedElement.getBoundingClientRect().left + window.pageXOffset,
            width: highlightedElement.getBoundingClientRect().width,
            height: highlightedElement.getBoundingClientRect().height,
            boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.8), 0 0 0 8px rgba(34, 197, 94, 0.3)',
            borderRadius: '8px'
          }}
        />
      )}

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed z-50 max-w-sm"
        style={getTooltipPosition()}
      >
        <Card className="shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  {currentTutorialStep.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentTutorialStep.content}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="p-1 h-auto text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1 flex-1">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full flex-1 ${
                      index <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {currentStep + 1}/{tutorialSteps.length}
              </span>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Anterior
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Pular tutorial
              </Button>

              <Button
                size="sm"
                onClick={handleNext}
                className="flex items-center gap-1 bg-primary hover:bg-primary/90"
              >
                {currentStep === tutorialSteps.length - 1 ? (
                  <>
                    Finalizar
                    <CheckCircle className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default OnboardingTutorial;
