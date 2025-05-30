
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip: () => void;
  userName?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onSkip, userName }) => {
  const features = [
    {
      icon: Trophy,
      title: 'Acompanhe suas estatísticas',
      description: 'Veja seus gols, assistências e performance'
    },
    {
      icon: Users,
      title: 'Organize partidas',
      description: 'Crie e gerencie jogos com seus amigos'
    },
    {
      icon: Play,
      title: 'Participe de times',
      description: 'Entre em grupos e faça parte da comunidade'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardContent className="p-8 text-center">
            {/* Logo e Título */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Bem-vindo ao Meu Raxa! 🎉
              </h1>
              {userName && (
                <p className="text-xl text-gray-600 mb-2">
                  Olá, <span className="font-semibold text-primary">{userName}</span>!
                </p>
              )}
              <p className="text-gray-600 text-lg">
                Vamos configurar tudo para você ter a melhor experiência
              </p>
            </motion.div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="text-center p-4"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={onStart}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Play className="w-5 h-5 mr-2" />
                Começar Configuração
              </Button>
              <Button
                onClick={onSkip}
                variant="ghost"
                size="lg"
                className="text-gray-600 hover:text-gray-800 px-8 py-3"
              >
                Pular por agora
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-sm text-gray-500 mt-6"
            >
              Leva apenas 2 minutos para configurar tudo
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
