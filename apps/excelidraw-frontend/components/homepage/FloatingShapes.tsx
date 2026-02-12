export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated floating shapes */}
      <div className="absolute top-20 left-10 w-16 h-16 border-2 border-violet-500/20 rounded-lg animate-float" />
      <div
        className="absolute top-40 right-20 w-12 h-12 border-2 border-blue-500/20 rounded-full animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-32 left-1/4 w-20 h-10 border-2 border-pink-500/20 rounded-lg animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/3 right-1/3 w-8 h-8 border-2 border-emerald-500/20 rounded-full animate-float"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-1/4 right-10 w-14 h-14 border-2 border-amber-500/20 rounded-lg rotate-45 animate-float"
        style={{ animationDelay: "1.5s" }}
      />
    </div>
  );
}
