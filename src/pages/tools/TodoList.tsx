import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Check } from "lucide-react";

interface Todo { id: string; text: string; done: boolean; date: string; }

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("cv-todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  useEffect(() => { localStorage.setItem("cv-todos", JSON.stringify(todos)); }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(prev => [{ id: Date.now().toString(), text: input.trim(), done: false, date: new Date().toISOString() }, ...prev]);
    setInput("");
  };

  const toggle = (id: string) => setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: string) => setTodos(prev => prev.filter(t => t.id !== id));
  const clearDone = () => { setTodos(prev => prev.filter(t => !t.done)); toast({ title: "Cleared completed tasks" }); };

  const filtered = todos.filter(t => filter === "all" ? true : filter === "active" ? !t.done : t.done);
  const activeCount = todos.filter(t => !t.done).length;
  const doneCount = todos.filter(t => t.done).length;

  return (
    <ToolLayout title="Todo List" description="Simple and effective task management">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..." className="rounded-xl bg-card border-border/50" />
          <Button onClick={addTodo} className="gradient-bg text-primary-foreground rounded-xl font-semibold gap-2 shrink-0">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {(["all", "active", "done"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${filter === f ? "gradient-bg text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground"}`}>
              {f} {f === "active" ? `(${activeCount})` : f === "done" ? `(${doneCount})` : `(${todos.length})`}
            </button>
          ))}
          {doneCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearDone} className="rounded-xl ml-auto text-xs">Clear Done</Button>
          )}
        </div>

        <div className="space-y-2">
          {filtered.map(todo => (
            <div key={todo.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${todo.done ? "bg-secondary/30 border-border/20" : "bg-card border-border/50"}`}>
              <button onClick={() => toggle(todo.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${todo.done ? "bg-primary border-primary" : "border-muted-foreground/30 hover:border-primary"}`}>
                {todo.done && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
              </button>
              <span className={`flex-1 ${todo.done ? "line-through text-muted-foreground" : ""}`}>{todo.text}</span>
              <button onClick={() => remove(todo.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No tasks {filter !== "all" ? `(${filter})` : ""}</p>}
        </div>
      </div>
    </ToolLayout>
  );
};

export default TodoList;
