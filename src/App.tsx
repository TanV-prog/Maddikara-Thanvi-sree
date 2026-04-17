import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="w-full h-screen bg-[#050505] text-white flex items-center justify-center overflow-hidden">
      
      {/* GLITCH ART OVERLAYS */}
      <div className="bg-noise"></div>
      <div className="scanlines"></div>

      <div className="w-full max-w-[1024px] h-[768px] grid grid-cols-[320px_1fr_320px] grid-rows-[140px_1fr_100px] overflow-hidden relative z-10 animate-screen-tear">
        
        {/* Structural Borders - jarring magenta/cyan */}
        <div className="col-start-1 row-start-2 border-r-4 border-[#00FFFF] border-dashed opacity-30 pointer-events-none z-0"></div>
        <div className="col-start-3 row-start-2 border-l-4 border-[#FF00FF] border-dashed opacity-30 pointer-events-none z-0"></div>

        {/* Header */}
        <header className="col-span-3 flex justify-between items-end p-10 border-b-[4px] border-[#00FFFF] shadow-[0_4px_0_#FF00FF] z-10 z-20 bg-black/80">
          <div className="font-display text-[48px] md:text-[64px] leading-[1] uppercase tracking-[-2px] text-neon-cyan animate-digital-glitch-slow">
            SYS.ERR // <br/>STRIKE_PROTOCOL
          </div>
          <div className="text-right font-mono text-neon-magenta text-[22px] font-bold tracking-[4px] leading-tight hidden md:block animate-digital-glitch">
            CORE: COMPROMISED<br />
            TEMP: ERR_OOB<br />
            MEM: FAILURE
          </div>
        </header>

        {/* The components project their elements into the grid using display: contents */}
        <MusicPlayer />
        <SnakeGame />

      </div>
    </div>
  );
}
