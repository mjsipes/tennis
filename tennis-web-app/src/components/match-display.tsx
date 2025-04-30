import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { TennisMatch } from "@/lib/tennis-model";

interface MatchDisplayProps {
  match: TennisMatch | null;
}

export function MatchDisplay({ match }: MatchDisplayProps) {
  if (!match || match.matchHistory.length === 0) {
    return null;
  }

  const formatPercentage = (value: number): string => {
    return (value * 100).toFixed(2) + "%";
  };

  const formatProbabilityWithColor = (value: number): { text: string; color: string } => {
    const formattedValue = formatPercentage(value);
    if (value > 0.5) return { text: formattedValue, color: "text-green-600" };
    if (value < 0.5) return { text: formattedValue, color: "text-red-600" };
    return { text: formattedValue, color: "" };
  };

  const formatDeltaWithColor = (value: number): { text: string; color: string } => {
    const formattedValue = (value * 100).toFixed(4) + "%";
    if (value > 0) return { text: formattedValue, color: "text-green-600" };
    if (value < 0) return { text: formattedValue, color: "text-red-600" };
    return { text: formattedValue, color: "" };
  };

  // Get the final result
  const winner = match.winner;
  const finalScore = `${match.aSets}-${match.bSets}`;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-xl font-semibold">Match Result</h3>
        <p className="text-lg">
          Winner: {winner === 'a' ? 'Player A' : winner === 'b' ? 'Player B' : 'Tie'}
        </p>
        <p className="text-lg">Score: {finalScore}</p>
      </div>

      <div className="overflow-x-auto">
        <Table className="text-2xs">
          <TableCaption className="text-xs">Match point-by-point history</TableCaption>
          <TableHeader>
            <TableRow className="text-2xs">
              <TableHead>Pt</TableHead>
              <TableHead>Sets</TableHead>
              <TableHead>Games</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>P(A Match)</TableHead>
              <TableHead>P(B Match)</TableHead>
              <TableHead>P(A Set)</TableHead>
              <TableHead>P(B Set)</TableHead>
              <TableHead>P(A Game)</TableHead>
              <TableHead>P(B Game)</TableHead>
              <TableHead>Server</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Δ P(A)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {match.matchHistory.map((entry) => {
              const pAWinMatch = formatProbabilityWithColor(entry.pAWinMatch);
              const pBWinMatch = formatProbabilityWithColor(entry.pBWinMatch);
              const pAWinSet = formatProbabilityWithColor(entry.pAWinSet);
              const pBWinSet = formatProbabilityWithColor(entry.pBWinSet);
              const pAWinGame = formatProbabilityWithColor(entry.pAWinGame);
              const pBWinGame = formatProbabilityWithColor(entry.pBWinGame);
              const dPAWinMatch = formatDeltaWithColor(entry.dPAWinMatch);

              return (
                <TableRow key={entry.pointId} className="text-2xs">
                  <TableCell>{entry.pointId}</TableCell>
                  <TableCell>{`${entry.aSets}-${entry.bSets}`}</TableCell>
                  <TableCell>{`${entry.aGames}-${entry.bGames}`}</TableCell>
                  <TableCell>{`${entry.aPoints}-${entry.bPoints}`}</TableCell>
                  <TableCell className={pAWinMatch.color}>{pAWinMatch.text}</TableCell>
                  <TableCell className={pBWinMatch.color}>{pBWinMatch.text}</TableCell>
                  <TableCell className={pAWinSet.color}>{pAWinSet.text}</TableCell>
                  <TableCell className={pBWinSet.color}>{pBWinSet.text}</TableCell>
                  <TableCell className={pAWinGame.color}>{pAWinGame.text}</TableCell>
                  <TableCell className={pBWinGame.color}>{pBWinGame.text}</TableCell>
                  <TableCell>{entry.server === 'a' ? 'A' : 'B'}</TableCell>
                  <TableCell>{entry.message}</TableCell>
                  <TableCell className={dPAWinMatch.color}>{dPAWinMatch.text}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}