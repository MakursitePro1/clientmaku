import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

type Grid = number[][];

const SIZE = 4;

const emptyGrid = (): Grid => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const addRandom = (grid: Grid): Grid => {
  const g = grid.map(r => [...r]);
  const empty: [number, number][] = [];
  g.forEach((r, i) => r.forEach((c, j) => { if (c === 0) empty.push([i, j]); }));
  if (empty.length === 0) return g;
  const [ri, ci] = empty[Math.floor(Math.random() * empty.length)];
  g[ri][ci] = Math.random() < 0.9 ? 2 : 4;
  return g;
};

const slide = (row: number[]): { newRow: number[]; sc: number } => {
  let sc = 0;
  const filtered = row.filter(v => v !== 0);
  const merged: number[] = [];
  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      sc += filtered[i] * 2;
      i++;
    } else merged.push(filtered[i]);
  }
  while (merged.length < SIZE) merged.push(0);
  return { newRow: merged, sc };
};

const moveLeft = (grid: Grid): { grid: Grid; score: number } => {
  let score = 0;
  const newGrid = grid.map(row => { const { newRow, sc } = slide(row); score += sc; return newRow; });
  return { grid: newGrid, score };
};

const rotate90 = (g: Grid): Grid => g[0].map((_, i) => g.map(r => r[i]).reverse());

const move = (grid: Grid, dir: string): { grid: Grid; score: number } => {
  let g = grid.map(r => [...r]);
  let rotations = dir === "left" ? 0 : dir === "down" ? 1 : dir === "right" ? 2 : 3;
  for (let i = 0; i < rotations; i++) g = rotate90(g);
  const result = moveLeft(g);
  g = result.grid;
  for (let i = 0; i < (4 - rotations) % 4; i++) g = rotate90(g);
  return { grid: g, score: result.score };
};

const hasMovesLeft = (grid: Grid): boolean => {
  for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE; j++) {
    if (grid[i][j] === 0) return true;
    if (j < SIZE - 1 && grid[i][j] === grid[i][j + 1]) return true;
    if (i < SIZE - 1 && grid[i][j] === grid[i + 1][j]) return true;
  }
  return false;
};

const COLORS: Record<number, string> = {
  0: "bg-muted/30", 2: "bg-amber-100 text-amber-900", 4: "bg-amber-200 text-amber-900",
  8: "bg-orange-300 text-white", 16: "bg-orange-400 text-white", 32: "bg-orange-500 text-white",
  64: "bg-red-400 text-white", 128: "bg-yellow-400 text-white", 256: "bg-yellow-500 text-white",
  512: "bg-yellow-600 text-white", 1024: "bg-yellow-700 text-white", 2048: "bg-yellow-800 text-white",
};

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => addRandom(addRandom(emptyGrid())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("2048-best") || 0));
  const [gameOver, setGameOver] = useState(false);

  const handleMove = useCallback((dir: string) => {
    if (gameOver) return;
    setGrid(prev => {
      const result = move(prev, dir);
      const same = prev.every((r, i) => r.every((c, j) => c === result.grid[i][j]));
      if (same) return prev;
      const newGrid = addRandom(result.grid);
      setScore(s => {
        const ns = s + result.score;
        if (ns > best) { setBest(ns); localStorage.setItem("2048-best", String(ns)); }
        return ns;
      });
      if (!hasMovesLeft(newGrid)) setGameOver(true);
      return newGrid;
    });
  }, [gameOver, best]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, string> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleMove]);

  const reset = () => { setGrid(addRandom(addRandom(emptyGrid()))); setScore(0); setGameOver(false); };

  return (
    <ToolLayout title="2048 Game" description="Slide tiles to reach 2048">
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <div className="bg-accent/50 rounded-xl px-4 py-2 text-center"><p className="text-[10px] text-muted-foreground">Score</p><p className="font-bold text-lg">{score}</p></div>
            <div className="bg-accent/50 rounded-xl px-4 py-2 text-center"><p className="text-[10px] text-muted-foreground">Best</p><p className="font-bold text-lg">{best}</p></div>
          </div>
          <Button onClick={reset} variant="outline" className="rounded-xl">New Game</Button>
        </div>
        <div className="grid grid-cols-4 gap-2 bg-muted/50 rounded-2xl p-3">
          {grid.flat().map((val, idx) => (
            <div key={idx} className={`aspect-square rounded-xl flex items-center justify-center font-bold text-lg transition-all ${COLORS[val] || "bg-purple-500 text-white"}`}>
              {val > 0 ? val : ""}
            </div>
          ))}
        </div>
        {gameOver && <div className="text-center p-4 bg-destructive/10 rounded-xl border border-destructive/20"><p className="text-lg font-bold text-destructive">Game Over!</p><Button onClick={reset} className="mt-2">Play Again</Button></div>}
        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          <div /><Button variant="outline" size="sm" onClick={() => handleMove("up")}>↑</Button><div />
          <Button variant="outline" size="sm" onClick={() => handleMove("left")}>←</Button>
          <Button variant="outline" size="sm" onClick={() => handleMove("down")}>↓</Button>
          <Button variant="outline" size="sm" onClick={() => handleMove("right")}>→</Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">Use arrow keys or buttons to play</p>
      </div>
    </ToolLayout>
  );
}
