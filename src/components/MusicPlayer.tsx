import { useEffect, useState, useRef, useCallback, ChangeEvent } from 'react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: 'AUDIO.DECRYPT_1.BIN',
    artist: 'UNKNOWN_HOST',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '0x028A',
  },
  {
    id: 2,
    title: 'MEM_DUMP_FRAG_2',
    artist: 'SYS_ADMIN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '0x03B2',
  },
  {
    id: 3,
    title: 'KERNEL_PANIC_SND',
    artist: 'ROOT_ACCESS',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '0x01E4',
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('INTERCEPT:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      const currentTime = audioRef.current.currentTime;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => handleNext();

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="contents">
      {/* LEFT SIDEBAR: Playlist OVERRIDDEN */}
      <aside className="col-start-1 row-start-2 p-10 flex flex-col gap-[30px] z-10 w-full overflow-hidden bg-black/40">
        <div className="w-full animate-digital-glitch-slow">
          <p className="font-display text-[14px] uppercase tracking-[2px] text-[#00FFFF] mb-4">DATA_STREAM</p>
          <div className="flex flex-col gap-6 w-full">
            {TRACKS.map((track, index) => (
              <div
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
                className={`grid grid-cols-[30px_1fr] gap-[15px] cursor-pointer transition-colors border-l-4 pl-2 ${
                  index === currentTrackIndex ? 'text-[#FF00FF] border-[#FF00FF] animate-digital-glitch bg-[#FF00FF]/10' : 'text-white/60 border-white/20 hover:text-white hover:border-white'
                }`}
              >
                <span className="font-mono text-[16px]">&gt;0{index + 1}</span>
                <div className="truncate">
                  <p className="font-bold text-[18px] truncate">{track.title}</p>
                  <p className="text-[14px] mt-1 uppercase font-mono truncate">{track.artist} | {track.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      {/* RIGHT SIDEBAR: Now Playing */}
      <aside className="col-start-3 row-start-2 p-10 self-end pointer-events-none z-10 w-full">
        <div className="bg-[#FF00FF]/5 p-5 border-t-2 border-b-2 border-glitch pointer-events-auto shadow-2xl backdrop-blur-sm">
          <p className="font-display text-[12px] uppercase tracking-[2px] text-[#00FFFF] mb-2 animate-pulse">DECODING...</p>
          <p className="font-bold text-[16px] text-white">{currentTrack.title}</p>
          <div className="h-12 flex items-end gap-[4px] mt-[20px]">
            {isPlaying ? (
              <>
                <motion.div animate={{ height: ['40%', '80%', '40%'] }} transition={{ duration: 0.2, repeat: Infinity }} className="flex-1 bg-[#FF00FF] min-h-[4px]" />
                <motion.div animate={{ height: ['80%', '10%', '80%'] }} transition={{ duration: 0.1, repeat: Infinity, delay: 0.05 }} className="flex-1 bg-[#00FFFF] min-h-[4px]" />
                <motion.div animate={{ height: ['20%', '90%', '20%'] }} transition={{ duration: 0.15, repeat: Infinity, delay: 0.1 }} className="flex-1 bg-[#FF00FF] min-h-[4px]" />
                <motion.div animate={{ height: ['100%', '50%', '100%'] }} transition={{ duration: 0.3, repeat: Infinity, delay: 0.02 }} className="flex-1 bg-[#00FFFF] min-h-[4px]" />
                <motion.div animate={{ height: ['50%', '75%', '50%'] }} transition={{ duration: 0.25, repeat: Infinity, delay: 0.08 }} className="flex-1 bg-[#FF00FF] min-h-[4px]" />
                <motion.div animate={{ height: ['75%', '30%', '75%'] }} transition={{ duration: 0.1, repeat: Infinity, delay: 0.04 }} className="flex-1 bg-[#00FFFF] min-h-[4px]" />
                <motion.div animate={{ height: ['30%', '100%', '30%'] }} transition={{ duration: 0.2, repeat: Infinity, delay: 0.12 }} className="flex-1 bg-[#FF00FF] min-h-[4px]" />
              </>
            ) : (
              <>
                <div className="flex-1 bg-[#00FFFF] min-h-[4px]" style={{ height: '10%' }} />
                <div className="flex-1 bg-[#FF00FF] min-h-[4px]" style={{ height: '10%' }} />
                <div className="flex-1 bg-[#00FFFF] min-h-[4px]" style={{ height: '10%' }} />
                <div className="flex-1 bg-[#FF00FF] min-h-[4px]" style={{ height: '10%' }} />
                <div className="flex-1 bg-[#00FFFF] min-h-[4px]" style={{ height: '10%' }} />
                <div className="flex-1 bg-[#FF00FF] min-h-[4px]" style={{ height: '10%' }} />
                <div className="flex-1 bg-[#00FFFF] min-h-[4px]" style={{ height: '10%' }} />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* FOOTER: Controls & Progress */}
      <footer className="col-span-3 row-start-3 bg-[#050505] flex items-center justify-center px-10 border-t-[4px] border-[#FF00FF] shadow-[0_-4px_0_#00FFFF] gap-14 z-10 w-full h-[100px]">
        <button 
          onClick={handlePrev}
          className="bg-transparent border-none text-white font-display text-[16px] uppercase tracking-[4px] cursor-pointer hover:text-neon-cyan transition-colors"
        >
          [PRV]
        </button>
        
        <button 
          onClick={togglePlay}
          className="bg-transparent border-none text-[#FF00FF] font-display text-[28px] uppercase tracking-[4px] cursor-pointer hover:text-[#00FFFF] transition-colors animate-digital-glitch-slow"
        >
          {isPlaying ? 'HALT' : 'EXEC'}
        </button>

        <div className="w-[400px] h-2 bg-white/20 relative overflow-hidden border border-[#00FFFF]/50">
          <div 
            className="absolute left-0 top-0 h-full bg-[#FF00FF] shadow-[0_0_15px_#FF00FF] pointer-events-none transition-all duration-[20px]" 
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <button 
          onClick={handleNext}
          className="bg-transparent border-none text-white font-display text-[16px] uppercase tracking-[4px] cursor-pointer hover:text-neon-magenta transition-colors"
        >
          [NXT]
        </button>
      </footer>
    </div>
  );
}
