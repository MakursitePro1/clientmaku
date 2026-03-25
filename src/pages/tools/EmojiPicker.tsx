import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const emojiCategories: Record<string, string[]> = {
  "Smileys": ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","🥰","😍","😘","😗","😙","😚","🙂","🤗","🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥","😮","🤐","😯","😪","😫","🥱","😴","😌","😛","😜","😝","🤤","😒","😓","😔","😕","🙃","🤑","😲","☹️","🙁","😖","😞","😟","😤","😢","😭","😦","😧","😨","😩","🤯","😬","😰","😱"],
  "Hearts": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝"],
  "Hands": ["👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏"],
  "Animals": ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄"],
  "Food": ["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶️","🫑","🌽","🥕","🧄","🧅","🥔","🍠"],
  "Flags": ["🇧🇩","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇮🇳","🇵🇰","🇯🇵","🇰🇷","🇨🇳","🇫🇷","🇩🇪","🇮🇹","🇪🇸","🇧🇷","🇷🇺","🇹🇷","🇸🇦","🇦🇪","🇲🇾"],
};

export default function EmojiPicker() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Smileys");

  const copyEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    toast({ title: `${emoji} Copied!` });
  };

  const allEmojis = Object.values(emojiCategories).flat();
  const displayEmojis = search
    ? allEmojis
    : emojiCategories[activeCategory] || [];

  return (
    <ToolLayout title="Emoji Picker" description="Find and copy emojis easily">
      <div className="space-y-5">
        <Input placeholder="Search emojis..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl" />
        {!search && (
          <div className="flex flex-wrap gap-2">
            {Object.keys(emojiCategories).map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat ? "gradient-bg text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>
                {cat}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
          {displayEmojis.map((emoji, i) => (
            <button key={i} onClick={() => copyEmoji(emoji)} className="text-2xl p-2 rounded-xl hover:bg-accent transition-colors" title="Click to copy">
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
