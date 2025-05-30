
import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { id: 1, title: 'Informações Básicas' },
    { id: 2, title: 'Perfil de Jogador' },
    { id: 3, title: 'Avatar e Bio' },
    { id: 4, title: 'Contato de Emergência' }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.id < currentStep
                    ? 'bg-primary border-primary text-white'
                    : step.id === currentStep
                    ? 'border-primary text-primary bg-white'
                    : 'border-gray-300 text-gray-300 bg-white'
                }`}
              >
                {step.id < currentStep ? (
                  <Check size={16} />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center max-w-20 ${
                  step.id <= currentStep ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors ${
                  step.id < currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;
