
import { Team } from "@/types/liveMatch";

interface ScoreboardProps {
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
}

export const Scoreboard = ({ teamA, teamB, scoreA, scoreB }: ScoreboardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-purple-500">
      <div className="text-center">
        <div className="text-4xl font-bold mb-2">
          <span 
            className="inline-block px-4 py-2 rounded mr-2"
            style={{ 
              color: teamA.color === '#FFFFFF' ? '#000' : '#fff',
              backgroundColor: teamA.color,
              border: teamA.color === '#FFFFFF' ? '2px solid #ccc' : 'none'
            }}
          >
            {teamA.name}
          </span>
          
          <span className="text-gray-800 mx-4">
            {scoreA} x {scoreB}
          </span>
          
          <span 
            className="inline-block px-4 py-2 rounded ml-2"
            style={{ 
              color: teamB.color === '#FFFFFF' ? '#000' : '#fff',
              backgroundColor: teamB.color,
              border: teamB.color === '#FFFFFF' ? '2px solid #ccc' : 'none'
            }}
          >
            {teamB.name}
          </span>
        </div>
      </div>
    </div>
  );
};
