
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Team, TEAMS } from "@/types/liveMatch";

interface TeamSelectionProps {
  teamA: Team | null;
  teamB: Team | null;
  onTeamASelect: (team: Team) => void;
  onTeamBSelect: (team: Team) => void;
  onStartMatch: () => void;
}

export const TeamSelection = ({
  teamA,
  teamB,
  onTeamASelect,
  onTeamBSelect,
  onStartMatch
}: TeamSelectionProps) => {
  const availableTeamsForB = Object.values(TEAMS).filter(team => team.id !== teamA?.id);
  const availableTeamsForA = Object.values(TEAMS).filter(team => team.id !== teamB?.id);
  
  const canStartMatch = teamA && teamB && teamA.id !== teamB.id;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-500">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        NOSSO RACHA - MESÁRIO
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium mb-2 text-gray-700">Time A</label>
          <Select value={teamA?.id || ""} onValueChange={(value) => onTeamASelect(TEAMS[value])}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o Time A" />
            </SelectTrigger>
            <SelectContent>
              {availableTeamsForA.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border" 
                      style={{ backgroundColor: team.color, borderColor: team.color === '#FFFFFF' ? '#ccc' : team.color }}
                    />
                    {team.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-2xl font-bold text-gray-600">VS</div>

        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium mb-2 text-gray-700">Time B</label>
          <Select value={teamB?.id || ""} onValueChange={(value) => onTeamBSelect(TEAMS[value])}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o Time B" />
            </SelectTrigger>
            <SelectContent>
              {availableTeamsForB.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border" 
                      style={{ backgroundColor: team.color, borderColor: team.color === '#FFFFFF' ? '#ccc' : team.color }}
                    />
                    {team.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {teamA && teamB && (
        <div className="text-center mb-4">
          <div className="text-lg font-semibold text-gray-800">
            <span style={{ color: teamA.color === '#FFFFFF' ? '#000' : teamA.color }}>
              {teamA.name}
            </span>
            {" vs "}
            <span style={{ color: teamB.color === '#FFFFFF' ? '#000' : teamB.color }}>
              {teamB.name}
            </span>
          </div>
        </div>
      )}

      <div className="text-center">
        <Button 
          onClick={onStartMatch}
          disabled={!canStartMatch}
          className="px-8 py-3 text-lg font-bold bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
        >
          {canStartMatch ? "INICIAR PARTIDA" : "Selecione os times"}
        </Button>
      </div>
    </div>
  );
};
