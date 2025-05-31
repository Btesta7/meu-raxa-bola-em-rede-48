
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player, Team, DEMO_PLAYERS, balancedTeamSort } from "@/types/liveMatch";
import { Shuffle, Users, Trophy } from "lucide-react";
import { useState } from "react";

interface TeamDrawProps {
  confirmedPlayers: Player[];
  onTeamsGenerated: (teams: Team[]) => void;
}

export const TeamDraw = ({ confirmedPlayers, onTeamsGenerated }: TeamDrawProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = async () => {
    setIsDrawing(true);
    
    // Simular animação de sorteio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const playersToUse = confirmedPlayers.length === 15 ? confirmedPlayers : DEMO_PLAYERS;
    const sortedTeams = balancedTeamSort(playersToUse);
    
    setTeams(sortedTeams);
    setIsDrawing(false);
  };

  const handleConfirmTeams = () => {
    onTeamsGenerated(teams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-black/20 backdrop-blur border-2 border-yellow-400">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-white flex items-center justify-center gap-4">
              <Trophy className="w-12 h-12 text-yellow-400" />
              🏆 NOSSO RACHA - ADMIN
              <Trophy className="w-12 h-12 text-yellow-400" />
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Jogadores Confirmados */}
        <Card className="bg-white/10 backdrop-blur border-2 border-green-400">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-2">
              <Users className="w-8 h-8 text-green-400" />
              JOGADORES CONFIRMADOS ({confirmedPlayers.length === 15 ? '15' : 'DEMO - 15'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {(confirmedPlayers.length === 15 ? confirmedPlayers : DEMO_PLAYERS).map((player) => (
                <div key={player.id} className="flex items-center gap-2 p-3 bg-green-500/20 rounded-lg border border-green-400">
                  <span className="text-green-400 text-xl">✅</span>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Button
                onClick={handleDraw}
                disabled={isDrawing || teams.length > 0}
                className="px-8 py-4 text-xl font-bold bg-yellow-600 hover:bg-yellow-700 text-black border-2 border-yellow-400"
              >
                {isDrawing ? (
                  <>
                    <Shuffle className="w-6 h-6 mr-2 animate-spin" />
                    SORTEANDO...
                  </>
                ) : (
                  <>
                    <Shuffle className="w-6 h-6 mr-2" />
                    🎲 SORTEAR TIMES
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Times Sorteados */}
        {teams.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card 
                  key={team.id} 
                  className="border-4 transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: team.color,
                    background: `linear-gradient(135deg, ${team.color}20, ${team.secondaryColor}20)`,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <CardHeader className="text-center pb-2">
                    <CardTitle 
                      className="text-2xl font-bold flex items-center justify-center gap-2"
                      style={{ color: team.color === '#FFFFFF' ? '#000' : team.color }}
                    >
                      <span className="text-3xl">{team.logo}</span>
                      {team.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {team.players.map((player, index) => (
                        <div 
                          key={player.id}
                          className="p-2 rounded-lg bg-white/10 backdrop-blur text-white font-medium"
                        >
                          {player.name}
                          {player.skillLevel && (
                            <span className="float-right text-yellow-400">
                              {'⭐'.repeat(player.skillLevel)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={handleConfirmTeams}
                className="px-12 py-6 text-2xl font-bold bg-green-600 hover:bg-green-700 text-white border-2 border-green-400"
              >
                ⚽ INICIAR PRIMEIRO JOGO
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
