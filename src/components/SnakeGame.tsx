import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Grid size settings
const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const directionRef = useRef(INITIAL_DIRECTION);
  const isPausedRef = useRef(isPaused);

  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  useEffect(() => {
    const saved = localStorage.getItem('glitch-snake-highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  const generateFood = useCallback(() => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    setFood(newFood!);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    generateFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }
      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused(prev => !prev);
        return;
      }
      if (gameOver) {
        if (e.key === 'Enter') resetGame();
        return;
      }
      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (y !== 1) setDirection({ x: 0, y: -1 }); e.preventDefault(); break;
        case 'ArrowDown': case 's': case 'S': if (y !== -1) setDirection({ x: 0, y: 1 }); e.preventDefault(); break;
        case 'ArrowLeft': case 'a': case 'A': if (x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': case 'D': if (x !== -1) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const currentSpeed = Math.max(INITIAL_SPEED - Math.floor(score / 5) * 10, 50);

    const checkCollision = (head: Point) => {
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) return true;
      return snake.some((segment) => segment.x === head.x && segment.y === head.y);
    };

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y };

        if (checkCollision(newHead)) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('glitch-snake-highscore', score.toString());
          }
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          generateFood();
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(intervalId);
  }, [gameStarted, gameOver, isPaused, score, food, generateFood, highScore, snake]);

  return (
    <div className="contents">
      
      {/* RIGHT SIDEBAR: Stats */}
      <aside className="col-start-3 row-start-2 p-10 self-start pointer-events-none z-10 w-full">
        <div className="mb-10 pointer-events-auto">
          <p className="font-mono text-[14px] uppercase text-white/50 tracking-[4px]">SCORE_VAL</p>
          <p className="font-display text-[48px] leading-none text-[#00FFFF] animate-digital-glitch-slow mt-2">{score.toString().padStart(4, '0')}</p>
        </div>
        <div className="mb-10 pointer-events-auto">
          <p className="font-mono text-[14px] uppercase text-white/50 tracking-[4px]">PEAK_MEM</p>
          <p className="font-display text-[32px] leading-none text-[#FF00FF] mt-2">{highScore.toString().padStart(4, '0')}</p>
        </div>
      </aside>

      {/* GAME VIEWPORT */}
      <main className="col-start-2 row-start-2 flex flex-col items-center justify-center p-5 relative overflow-hidden z-0 h-full w-full bg-black/60">
        
        <div className={`w-[400px] h-[400px] border-glitch grid relative bg-[#050505] shrink-0 ${gameOver ? 'animate-digital-glitch animate-screen-tear border-glitch-magenta' : 'border-glitch shadow-[0_0_50px_rgba(0,255,255,0.1)]'}`}>
          
          <div 
            className="absolute inset-0" 
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
          >
            {/* Grid overlay for a terminal matrix look */}
            <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGwyMCAwdjIwSDB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-30 z-0"></div>

            {/* Food */}
            <div 
              className="bg-[#FF00FF] rounded-none z-10 animate-pulse"
              style={{ gridRowStart: food.y + 1, gridColumnStart: food.x + 1, boxShadow: '0 0 10px #FF00FF' }}
            />

            {/* Snake */}
            {snake.map((segment, index) => {
              const head = index === 0;
              return (
                <div
                  key={`${segment.x}-${segment.y}-${index}`}
                  className={`${head ? 'bg-[#FFFFFF]' : 'bg-[#00FFFF] opacity-80'} rounded-none z-10`}
                  style={{
                    gridRowStart: segment.y + 1,
                    gridColumnStart: segment.x + 1,
                    boxShadow: head ? '0 0 15px #FFFFFF' : '0 0 5px #00FFFF',
                  }}
                />
              );
            })}
          </div>

          {/* Overlays */}
          <AnimatePresence>
            {!gameStarted && !gameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#000000]/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm border-glitch"
              >
                <h2 className="text-[28px] font-display text-[#00FFFF] mb-6 text-center tracking-wider uppercase animate-digital-glitch">DATA_SNAKE</h2>
                <button 
                  onClick={resetGame}
                  className="px-6 py-4 bg-transparent border-[2px] border-[#FF00FF] text-white font-mono hover:bg-[#FF00FF]/20 transition-colors cursor-pointer text-sm animate-pulse"
                >
                  [ INITIATE BOOT SEQUENCE ]
                </button>
              </motion.div>
            )}

            {isPaused && gameStarted && !gameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#00FFFF]/10 flex items-center justify-center z-20 backdrop-blur-md"
              >
                <h2 className="text-[32px] font-display text-[#FF00FF] tracking-widest animate-digital-glitch">SYS_SUSPENDED</h2>
              </motion.div>
            )}

            {gameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#FF00FF]/20 flex flex-col items-center justify-center z-20 backdrop-blur-md"
              >
                <h2 className="text-[48px] font-display text-white mb-4 leading-none uppercase animate-digital-glitch" style={{textShadow: '5px 5px 0 #00FFFF, -5px -5px 0 #FF00FF'}}>FATAL_ERR</h2>
                <button 
                  onClick={resetGame}
                  className="mt-8 px-8 py-3 bg-black border-[4px] border-[#00FFFF] text-[#00FFFF] font-display hover:bg-[#00FFFF] hover:text-black transition-colors cursor-pointer text-sm shadow-[0_0_20px_#00FFFF]"
                >
                  REBOOT
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <p className="mt-[30px] font-mono text-[14px] text-white/50 uppercase tracking-[2px]">INPUT: ARRY_VECTORS</p>
      </main>
    </div>
  );
}
