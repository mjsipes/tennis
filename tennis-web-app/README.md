# Tennis Probability Model Web App

A single-page application that allows users to interact with a tennis probability model. Users can input parameters like serve probabilities and the application will simulate a tennis match and display the results.

## Features

- Input form for match parameters:
  - Player A's probability of winning a point on serve
  - Player A's probability of winning a point on return
  - Starting server selection
- Simulation of a complete tennis match
- Detailed point-by-point log with win probabilities
- Beautiful UI using shadcn components

## Technical Implementation

- TypeScript implementation of the tennis probability model
- React components for user interaction
- shadcn UI components for a clean, modern interface
- Async processing to prevent UI freezing during simulation

## How to Use

1. Set Player A's probability of winning a point on serve (between 0 and 1)
2. Set Player A's probability of winning a point on return (between 0 and 1)
3. Select which player serves first
4. Click "Simulate Match" to run the simulation
5. View the detailed results in the table below

## Running the App

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` (or the URL shown in your terminal) to view the app.

## Project Structure

- `src/lib/tennis-model.ts` - Core simulation logic
- `src/components/tennis-form.tsx` - Input form
- `src/components/match-display.tsx` - Results display
- `src/components/ui/` - shadcn UI components