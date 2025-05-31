
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useEffect } from "react";

interface MatchTimerProps {
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onTick: () => void;
}

export const MatchTimer = ({
  seconds,
  isRunning,
  isPaused,
  onStart,
  onPause,
  onReset,
  onTick
}: MatchTimerProps) => {
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && seconds > 0) {
      interval = setInterval(onTick, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds, onTick]);

  useEffect(() => {
    // Alerta sonoro quando o tempo acabar
    if (seconds === 0 && isRunning) {
      // Audio alert
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+PyvmwhBza9tJNkPQQnFqy7t5N6OQUxe8rw2YhNCAY8otfLvn1mNQQiY7vn26FbGAlW1jNUAAAaGF/sJRAIUGdJOQAAGhhf7CUQCFBnSTkAABoYX+wlEAhQZ0k5AAAaGF/sJRAIUGdJOQAAGhhf7CUQCFBnSTkAABoYX+wlEAhQZ0k5AAAaGF/sJRAIUGdJOQAAGhhf7CUQCFBnSTkAABoYX+wlEAhQZ0k5AAAaGF/sJRAIUGdJOQAAGhhf7CUQCFBnSTkAABoYX+wlEAhQZ0k5');
      audio.play().catch(() => {});
    }
  }, [seconds, isRunning]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeClass = seconds === 0 ? 'text-red-600 animate-pulse' : 'text-gray-800';

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-500">
      <div className="text-center">
        <div className={`text-6xl font-bold mb-4 ${timeClass}`}>
          ⏱️ {formatTime(seconds)}
        </div>
        
        <div className="flex justify-center gap-4">
          {!isRunning || isPaused ? (
            <Button
              onClick={onStart}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              <Play className="w-5 h-5 mr-2" />
              {isPaused ? 'CONTINUAR' : 'INICIAR'}
            </Button>
          ) : (
            <Button
              onClick={onPause}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
            >
              <Pause className="w-5 h-5 mr-2" />
              PAUSAR
            </Button>
          )}
          
          <Button
            onClick={onReset}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            RESETAR
          </Button>
        </div>
      </div>
    </div>
  );
};
