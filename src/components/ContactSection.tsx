import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, Sparkles, ArrowRight, MessageSquare, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export function ContactSection() {
  const { settings } = useSiteSettings();

  const contactInfo = [
    { icon: MapPin, title: "Our Location", value: settings.contact_address || "Dhaka, Bangladesh", color: "from-violet-500 to-purple-600" },
    { icon: Phone, title: "Phone Number", value: settings.contact_phone || "+880 1635-915989", color: "from-pink-500 to-rose-600" },
    { icon: Mail, title: "Email Address", value: settings.contact_email || "hello@cybervenom.com", color: "from-amber-500 to-orange-600" },
    { icon: Clock, title: "Working Hours", value: "24/7 Available", color: "from-emerald-500 to-teal-600" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "✅ Message Sent!", description: "We'll get back to you as soon as possible." });
  };

  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[250px] opacity-20"
        style={{ background: "hsl(263 85% 58% / 0.08)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[200px] opacity-15"
        style={{ background: "hsl(290 90% 60% / 0.06)" }}
        animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-accent/50 text-sm font-semibold text-primary mb-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-gradient" />
            <MessageSquare className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Contact Us</span>
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Get In Touch <span className="gradient-text">With Us</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have a question, suggestion, or just want to say hi? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ x: 6, scale: 1.01 }}
                className="group relative glass rounded-2xl p-5 border border-border/30 hover:border-primary/30 transition-all duration-500 cursor-default overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-4 relative z-10">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-500`}
                  >
                    <info.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <div className="font-bold text-sm text-muted-foreground/70 uppercase tracking-wider mb-0.5">{info.title}</div>
                    <div className="font-semibold text-foreground">{info.value}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="relative mt-6"
            >
              <div className="absolute -inset-1 gradient-bg rounded-2xl opacity-15 blur-lg" />
              <div className="relative glass-strong rounded-2xl p-6 border border-primary/20 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <h4 className="font-bold text-sm">We're Global</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our tools are used by <span className="text-primary font-semibold">{settings.stats_users_count}</span> people worldwide. Join the community!
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 relative"
          >
            <div className="absolute -inset-1 gradient-bg rounded-3xl opacity-10 blur-xl" />
            <form
              onSubmit={handleSubmit}
              className="relative glass-strong rounded-3xl p-8 md:p-10 border border-border/30 space-y-5 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center glow-shadow">
                  <Send className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Send a Message</h3>
                  <p className="text-xs text-muted-foreground">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                  <Input placeholder="John Doe" className="rounded-xl bg-card/60 border-border/40 focus:border-primary/40 focus:shadow-[0_0_20px_-6px_hsl(263_85%_58%/0.15)] transition-all h-12" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Email</label>
                  <Input type="email" placeholder="john@example.com" className="rounded-xl bg-card/60 border-border/40 focus:border-primary/40 focus:shadow-[0_0_20px_-6px_hsl(263_85%_58%/0.15)] transition-all h-12" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Subject</label>
                <Input placeholder="What's this about?" className="rounded-xl bg-card/60 border-border/40 focus:border-primary/40 focus:shadow-[0_0_20px_-6px_hsl(263_85%_58%/0.15)] transition-all h-12" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Message</label>
                <Textarea placeholder="Tell us what's on your mind..." className="rounded-xl min-h-[140px] bg-card/60 border-border/40 focus:border-primary/40 focus:shadow-[0_0_20px_-6px_hsl(263_85%_58%/0.15)] transition-all resize-none" required />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full gradient-bg text-primary-foreground rounded-xl py-6 font-bold text-base glow-shadow relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Send Message <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
