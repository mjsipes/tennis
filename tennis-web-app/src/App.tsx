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
    <div className="flex h-svh">
      {/* Left sidebar/navbar */}
      <div className="w-72 border-r bg-background p-4">
        <TennisForm
          onSimulate={handleSimulate}
          isSimulating={isSimulating}
          onReset={handleReset}
        />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Tennis Match Simulator</h1>
        
        {isSimulating ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg">Simulating tennis match...</p>
          </div>
        ) : match ? (
          <MatchDisplay match={match} />
        ) : (
          <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">No match simulated yet.</p>
              <p>Use the form on the left to set parameters and start a simulation.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;