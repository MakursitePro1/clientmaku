import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

const COLS = 10;
const ROWS = 20;
type Cell = string | null;

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });

  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const getWinner = (b: (string|null)[]) => {
    for (const [a, bb, c] of lines) {
      if (b[a] && b[a] === b[bb] && b[a] === b[c]) return b[a];
    }
    return null;
  };

  const winner = getWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const click = (i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = isX ? "X" : "O";
    setBoard(next);
    const w = getWinner(next);
    if (w) setScores(s => ({ ...s, [w.toLowerCase()]: s[w.toLowerCase() as "x"|"o"] + 1 }));
    else if (next.every(Boolean)) setScores(s => ({ ...s, draw: s.draw + 1 }));
    setIsX(!isX);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setIsX(true); };

  const winLine = winner ? lines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]) : null;

  return (
    <ToolLayout title="Tic Tac Toe" description="Classic Tic Tac Toe game for two players">
      <div className="space-y-4 max-w-xs mx-auto text-center">
        <div className="flex justify-between items-center">
          <span className="text-sm">❌ X: <span className="font-bold">{scores.x}</span></span>
          <span className="text-sm">Draw: <span className="font-bold">{scores.draw}</span></span>
          <span className="text-sm">⭕ O: <span className="font-bold">{scores.o}</span></span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <button key={i} onClick={() => click(i)}
              className={`h-24 rounded-xl text-4xl font-bold flex items-center justify-center transition-all
                ${cell ? "bg-accent/50" : "bg-accent/20 hover:bg-accent/40"}
                ${winLine?.includes(i) ? "bg-primary/20 border-2 border-primary" : "border border-border"}
                ${cell === "X" ? "text-primary" : "text-destructive"}`}>
              {cell}
            </button>
          ))}
        </div>
        {(winner || isDraw) ? (
          <div className="space-y-2">
            <p className="text-xl font-bold">{winner ? `${winner === "X" ? "❌" : "⭕"} ${winner} Wins!` : "🤝 It's a Draw!"}</p>
            <Button onClick={reset} className="gradient-bg text-primary-foreground rounded-xl">Play Again</Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Turn: {isX ? "❌ X" : "⭕ O"}</p>
        )}
        <Button onClick={() => { reset(); setScores({ x: 0, o: 0, draw: 0 }); }} variant="outline" size="sm" className="rounded-xl">Reset Scores</Button>
      </div>
    </ToolLayout>
  );
}
