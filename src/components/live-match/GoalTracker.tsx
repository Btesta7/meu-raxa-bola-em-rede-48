
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
}

export const GoalTracker = ({
  teamA,
  teamB,
  onGoalScored,
  pendingAssist,
  onAssistAdded
}: GoalTrackerProps) => {
  if (pendingAssist.isWaiting && pendingAssist.goalEvent) {
    const goalTeam = pendingAssist.goalEvent.teamId === teamA.id ? teamA : teamB;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-orange-500">
        <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">
          MARCAR ASSISTÊNCIA
        </h3>
        
        <div className="text-center mb-4">
          <p className="text-lg">
            Gol de <strong>{pendingAssist.goalEvent.playerName}</strong> ({goalTeam.name})
          </p>
          <p className="text-sm text-gray-600">Quem deu a assistência?</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-2 text-center" style={{ color: goalTeam.color === '#FFFFFF' ? '#000' : goalTeam.color }}>
              {goalTeam.name}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {goalTeam.players
                .filter(player => player.id !== pendingAssist.goalEvent?.playerId)
                .map((player) => (
                <Button
                  key={player.id}
                  onClick={() => onAssistAdded(player)}
                  className="p-3 text-sm font-medium bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300"
                >
                  {player.name}
                  {player.number && <span className="block text-xs">#{player.number}</span>}
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
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-500">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
        MARCAR GOL
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xl font-semibold mb-4 text-center" style={{ color: teamA.color === '#FFFFFF' ? '#000' : teamA.color }}>
            {teamA.name}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {teamA.players.map((player) => (
              <Button
                key={player.id}
                onClick={() => onGoalScored(player, teamA)}
                className="p-4 text-sm font-medium bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 h-auto"
              >
                <div className="text-center">
                  <div>{player.name}</div>
                  {player.number && <div className="text-xs">#{player.number}</div>}
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4 text-center" style={{ color: teamB.color === '#FFFFFF' ? '#000' : teamB.color }}>
            {teamB.name}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {teamB.players.map((player) => (
              <Button
                key={player.id}
                onClick={() => onGoalScored(player, teamB)}
                className="p-4 text-sm font-medium bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 h-auto"
              >
                <div className="text-center">
                  <div>{player.name}</div>
                  {player.number && <div className="text-xs">#{player.number}</div>}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
