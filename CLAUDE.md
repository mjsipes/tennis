# Tennis Probability Model - Implementation Plan

## Overview
Create a single-page application that allows users to interact with a tennis probability model similar to the one in the Jupyter notebook. Users can input parameters like serve probabilities and the application will simulate a tennis match and display the results.

## Model Implementation
1. Convert the Python `MatchState` class to TypeScript
2. Implement the core simulation logic:
   - Point simulation
   - Game simulation (including deuce)
   - Set simulation (including tiebreakers)
   - Match simulation
3. Implement probability prediction functions
4. Track match history for display

## UI Components to Create with shadcn
1. Input form for:
   - Player A's probability of winning a point on serve
   - Player A's probability of winning a point on return
   - Starting server selection
   - Optional: Match format (best of 3 or 5 sets)
2. Control buttons:
   - Simulate match
   - Reset simulation
3. Results display:
   - Match summary (score)
   - Detailed point-by-point log using shadcn table

## Development Steps
1. Set up the model in TypeScript
2. Create the form components
3. Create the results display components
4. Connect everything together in App.tsx
5. Add basic styling

## Files to Create
- `src/lib/tennis-model.ts` - Core simulation logic
- `src/components/tennis-form.tsx` - Input form
- `src/components/match-display.tsx` - Results display
- Update `App.tsx` to use these components