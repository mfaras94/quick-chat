// https://cruip-tutorials.vercel.app/animated-gradient-border/
function BorderAnimatedContainer({ children, className = "" }) {
  return (
    <div className={`w-full h-full [background:linear-gradient(45deg,#151718,theme(colors.zinc.800)_50%,#151718)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.zinc.600/.48)_80%,_theme(colors.emerald.500)_86%,_theme(colors.teal.300)_90%,_theme(colors.emerald.500)_94%,_theme(colors.zinc.600/.48))_border-box] rounded-2xl border border-transparent animate-border flex overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;
