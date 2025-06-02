import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/types/liveMatch";
import { Trophy, Calendar, MapPin, Users } from "lucide-react";
import { useMatchContext } from "@/contexts/MatchContext";
import { useState, useEffect } from "react";
import { Match } from "@/types/match";
import { toast } from "sonner";

interface MatchSelectionProps {
  teams: Team[];
  onMatchStart: (teamA: Team, teamB: Team, waitingTeam: Team) => void;
}

export const MatchSelection = ({ teams, onMatchStart }: MatchSelectionProps) => {
  const { matches } = useMatchContext();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [availableMatches, setAvailableMatches] = useState<Match[]>([]);

  // Filtrar partidas ativas com jogadores suficientes
  useEffect(() => {
    if (matches && matches.length > 0) {
      const activeMatches = matches.filter(
        match => match.status === 'scheduled' && match.confirmedPlayers.length >= 6
      );
      setAvailableMatches(activeMatches);
      
      if (activeMatches.length > 0 && !selectedMatch) {
        setSelectedMatch(activeMatches[0]);
      }
    }
  }, [matches, selectedMatch]);

  const handleStartMatch = () => {
    if (teams.length < 3) {
      toast.error("É necessário ter 3 times para iniciar uma partida");
      return;
    }

    // Sortear aleatoriamente a ordem dos times
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    
    onMatchStart(
      shuffledTeams[0],
      shuffledTeams[1],
      shuffledTeams[2]
    );
    
    toast.success("Partida iniciada!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-black/20 backdrop-blur border-2 border-yellow-400">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-white flex items-center justify-center gap-4">
              <Trophy className="w-12 h-12 text-yellow-400" />
              🏆 SELEÇÃO DE PARTIDA
              <Trophy className="w-12 h-12 text-yellow-400" />
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Partidas Disponíveis */}
        {availableMatches.length > 0 && (
          <Card className="bg-white/10 backdrop-blur border-2 border-blue-400">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">
                PARTIDAS DISPONÍVEIS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableMatches.map((match) => (
                  <div 
                    key={match.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedMatch?.id === match.id 
                        ? 'bg-blue-500/30 border-2 border-blue-400' 
                        : 'bg-white/10 border border-white/20 hover:bg-white/20'
                    }`}
                    onClick={() => setSelectedMatch(match)}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{match.title || `Partida ${match.id}`}</h3>
                    <div className="flex items-center gap-2 text-gray-200 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>{match.date} às {match.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>{match.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                      <Users className="w-4 h-4" />
                      <span>{match.confirmedPlayers.length} jogadores confirmados</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Times Sorteados */}
        <Card className="bg-white/10 backdrop-blur border-2 border-green-400">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">
              TIMES SORTEADOS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card 
                  key={team.id} 
                  className="border-4"
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
                      {team.players.map((player) => (
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
          </CardContent>
        </Card>

        {/* Botão de Iniciar */}
        <div className="text-center">
          <Button
            onClick={handleStartMatch}
            className="px-12 py-6 text-2xl font-bold bg-green-600 hover:bg-green-700 text-white border-2 border-green-400"
            disabled={teams.length < 3}
          >
            ⚽ INICIAR PARTIDA
          </Button>
          {teams.length < 3 && (
            <p className="text-red-300 mt-2">
              É necessário ter 3 times para iniciar uma partida
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
