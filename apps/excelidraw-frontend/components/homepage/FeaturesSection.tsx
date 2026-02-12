import { Users2, Zap, LayoutGrid, Shield, Hand, Share2 } from "lucide-react";

const features = [
  {
    icon: Users2,
    title: "Real-time Collaboration",
    description:
      "See your team's cursors and changes instantly. Work together as if you're in the same room.",
    color: "violet",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized for performance. Handle thousands of shapes without any lag.",
    color: "blue",
  },
  {
    icon: LayoutGrid,
    title: "Infinite Canvas",
    description:
      "Never run out of space. Pan and zoom infinitely to map out your biggest ideas.",
    color: "fuchsia",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    description:
      "Your data is encrypted end-to-end. We prioritize your privacy.",
    color: "emerald",
  },
  {
    icon: Hand,
    title: "Hand-drawn Style",
    description:
      "Beautiful sketchy aesthetics that make your diagrams feel personal and approachable.",
    color: "amber",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Share your boards with a simple link. Control who can view or edit.",
    color: "cyan",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              modern teams
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Powerful features, seamless collaboration, infinite possibilities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-${feature.color}-500/30 transition-all hover:bg-zinc-900/50`}
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
