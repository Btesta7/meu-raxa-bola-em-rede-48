
import { Team } from "@/types/liveMatch";

interface RealisticScoreboardProps {
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  timer: { seconds: number; isRunning: boolean };
  winner: Team | null;
}

export const RealisticScoreboard = ({ 
  teamA, 
  teamB, 
  scoreA, 
  scoreB, 
  timer,
  winner 
}: RealisticScoreboardProps) => {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTeamAWinner = winner?.id === teamA.id;
  const isTeamBWinner = winner?.id === teamB.id;

  return (
    <div className="relative">
      {/* Placar Principal */}
      <div 
        className="bg-gradient-to-r from-gray-900 via-black to-gray-900 p-6 rounded-xl border-4 border-green-400 shadow-2xl"
        style={{
          boxShadow: '0 0 30px rgba(0, 255, 136, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex items-center justify-between">
          
          {/* Time A */}
          <div 
            className={`flex items-center gap-4 p-4 rounded-xl flex-1 transition-all duration-500 ${
              isTeamAWinner ? 'animate-pulse bg-yellow-500/20 border-2 border-yellow-400' : 'bg-white/5'
            }`}
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <span className="text-5xl">{teamA.logo}</span>
            <div>
              <h3 
                className="text-2xl font-bold"
                style={{ color: teamA.color === '#FFFFFF' ? '#fff' : teamA.color }}
              >
                {teamA.shortName}
              </h3>
              <p className="text-sm text-gray-300">{teamA.name}</p>
            </div>
            <div 
              className={`text-6xl font-black ml-auto transition-all duration-300 ${
                isTeamAWinner ? 'text-yellow-400 animate-bounce' : 'text-white'
              }`}
              style={{ 
                textShadow: '0 0 20px currentColor',
                fontFamily: 'Impact, sans-serif'
              }}
            >
              {scoreA}
            </div>
          </div>

          {/* Separador e Timer */}
          <div className="px-8 text-center">
            <div className="text-4xl font-bold text-white mb-2">×</div>
            
            {/* Timer */}
            <div 
              className="bg-black/70 p-3 rounded-xl border-2 border-green-400 mb-2"
              style={{ boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)' }}
            >
              <div 
                className={`text-2xl font-mono font-bold ${
                  timer.seconds <= 60 ? 'text-red-400 animate-pulse' : 'text-green-400'
                }`}
              >
                ⏱️ {formatTime(timer.seconds)}
              </div>
            </div>

            {/* Regra do Jogo */}
            <div className="text-yellow-400 text-sm font-bold">
              ⚽ PRIMEIRO A 2 GOLS VENCE!
            </div>
          </div>

          {/* Time B */}
          <div 
            className={`flex items-center gap-4 p-4 rounded-xl flex-1 flex-row-reverse transition-all duration-500 ${
              isTeamBWinner ? 'animate-pulse bg-yellow-500/20 border-2 border-yellow-400' : 'bg-white/5'
            }`}
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <span className="text-5xl">{teamB.logo}</span>
            <div className="text-right">
              <h3 
                className="text-2xl font-bold"
                style={{ color: teamB.color === '#FFFFFF' ? '#fff' : teamB.color }}
              >
                {teamB.shortName}
              </h3>
              <p className="text-sm text-gray-300">{teamB.name}</p>
            </div>
            <div 
              className={`text-6xl font-black mr-auto transition-all duration-300 ${
                isTeamBWinner ? 'text-yellow-400 animate-bounce' : 'text-white'
              }`}
              style={{ 
                textShadow: '0 0 20px currentColor',
                fontFamily: 'Impact, sans-serif'
              }}
            >
              {scoreB}
            </div>
          </div>
        </div>

        {/* Barra de Progresso Visual */}
        <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-1000"
            style={{ width: `${((420 - timer.seconds) / 420) * 100}%` }}
          />
        </div>
      </div>

      {/* Animação de Vitória */}
      {winner && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-yellow-500 text-black px-8 py-4 rounded-xl text-3xl font-black animate-bounce border-4 border-yellow-300">
            🏆 {winner.name.toUpperCase()} VENCEU! 🏆
          </div>
        </div>
      )}
    </div>
  );
};
