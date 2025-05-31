
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/types/liveMatch";
import { useState } from "react";

interface MatchSelectionProps {
  teams: Team[];
  onMatchStart: (teamA: Team, teamB: Team, waitingTeam: Team) => void;
}

export const MatchSelection = ({ teams, onMatchStart }: MatchSelectionProps) => {
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

  const handleTeamSelect = (team: Team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter(t => t.id !== team.id));
    } else if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const handleStartMatch = () => {
    if (selectedTeams.length === 2) {
      const waitingTeam = teams.find(t => !selectedTeams.includes(t))!;
      onMatchStart(selectedTeams[0], selectedTeams[1], waitingTeam);
    }
  };

  const getWaitingTeam = () => {
    return teams.find(t => !selectedTeams.includes(t));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        
        {/* Header */}
        <Card className="bg-black/20 backdrop-blur border-2 border-blue-400">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-white">
              🎮 SELECIONAR PARTIDA
            </CardTitle>
            <p className="text-xl text-blue-300 mt-2">
              Escolha os times para jogar
            </p>
          </CardHeader>
        </Card>

        {/* Seleção de Times */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center text-white">
            ESCOLHA OS TIMES PARA JOGAR
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.slice(0, 2).map((team) => {
              const isSelected = selectedTeams.includes(team);
              return (
                <Card
                  key={team.id}
                  className={`cursor-pointer transition-all duration-300 border-4 ${
                    isSelected 
                      ? 'scale-105 shadow-2xl shadow-green-500/50' 
                      : 'hover:scale-102'
                  }`}
                  style={{
                    borderColor: isSelected ? '#00ff88' : team.color,
                    background: `linear-gradient(135deg, ${team.color}30, ${team.secondaryColor}30)`,
                    backdropFilter: 'blur(10px)'
                  }}
                  onClick={() => handleTeamSelect(team)}
                >
                  <CardHeader className="text-center">
                    <CardTitle 
                      className="text-2xl font-bold flex items-center justify-center gap-2"
                      style={{ color: team.color === '#FFFFFF' ? '#000' : team.color }}
                    >
                      <span className="text-4xl">{team.logo}</span>
                      {team.name}
                    </CardTitle>
                    <p className="text-lg text-white">{team.players.length} jogadores</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {team.players.map((player) => (
                        <div key={player.id} className="text-white/80 text-center">
                          {player.name}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Time Esperando */}
          {teams.length > 2 && (
            <div className="text-center">
              <Card className="max-w-md mx-auto bg-gray-600/30 backdrop-blur border-2 border-gray-400">
                <CardHeader>
                  <CardTitle 
                    className="text-xl font-bold flex items-center justify-center gap-2"
                    style={{ color: teams[2].color === '#FFFFFF' ? '#000' : teams[2].color }}
                  >
                    <span className="text-3xl">{teams[2].logo}</span>
                    {teams[2].name}
                  </CardTitle>
                  <p className="text-yellow-300 font-semibold">(ESPERANDO)</p>
                  <p className="text-gray-300">{teams[2].players.length} jogadores</p>
                </CardHeader>
              </Card>
            </div>
          )}
        </div>

        {/* Botão Iniciar */}
        <div className="text-center">
          <Button
            onClick={handleStartMatch}
            disabled={selectedTeams.length !== 2}
            className="px-12 py-6 text-2xl font-bold bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white border-2 border-green-400"
          >
            ⚽ COMEÇAR JOGO AO VIVO
          </Button>
          
          {selectedTeams.length !== 2 && (
            <p className="text-yellow-300 mt-4 text-lg">
              Selecione exatamente 2 times para iniciar a partida
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
