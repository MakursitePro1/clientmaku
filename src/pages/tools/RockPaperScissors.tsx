import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

const choices = ["🪨 Rock", "📄 Paper", "✂️ Scissors"] as const;
type Choice = typeof choices[number];

const getResult = (player: Choice, computer: Choice): string => {
  if (player === computer) return "Draw!";
  if (
    (player === "🪨 Rock" && computer === "✂️ Scissors") ||
    (player === "📄 Paper" && computer === "🪨 Rock") ||
    (player === "✂️ Scissors" && computer === "📄 Paper")
  ) return "You Win! 🎉";
  return "You Lose! 😢";
};

export default function RockPaperScissors() {
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  const [round, setRound] = useState<{ player: Choice; computer: Choice; result: string } | null>(null);

  const play = (player: Choice) => {
    const computer = choices[Math.floor(Math.random() * 3)];
    const result = getResult(player, computer);
    setRound({ player, computer, result });
    setScore(s => ({
      wins: s.wins + (result.includes("Win") ? 1 : 0),
      losses: s.losses + (result.includes("Lose") ? 1 : 0),
      draws: s.draws + (result.includes("Draw") ? 1 : 0),
    }));
  };

  return (
    <ToolLayout title="Rock Paper Scissors" description="Classic game against the computer">
      <div className="space-y-6 max-w-md mx-auto text-center">
        <div className="flex justify-center gap-3">
          {choices.map(c => (
            <Button key={c} onClick={() => play(c)} size="lg" variant="outline" className="text-2xl h-20 w-20 rounded-2xl hover:scale-110 transition-transform">
              {c.split(" ")[0]}
            </Button>
          ))}
        </div>
        {round && (
          <div className="bg-accent/50 rounded-2xl p-6 space-y-2">
            <div className="flex justify-around text-4xl">
              <div><p className="text-xs text-muted-foreground mb-1">You</p>{round.player.split(" ")[0]}</div>
              <div className="text-2xl self-center font-bold text-muted-foreground">VS</div>
              <div><p className="text-xs text-muted-foreground mb-1">CPU</p>{round.computer.split(" ")[0]}</div>
            </div>
            <p className={`text-xl font-bold mt-3 ${round.result.includes("Win") ? "text-green-500" : round.result.includes("Lose") ? "text-destructive" : "text-muted-foreground"}`}>{round.result}</p>
          </div>
        )}
        <div className="flex justify-center gap-4">
          {[{ label: "Wins", val: score.wins, cls: "text-green-500" }, { label: "Losses", val: score.losses, cls: "text-destructive" }, { label: "Draws", val: score.draws, cls: "text-muted-foreground" }].map(s => (
            <div key={s.label} className="bg-accent/30 rounded-xl px-5 py-3 text-center">
              <p className={`text-2xl font-bold ${s.cls}`}>{s.val}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <Button variant="ghost" onClick={() => { setScore({ wins: 0, losses: 0, draws: 0 }); setRound(null); }}>Reset Score</Button>
      </div>
    </ToolLayout>
  );
}
