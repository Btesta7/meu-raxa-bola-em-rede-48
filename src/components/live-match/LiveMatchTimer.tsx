
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LiveMatchTimerProps {
  duration: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onTimeUpdate: (timeLeft: number) => void;
}

const LiveMatchTimer: React.FC<LiveMatchTimerProps> = ({
  duration,
  isActive,
  isPaused,
  onStart,
  onPause,
  onReset,
  onTimeUpdate
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft, onTimeUpdate]);

  const handleReset = useCallback(() => {
    setTimeLeft(duration);
    onReset();
  }, [duration, onReset]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 30) return 'text-red-600';
    if (timeLeft <= 60) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className={`text-6xl font-bold mb-4 ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex justify-center gap-3">
            {!isActive ? (
              <Button onClick={onStart} size="lg" className="flex items-center gap-2">
                <Play size={20} />
                Iniciar
              </Button>
            ) : isPaused ? (
              <Button onClick={onStart} size="lg" className="flex items-center gap-2">
                <Play size={20} />
                Continuar
              </Button>
            ) : (
              <Button onClick={onPause} variant="outline" size="lg" className="flex items-center gap-2">
                <Pause size={20} />
                Pausar
              </Button>
            )}
            
            <Button onClick={handleReset} variant="outline" size="lg" className="flex items-center gap-2">
              <RotateCcw size={20} />
              Resetar
            </Button>
          </div>
          
          {timeLeft === 0 && (
            <div className="mt-4 text-red-600 font-bold text-xl">
              Tempo Esgotado!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveMatchTimer;
