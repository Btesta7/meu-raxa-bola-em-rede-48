
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CompletedOnboardingCelebrationProps {
  userName: string;
  onContinue: () => void;
}

const CompletedOnboardingCelebration: React.FC<CompletedOnboardingCelebrationProps> = ({
  userName,
  onContinue
}) => {
  useEffect(() => {
    // Auto-continue after 5 seconds
    const timer = setTimeout(() => {
      onContinue();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  const confettiItems = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Confetti */}
      {confettiItems.map((item) => (
        <motion.div
          key={item}
          className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"
          initial={{ 
            y: -100, 
            x: Math.random() * window.innerWidth,
            rotate: 0,
            opacity: 1
          }}
          animate={{ 
            y: window.innerHeight + 100, 
            rotate: 360,
            opacity: 0
          }}
          transition={{ 
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Trophy Icon with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.8, 
                type: "spring",
                stiffness: 200 
              }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-4 mb-8"
            >
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Perfil Configurado!</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Parabéns, {userName}! 🎉
              </h1>
              
              <p className="text-gray-600 leading-relaxed">
                Seu perfil está completo e você já pode aproveitar todas as funcionalidades do <strong>Meu Raxa</strong>!
              </p>
            </motion.div>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="space-y-3 mb-8"
            >
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  ⚽
                </div>
                <span>Participe de partidas e organize jogos</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  📊
                </div>
                <span>Acompanhe suas estatísticas em tempo real</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  👥
                </div>
                <span>Conecte-se com outros jogadores</span>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <Button
                onClick={onContinue}
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span>Ir para Dashboard</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <p className="text-xs text-gray-500 mt-3">
                Redirecionamento automático em 5 segundos
              </p>
            </motion.div>

            {/* Sparkles */}
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>
            
            <div className="absolute top-8 left-4">
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompletedOnboardingCelebration;
