import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Download, Upload } from "lucide-react";

interface Note { id: string; title: string; content: string; date: string; color: string; }

const colors = ["hsl(263, 85%, 95%)", "hsl(142, 71%, 92%)", "hsl(47, 95%, 90%)", "hsl(199, 89%, 92%)", "hsl(340, 82%, 92%)", "hsl(25, 95%, 92%)"];

const Notepad = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("cv-notes");
    return saved ? JSON.parse(saved) : [
      { id: "1", title: "Welcome Note", content: "Welcome to Notepad! Start writing your notes here.", date: new Date().toISOString(), color: colors[0] }
    ];
  });
  const [active, setActive] = useState<string | null>(notes[0]?.id || null);
  const activeNote = notes.find(n => n.id === active);

  useEffect(() => { localStorage.setItem("cv-notes", JSON.stringify(notes)); }, [notes]);

  const addNote = () => {
    const n: Note = { id: Date.now().toString(), title: "Untitled Note", content: "", date: new Date().toISOString(), color: colors[Math.floor(Math.random() * colors.length)] };
    setNotes(prev => [n, ...prev]);
    setActive(n.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, date: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (active === id) setActive(notes.find(n => n.id !== id)?.id || null);
    toast({ title: "Note deleted" });
  };

  const exportNotes = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "notes.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout title="Notepad" description="Simple and fast note-taking app with local storage">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 min-h-[500px]">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button onClick={addNote} className="flex-1 gradient-bg text-primary-foreground rounded-xl font-semibold gap-2"><Plus className="w-4 h-4" /> New</Button>
            <Button variant="outline" size="icon" onClick={exportNotes} className="rounded-xl" title="Export"><Download className="w-4 h-4" /></Button>
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {notes.map(n => (
              <div key={n.id} onClick={() => setActive(n.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${active === n.id ? "border-primary/50 bg-accent/50" : "border-border/30 hover:border-primary/20"}`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm truncate flex-1">{n.title}</h4>
                  <button onClick={e => { e.stopPropagation(); deleteNote(n.id); }} className="text-muted-foreground hover:text-destructive ml-2"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">{n.content || "Empty note"}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(n.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {activeNote ? (
          <div className="space-y-3">
            <Input value={activeNote.title} onChange={e => updateNote(activeNote.id, { title: e.target.value })}
              className="rounded-xl bg-card border-border/50 text-lg font-bold" placeholder="Note title" />
            <Textarea value={activeNote.content} onChange={e => updateNote(activeNote.id, { content: e.target.value })}
              className="min-h-[420px] rounded-xl bg-card border-border/50 resize-none" placeholder="Start writing..." />
          </div>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground">Select or create a note</div>
        )}
      </div>
    </ToolLayout>
  );
};

export default Notepad;
