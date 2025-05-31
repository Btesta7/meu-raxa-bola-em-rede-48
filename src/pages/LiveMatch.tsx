
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import LiveMatchTimer from '@/components/live-match/LiveMatchTimer';
import GoalAssistTracker from '@/components/live-match/GoalAssistTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LiveMatchData, LiveMatchEvent, TEAMS } from '@/types/liveMatch';

const LiveMatch = () => {
  const navigate = useNavigate();
  const [selectedTeamA, setSelectedTeamA] = useState<string>('');
  const [selectedTeamB, setSelectedTeamB] = useState<string>('');
  const [matchStarted, setMatchStarted] = useState(false);
  
  const [liveMatch, setLiveMatch] = useState<LiveMatchData>({
    id: `match-${Date.now()}`,
    teamA: TEAMS.barcelona,
    teamB: TEAMS.realMadrid,
    scoreA: 0,
    scoreB: 0,
    events: [],
    duration: 420, // 7 minutes in seconds
    isActive: false,
    isPaused: false
  });

  const handleStartMatch = () => {
    if (!selectedTeamA || !selectedTeamB || selectedTeamA === selectedTeamB) {
      alert('Por favor, selecione dois times diferentes');
      return;
    }

    setLiveMatch(prev => ({
      ...prev,
      teamA: TEAMS[selectedTeamA as keyof typeof TEAMS],
      teamB: TEAMS[selectedTeamB as keyof typeof TEAMS],
      isActive: true,
      isPaused: false,
      startTime: Date.now()
    }));
    setMatchStarted(true);
  };

  const handleTimerStart = useCallback(() => {
    setLiveMatch(prev => ({
      ...prev,
      isActive: true,
      isPaused: false
    }));
  }, []);

  const handleTimerPause = useCallback(() => {
    setLiveMatch(prev => ({
      ...prev,
      isPaused: true
    }));
  }, []);

  const handleTimerReset = useCallback(() => {
    setLiveMatch(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      duration: 420
    }));
  }, []);

  const handleTimeUpdate = useCallback((timeLeft: number) => {
    setLiveMatch(prev => ({
      ...prev,
      duration: timeLeft
    }));
  }, []);

  const handleAddEvent = useCallback((eventData: Omit<LiveMatchEvent, 'id' | 'timestamp'>) => {
    const newEvent: LiveMatchEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      timestamp: Date.now()
    };

    setLiveMatch(prev => {
      const newScore = { scoreA: prev.scoreA, scoreB: prev.scoreB };
      
      if (eventData.type === 'goal') {
        if (eventData.teamId === prev.teamA.id) {
          newScore.scoreA += 1;
        } else {
          newScore.scoreB += 1;
        }
      }

      return {
        ...prev,
        events: [...prev.events, newEvent],
        ...newScore
      };
    });
  }, []);

  const getCurrentMinute = () => {
    return Math.floor((420 - liveMatch.duration) / 60);
  };

  if (!matchStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4 flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </Button>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Configurar Partida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Time A</label>
                <Select value={selectedTeamA} onValueChange={setSelectedTeamA}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o primeiro time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TEAMS).map(([key, team]) => (
                      <SelectItem key={key} value={key} disabled={key === selectedTeamB}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time B</label>
                <Select value={selectedTeamB} onValueChange={setSelectedTeamB}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o segundo time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TEAMS).map(([key, team]) => (
                      <SelectItem key={key} value={key} disabled={key === selectedTeamA}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleStartMatch} 
                className="w-full"
                disabled={!selectedTeamA || !selectedTeamB || selectedTeamA === selectedTeamB}
              >
                Iniciar Partida
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </Button>

        {/* Placar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{liveMatch.teamA.name}</h2>
                <div className="text-4xl font-bold text-blue-600 mt-2">
                  {liveMatch.scoreA}
                </div>
              </div>
              
              <div className="px-4">
                <div className="text-2xl font-bold text-gray-500">VS</div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{liveMatch.teamB.name}</h2>
                <div className="text-4xl font-bold text-red-600 mt-2">
                  {liveMatch.scoreB}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cronômetro */}
        <LiveMatchTimer
          duration={liveMatch.duration}
          isActive={liveMatch.isActive}
          isPaused={liveMatch.isPaused}
          onStart={handleTimerStart}
          onPause={handleTimerPause}
          onReset={handleTimerReset}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Tracker de Gols e Assistências */}
        <GoalAssistTracker
          teamA={liveMatch.teamA}
          teamB={liveMatch.teamB}
          onAddEvent={handleAddEvent}
          currentMinute={getCurrentMinute()}
          events={liveMatch.events}
        />
      </main>
    </div>
  );
};

export default LiveMatch;
