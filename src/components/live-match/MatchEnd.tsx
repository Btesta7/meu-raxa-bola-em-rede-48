
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team, MatchEvent, CompletedMatch } from "@/types/liveMatch";
import { Trophy, Target, Clock, RotateCcw } from "lucide-react";

interface MatchEndProps {
  completedMatch: CompletedMatch;
  nextMatch: { teamA: Team; teamB: Team; waitingTeam: Team } | null;
  onStartNextMatch: () => void;
  onBackToSelection: () => void;
}

export const MatchEnd = ({ 
  completedMatch, 
  nextMatch, 
  onStartNextMatch, 
  onBackToSelection 
}: MatchEndProps) => {
  const { teamA, teamB, winner, finalScore, events, duration } = completedMatch;
  
  // Calcular estatísticas
  const goals = events.filter(e => e.type === 'goal');
  const assists = events.filter(e => e.type === 'goal' && e.assistPlayerName);
  
  const goalScorers = goals.reduce((acc, goal) => {
    acc[goal.playerName] = (acc[goal.playerName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const assisters = assists.reduce((acc, assist) => {
    if (assist.assistPlayerName) {
      acc[assist.assistPlayerName] = (acc[assist.assistPlayerName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}seg`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-green-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header de Vitória */}
        <Card className="bg-gradient-to-r from-yellow-500/20 to-green-500/20 backdrop-blur border-4 border-yellow-400">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-white flex items-center justify-center gap-4">
              <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
              🏆 PARTIDA FINALIZADA
              <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Resultado Final */}
        <Card className="bg-black/20 backdrop-blur border-2 border-white/20">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{teamA.logo}</span>
                  <div>
                    <h3 
                      className="text-2xl font-bold"
                      style={{ color: teamA.color === '#FFFFFF' ? '#fff' : teamA.color }}
                    >
                      {teamA.shortName}
                    </h3>
                    <p className="text-gray-300">{teamA.name}</p>
                  </div>
                  <div 
                    className="text-6xl font-black"
                    style={{ color: winner.id === teamA.id ? '#fbbf24' : '#fff' }}
                  >
                    {finalScore.teamA}
                  </div>
                </div>

                <div className="text-4xl font-bold text-white">×</div>

                <div className="flex items-center gap-4 flex-row-reverse">
                  <span className="text-6xl">{teamB.logo}</span>
                  <div className="text-right">
                    <h3 
                      className="text-2xl font-bold"
                      style={{ color: teamB.color === '#FFFFFF' ? '#fff' : teamB.color }}
                    >
                      {teamB.shortName}
                    </h3>
                    <p className="text-gray-300">{teamB.name}</p>
                  </div>
                  <div 
                    className="text-6xl font-black"
                    style={{ color: winner.id === teamB.id ? '#fbbf24' : '#fff' }}
                  >
                    {finalScore.teamB}
                  </div>
                </div>
              </div>

              <div className="text-3xl font-bold text-yellow-400 animate-pulse">
                🎉 {winner.name.toUpperCase()} VENCEU! 🎉
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card className="bg-white/10 backdrop-blur border-2 border-blue-400">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-2">
              📊 ESTATÍSTICAS DA PARTIDA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Artilheiros */}
            {Object.keys(goalScorers).length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  ⚽ Artilheiros:
                </h4>
                <div className="space-y-2">
                  {Object.entries(goalScorers)
                    .sort(([,a], [,b]) => b - a)
                    .map(([player, goals]) => (
                    <div key={player} className="flex justify-between items-center p-2 bg-green-500/20 rounded">
                      <span className="text-white font-medium">{player}</span>
                      <span className="text-green-400 font-bold">{goals} gol{goals > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assistências */}
            {Object.keys(assisters).length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-3">
                  🅰️ Assistências:
                </h4>
                <div className="space-y-2">
                  {Object.entries(assisters)
                    .sort(([,a], [,b]) => b - a)
                    .map(([player, assists]) => (
                    <div key={player} className="flex justify-between items-center p-2 bg-blue-500/20 rounded">
                      <span className="text-white font-medium">{player}</span>
                      <span className="text-blue-400 font-bold">{assists} assist{assists > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duração */}
            <div className="flex items-center justify-center gap-2 p-3 bg-purple-500/20 rounded">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">
                ⏱️ Duração: {formatDuration(420 - duration)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Próxima Partida ou Ações */}
        <Card className="bg-white/10 backdrop-blur border-2 border-green-400">
          <CardContent className="p-6">
            {nextMatch ? (
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  PRÓXIMA PARTIDA:
                </h3>
                <div className="text-xl text-green-400 font-semibold">
                  <span className="text-2xl">{nextMatch.teamA.logo}</span>
                  {" "}{nextMatch.teamA.name} vs {nextMatch.teamB.name}{" "}
                  <span className="text-2xl">{nextMatch.teamB.logo}</span>
                </div>
                <p className="text-gray-300">
                  Time esperando: <span className="text-2xl">{nextMatch.waitingTeam.logo}</span> {nextMatch.waitingTeam.name}
                </p>
                <Button
                  onClick={onStartNextMatch}
                  className="px-12 py-6 text-2xl font-bold bg-green-600 hover:bg-green-700 text-white border-2 border-green-400"
                >
                  🎮 INICIAR PRÓXIMA PARTIDA
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Button
                  onClick={onBackToSelection}
                  className="px-8 py-4 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400"
                >
                  <RotateCcw className="w-6 h-6 mr-2" />
                  NOVA SELEÇÃO DE TIMES
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
