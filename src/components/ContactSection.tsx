import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: MapPin, title: "Address", value: "Dhaka, Bangladesh" },
  { icon: Phone, title: "Phone", value: "+880 1XXX-XXXXXX" },
  { icon: Mail, title: "Email", value: "hello@cybervenom.com" },
];

export function ContactSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "We'll get back to you soon." });
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20 text-sm font-semibold text-primary mb-4">
            <Send className="w-3.5 h-3.5" /> Contact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4 tracking-tight">
            Get In Touch <span className="gradient-text">With Us</span>
          </h2>
          <p className="text-muted-foreground text-lg">Have a question or suggestion? Contact us today</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {contactInfo.map((info) => (
              <div key={info.title} className="flex items-start gap-4 glass rounded-2xl p-5 border border-border/30 hover-lift hover:border-primary/30">
                <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                  <info.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold">{info.title}</div>
                  <div className="text-sm text-muted-foreground">{info.value}</div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="lg:col-span-2 glass rounded-2xl p-8 border border-border/30 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Input placeholder="Your Name" className="rounded-xl bg-card/50 border-border/50" required />
              <Input type="email" placeholder="Your Email" className="rounded-xl bg-card/50 border-border/50" required />
            </div>
            <Input placeholder="Subject" className="rounded-xl bg-card/50 border-border/50" required />
            <Textarea placeholder="Your Message" className="rounded-xl min-h-[120px] bg-card/50 border-border/50" required />
            <Button type="submit" className="gradient-bg text-primary-foreground rounded-xl px-8 font-semibold glow-shadow">
              <Send className="mr-2 w-4 h-4" /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
