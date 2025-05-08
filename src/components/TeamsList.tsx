
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TeamsListProps {
  teamA: User[];
  teamB: User[];
  teamAScore?: number;
  teamBScore?: number;
}

const positionColors = {
  "Goleiro": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Defensor": "bg-blue-100 text-blue-800 border-blue-200",
  "Meio-campista": "bg-green-100 text-green-800 border-green-200",
  "Atacante": "bg-red-100 text-red-800 border-red-200"
};

const TeamsList: React.FC<TeamsListProps> = ({ teamA, teamB, teamAScore, teamBScore }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="bg-blue-50 pb-2">
          <CardTitle className="text-blue-800 text-lg flex justify-between items-center">
            <span>Time A</span>
            {teamAScore !== undefined && <Badge className="text-lg">{teamAScore}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-3">
            {teamA.map((player) => (
              <li key={player.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="flex-1">{player.name}</span>
                <Badge variant="outline" className={`font-normal ${positionColors[player.position]}`}>
                  {player.position}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="bg-red-50 pb-2">
          <CardTitle className="text-red-800 text-lg flex justify-between items-center">
            <span>Time B</span>
            {teamBScore !== undefined && <Badge className="text-lg">{teamBScore}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-3">
            {teamB.map((player) => (
              <li key={player.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="flex-1">{player.name}</span>
                <Badge variant="outline" className={`font-normal ${positionColors[player.position]}`}>
                  {player.position}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsList;
