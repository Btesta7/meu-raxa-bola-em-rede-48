
import { Button } from "@/components/ui/button";
import { MatchEvent } from "@/types/liveMatch";
import { Undo2 } from "lucide-react";

interface EventHistoryProps {
  events: MatchEvent[];
  onUndoEvent: (eventId: string) => void;
}

export const EventHistory = ({ events, onUndoEvent }: EventHistoryProps) => {
  const canUndo = (event: MatchEvent) => {
    const now = new Date();
    const eventTime = new Date(event.timestamp);
    const diffInSeconds = (now.getTime() - eventTime.getTime()) / 1000;
    return diffInSeconds <= 30;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-500">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
        EVENTOS DA PARTIDA
      </h3>
      
      {events.length === 0 ? (
        <p className="text-center text-gray-500 italic">Nenhum evento registrado ainda</p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {events
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  <span className="font-bold text-blue-600">{event.minute}</span>
                  {" - "}
                  <span className="font-semibold">{event.playerName}</span>
                  <span className="text-gray-600"> ({event.team})</span>
                  <span className="ml-2">⚽</span>
                  {event.assistPlayerName && (
                    <span className="text-gray-600">
                      {" | Assist: "}
                      <span className="font-medium">{event.assistPlayerName}</span>
                    </span>
                  )}
                  {event.type === 'goal' && !event.assistPlayerName && (
                    <span className="text-gray-500"> | Sem assist</span>
                  )}
                </div>
              </div>
              
              {canUndo(event) && (
                <Button
                  onClick={() => onUndoEvent(event.id)}
                  size="sm"
                  variant="outline"
                  className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Undo2 className="w-4 h-4 mr-1" />
                  Desfazer
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
