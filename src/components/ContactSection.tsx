import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: MapPin, title: "Address", value: "Dhaka, Bangladesh" },
  { icon: Phone, title: "Phone", value: "+880 1XXX-XXXXXX" },
  { icon: Mail, title: "Email", value: "hello@webtools.com" },
];

export function ContactSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "We'll get back to you soon." });
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Contact</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-4">
            Get In Touch <span className="gradient-text">With Us</span>
          </h2>
          <p className="text-muted-foreground">Have a question or suggestion? Contact us today</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-5">
            {contactInfo.map((info) => (
              <div key={info.title} className="flex items-start gap-4 bg-card rounded-2xl p-5 border border-border card-shadow">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{info.title}</div>
                  <div className="text-sm text-muted-foreground">{info.value}</div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-card rounded-2xl p-8 border border-border card-shadow space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Input placeholder="Your Name" className="rounded-xl" required />
              <Input type="email" placeholder="Your Email" className="rounded-xl" required />
            </div>
            <Input placeholder="Subject" className="rounded-xl" required />
            <Textarea placeholder="Your Message" className="rounded-xl min-h-[120px]" required />
            <Button type="submit" className="gradient-bg text-primary-foreground rounded-xl px-8 font-semibold">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
