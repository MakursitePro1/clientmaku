import { motion } from "framer-motion";
import { Target, Heart, Award, TrendingUp } from "lucide-react";

const features = [
  { icon: Target, title: "Mission-Driven", desc: "We focus on building the most useful tools for everyone." },
  { icon: Heart, title: "User-Centric", desc: "Your productivity is our highest priority." },
  { icon: Award, title: "Quality First", desc: "We deliver tools with the highest quality standards." },
  { icon: TrendingUp, title: "Always Improving", desc: "We continuously update and add new tools." },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-6">
              We Are <span className="gradient-text">WebTools</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              WebTools is a comprehensive collection of free online tools designed for developers, designers, students, and everyday users. From image editors to code testers, converters to generators — we provide all types of tools to make your digital life easier.
            </p>
            <div className="grid grid-cols-2 gap-5">
              {features.map((f) => (
                <div key={f.title} className="bg-card rounded-2xl p-5 border border-border card-shadow">
                  <f.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-card rounded-3xl p-8 border border-border card-shadow">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-3xl font-extrabold text-primary-foreground">W</div>
                  <div>
                    <h3 className="text-xl font-bold">WebTools Platform</h3>
                    <p className="text-sm text-muted-foreground">Free Online Tools Collection</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-extrabold text-primary">29+</div>
                    <div className="text-xs text-muted-foreground">Tools Available</div>
                  </div>
                  <div className="bg-accent/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-extrabold text-primary">5</div>
                    <div className="text-xs text-muted-foreground">Categories</div>
                  </div>
                  <div className="bg-accent/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-extrabold text-primary">100%</div>
                    <div className="text-xs text-muted-foreground">Free</div>
                  </div>
                  <div className="bg-accent/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-extrabold text-primary">∞</div>
                    <div className="text-xs text-muted-foreground">Usage Limit</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
