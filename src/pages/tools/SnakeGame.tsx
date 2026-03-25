import { useState, useEffect, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const state = useRef({ snake: [{x:5,y:5}], food: {x:10,y:10}, dir: "RIGHT" as Dir });
  const SIZE = 20;
  const COLS = 20;
  const ROWS = 20;

  const placeFood = () => {
    state.current.food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  };

  const startGame = () => {
    state.current = { snake: [{x:5,y:5}], food: {x:10,y:10}, dir: "RIGHT" };
    setScore(0);
    setGameOver(false);
    setRunning(true);
    placeFood();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT" };
      const opp: Record<string, string> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (map[e.key] && map[e.key] !== opp[state.current.dir]) {
        state.current.dir = map[e.key];
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const s = state.current;
      const head = { ...s.snake[0] };
      if (s.dir === "UP") head.y--;
      if (s.dir === "DOWN") head.y++;
      if (s.dir === "LEFT") head.x--;
      if (s.dir === "RIGHT") head.x++;

      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || s.snake.some(p => p.x === head.x && p.y === head.y)) {
        setGameOver(true);
        setRunning(false);
        setBest(b => Math.max(b, s.snake.length - 1));
        return;
      }

      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        setScore(s.snake.length - 1);
        placeFood();
      } else {
        s.snake.pop();
      }

      // Draw
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, COLS * SIZE, ROWS * SIZE);
      // Food
      ctx.fillStyle = "#e94560";
      ctx.fillRect(s.food.x * SIZE + 2, s.food.y * SIZE + 2, SIZE - 4, SIZE - 4);
      // Snake
      s.snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#6c5ce7" : "#a29bfe";
        ctx.fillRect(p.x * SIZE + 1, p.y * SIZE + 1, SIZE - 2, SIZE - 2);
      });
    }, 120);
    return () => clearInterval(interval);
  }, [running]);

  return (
    <ToolLayout title="Snake Game" description="Classic snake game — use arrow keys to play">
      <div className="space-y-3 max-w-sm mx-auto text-center">
        <div className="flex justify-between text-sm">
          <span>Score: <span className="font-bold">{score}</span></span>
          <span>Best: <span className="font-bold">{best}</span></span>
        </div>
        <canvas ref={canvasRef} width={COLS * SIZE} height={ROWS * SIZE} className="mx-auto rounded-xl border border-border" />
        {/* Mobile controls */}
        <div className="grid grid-cols-3 gap-1 w-36 mx-auto">
          <div />
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { if (state.current.dir !== "DOWN") state.current.dir = "UP"; }}>↑</Button>
          <div />
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { if (state.current.dir !== "RIGHT") state.current.dir = "LEFT"; }}>←</Button>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { if (state.current.dir !== "UP") state.current.dir = "DOWN"; }}>↓</Button>
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { if (state.current.dir !== "LEFT") state.current.dir = "RIGHT"; }}>→</Button>
        </div>
        {(gameOver || !running) && (
          <div className="space-y-2">
            {gameOver && <p className="text-lg font-bold text-destructive">Game Over! Score: {score}</p>}
            <Button onClick={startGame} className="gradient-bg text-primary-foreground rounded-xl">{gameOver ? "Play Again" : "Start Game"}</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
