import { useState } from "react";
import { TennisForm } from "@/components/tennis-form";
import { MatchDisplay } from "@/components/match-display";
import { TennisMatch } from "@/lib/tennis-model";

function App() {
  const [match, setMatch] = useState<TennisMatch | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async (params: {
    pAWinPointOnServe: number;
    pAWinPointReturningServe: number;
    startingServer: 'a' | 'b';
  }) => {
    setIsSimulating(true);

    // Run the simulation asynchronously to prevent UI freezing
    setTimeout(() => {
      try {
        const newMatch = new TennisMatch(
          params.pAWinPointOnServe,
          params.pAWinPointReturningServe,
          params.startingServer
        );
        newMatch.playTennis();
        setMatch(newMatch);
      } finally {
        setIsSimulating(false);
      }
    }, 0);
  };

  const handleReset = () => {
    setMatch(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <TennisForm
        onSimulate={handleSimulate}
        isSimulating={isSimulating}
        onReset={handleReset}
      />
      
      {isSimulating ? (
        <div className="text-center p-8">
          <p className="text-lg">Simulating tennis match...</p>
        </div>
      ) : (
        <MatchDisplay match={match} />
      )}
    </div>
  );
}

export default App;