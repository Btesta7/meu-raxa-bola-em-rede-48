
import { Button } from "@/components/ui/button";
import { Team, Player, MatchEvent } from "@/types/liveMatch";

interface GoalTrackerProps {
  teamA: Team;
  teamB: Team;
  onGoalScored: (player: Player, team: Team) => void;
  pendingAssist: {
    goalEvent: MatchEvent | null;
    isWaiting: boolean;
  };
  onAssistAdded: (assistPlayer: Player | null) => void;
  scoreA: number;
  scoreB: number;
  winner: Team | null;
}

export const GoalTracker = ({
  teamA,
  teamB,
  onGoalScored,
  pendingAssist,
  onAssistAdded,
  scoreA,
  scoreB,
  winner
}: GoalTrackerProps) => {
  // Não permitir marcar gols se já houver um vencedor
  if (winner) {
    return (
      <div className="bg-gradient-to-r from-yellow-500/20 to-green-500/20 p-6 rounded-lg shadow-lg border-2 border-yellow-400">
        <h3 className="text-3xl font-bold text-center mb-4 text-yellow-400">
          🏆 PARTIDA FINALIZADA 🏆
        </h3>
        <div className="text-center text-2xl font-bold text-white">
          {winner.name} venceu por {scoreA > scoreB ? `${scoreA} x ${scoreB}` : `${scoreB} x ${scoreA}`}!
        </div>
      </div>
    );
  }

  if (pendingAssist.isWaiting && pendingAssist.goalEvent) {
    const goalTeam = pendingAssist.goalEvent.teamId === teamA.id ? teamA : teamB;
    
    return (
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg shadow-lg border-2 border-orange-500">
        <h3 className="text-2xl font-bold text-center mb-4 text-white">
          👏 MARCAR ASSISTÊNCIA
        </h3>
        
        <div className="text-center mb-4">
          <p className="text-lg text-white">
            Gol de <strong className="text-green-400">{pendingAssist.goalEvent.playerName}</strong> ({goalTeam.name})
          </p>
          <p className="text-sm text-gray-300">Quem deu a assistência?</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 
              className="text-lg font-semibold mb-3 text-center"
              style={{ color: goalTeam.color === '#FFFFFF' ? '#fff' : goalTeam.color }}
            >
              <span className="text-2xl mr-2">{goalTeam.logo}</span>
              {goalTeam.name}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {goalTeam.players
                .filter(player => player.id !== pendingAssist.goalEvent?.playerId)
                .map((player) => (
                <Button
                  key={player.id}
                  onClick={() => onAssistAdded(player)}
                  className="p-3 text-sm font-medium bg-blue-600/80 hover:bg-blue-700 text-white border border-blue-400 h-auto"
                >
                  <div className="text-center">
                    <div>{player.name}</div>
                    {player.number && <div className="text-xs opacity-75">#{player.number}</div>}
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <Button
              onClick={() => onAssistAdded(null)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white"
            >
              SEM ASSISTÊNCIA
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur p-6 rounded-lg shadow-lg border-2 border-green-500">
      <h3 className="text-2xl font-bold text-center mb-6 text-white">
        🎯 MARCAR GOL
      </h3>
      
      {/* Indicador de Placar Atual */}
      <div className="text-center mb-6 p-4 bg-black/30 rounded-lg">
        <div className="text-lg text-gray-300 mb-2">Placar Atual</div>
        <div className="text-3xl font-bold text-white">
          <span style={{ color: teamA.color === '#FFFFFF' ? '#fff' : teamA.color }}>
            {teamA.shortName} {scoreA}
          </span>
          <span className="mx-4">×</span>
          <span style={{ color: teamB.color === '#FFFFFF' ? '#fff' : teamB.color }}>
            {scoreB} {teamB.shortName}
          </span>
        </div>
        <div className="text-yellow-400 text-sm mt-2 font-semibold">
          ⚽ Primeiro a 2 gols vence!
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time A */}
        <div 
          className="p-4 rounded-lg border-2"
          style={{ 
            borderColor: teamA.color,
            background: `linear-gradient(135deg, ${teamA.color}20, ${teamA.secondaryColor}20)`
          }}
        >
          <h4 
            className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2"
            style={{ color: teamA.color === '#FFFFFF' ? '#fff' : teamA.color }}
          >
            <span className="text-2xl">{teamA.logo}</span>
            {teamA.name}
            <span className="text-2xl font-bold">({scoreA})</span>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {teamA.players.map((player) => (
              <Button
                key={player.id}
                onClick={() => onGoalScored(player, teamA)}
                className="p-4 text-sm font-medium bg-green-600/80 hover:bg-green-700 text-white border border-green-400 h-auto transition-all duration-200 hover:scale-105"
              >
                <div className="text-center w-full">
                  <div className="font-semibold">{player.name}</div>
                  {player.number && <div className="text-xs opacity-75">#{player.number}</div>}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Time B */}
        <div 
          className="p-4 rounded-lg border-2"
          style={{ 
            borderColor: teamB.color,
            background: `linear-gradient(135deg, ${teamB.color}20, ${teamB.secondaryColor}20)`
          }}
        >
          <h4 
            className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2"
            style={{ color: teamB.color === '#FFFFFF' ? '#fff' : teamB.color }}
          >
            <span className="text-2xl">{teamB.logo}</span>
            {teamB.name}
            <span className="text-2xl font-bold">({scoreB})</span>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {teamB.players.map((player) => (
              <Button
                key={player.id}
                onClick={() => onGoalScored(player, teamB)}
                className="p-4 text-sm font-medium bg-green-600/80 hover:bg-green-700 text-white border border-green-400 h-auto transition-all duration-200 hover:scale-105"
              >
                <div className="text-center w-full">
                  <div className="font-semibold">{player.name}</div>
                  {player.number && <div className="text-xs opacity-75">#{player.number}</div>}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
