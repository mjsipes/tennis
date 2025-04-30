import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectItem } from './ui/select';

export interface TennisFormProps {
  onSimulate: (params: {
    pAWinPointOnServe: number;
    pAWinPointReturningServe: number;
    startingServer: 'a' | 'b';
  }) => void;
  isSimulating: boolean;
  onReset: () => void;
}

export function TennisForm({ onSimulate, isSimulating, onReset }: TennisFormProps) {
  const [pAWinPointOnServe, setPAWinPointOnServe] = useState<string>('0.5');
  const [pAWinPointReturningServe, setPAWinPointReturningServe] = useState<string>('0.5');
  const [startingServer, setStartingServer] = useState<'a' | 'b'>('a');

  const handleSimulate = () => {
    onSimulate({
      pAWinPointOnServe: parseFloat(pAWinPointOnServe),
      pAWinPointReturningServe: parseFloat(pAWinPointReturningServe),
      startingServer
    });
  };

  return (
    <div className="h-full bg-card p-4 shadow-sm rounded-lg flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold">Tennis Match Simulator</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set the probabilities and see the match outcome
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="p-a-serve" className="text-sm">
              Player A's win probability on serve
            </Label>
            <Input
              id="p-a-serve"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={pAWinPointOnServe}
              onChange={(e) => setPAWinPointOnServe(e.target.value)}
              placeholder="Value between 0-1"
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="p-a-return" className="text-sm">
              Player A's win probability on return
            </Label>
            <Input
              id="p-a-return"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={pAWinPointReturningServe}
              onChange={(e) => setPAWinPointReturningServe(e.target.value)}
              placeholder="Value between 0-1"
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="starting-server" className="text-sm">Starting Server</Label>
            <Select
              id="starting-server"
              value={startingServer}
              onChange={(e) => setStartingServer(e.target.value as 'a' | 'b')}
              className="text-sm"
            >
              <SelectItem value="a">Player A</SelectItem>
              <SelectItem value="b">Player B</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <Button 
          onClick={handleSimulate} 
          className="w-full" 
          disabled={isSimulating}
          size="sm"
        >
          {isSimulating ? 'Simulating...' : 'Simulate Match'}
        </Button>
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="w-full"
          disabled={isSimulating}
          size="sm"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}