"use client";
import { useEffect, useRef, useState } from "react";
import {
  Trophy,
  Settings,
  Play,
  RotateCcw,
  Maximize,
  Minimize,
  Square,
} from "lucide-react";

interface SnakeProps {
  onGameOver?: (score: number, modo: string) => void;
}

export default function GoogleSnake({ onGameOver }: SnakeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  // Diccionario para guardar el récord local de cada modo por separado
  const [bestScores, setBestScores] = useState<Record<string, number>>({});

  const [gameOver, setGameOver] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const [settings, setSettings] = useState({
    speed: 100,
    fruitType: "apple",
    portalMode: false,
    boardSize: { label: "Pro", cols: 17, rows: 15 },
  });

  const gameState = useRef({
    snake: [{ x: 8, y: 7 }],
    food: { x: 12, y: 7 },
    dx: 1,
    dy: 0,
    nextDir: { dx: 1, dy: 0 },
    processedDir: { dx: 1, dy: 0 },
  });

  // Calculamos la categoría actual en formato String
  const currentModeStr = `${settings.boardSize.label.toUpperCase()} - ${
    settings.speed === 130 ? "SLOW" : settings.speed === 85 ? "NORMAL" : "ELITE"
  } - ${settings.portalMode ? "PORTAL ON" : "PORTAL OFF"}`;

  // Obtenemos el récord local para la categoría actual
  const currentBest = bestScores[currentModeStr] || 0;

  useEffect(() => {
    if (gameOver && score > 0 && onGameOver) {
      onGameOver(score, currentModeStr);
    }
  }, [gameOver]);

  const resetGame = () => {
    const midX = Math.floor(settings.boardSize.cols / 2);
    const midY = Math.floor(settings.boardSize.rows / 2);
    gameState.current = {
      snake: [
        { x: midX, y: midY },
        { x: midX - 1, y: midY },
        { x: midX - 2, y: midY },
      ],
      food: { x: midX + 4, y: midY },
      dx: 1,
      dy: 0,
      nextDir: { dx: 1, dy: 0 },
      processedDir: { dx: 1, dy: 0 },
    };
    setScore(0);
    setGameOver(false);
    setShowMenu(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameOver || showMenu) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = 25;
    const { cols, rows } = settings.boardSize;

    const drawFruit = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      const cx = x * gridSize + gridSize / 2;
      const cy = y * gridSize + gridSize / 2;
      if (settings.fruitType === "apple") {
        ctx.fillStyle = "#E7471D";
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4A752C";
        ctx.fillRect(cx - 1, cy - 12, 2, 5);
      } else if (settings.fruitType === "banana") {
        ctx.fillStyle = "#F1C40F";
        ctx.beginPath();
        ctx.ellipse(cx, cy, 10, 5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#8E44AD";
        [
          [-4, -4],
          [4, -4],
          [0, 0],
          [-4, 4],
          [4, 4],
        ].forEach((p) => {
          ctx.beginPath();
          ctx.arc(cx + p[0], cy + p[1], 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    const draw = () => {
      const state = gameState.current;
      state.dx = state.nextDir.dx;
      state.dy = state.nextDir.dy;
      state.processedDir = { dx: state.dx, dy: state.dy };

      let head = {
        x: state.snake[0].x + state.dx,
        y: state.snake[0].y + state.dy,
      };

      if (settings.portalMode) {
        if (head.x < 0) head.x = cols - 1;
        else if (head.x >= cols) head.x = 0;
        if (head.y < 0) head.y = rows - 1;
        else if (head.y >= rows) head.y = 0;
      } else if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        setGameOver(true);
        return;
      }

      if (state.snake.some((s) => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        return;
      }

      state.snake.unshift(head);
      if (head.x === state.food.x && head.y === state.food.y) {
        setScore((s) => {
          const ns = s + 1;
          setBestScores((prev) => {
            const modeBest = prev[currentModeStr] || 0;
            if (ns > modeBest) {
              return { ...prev, [currentModeStr]: ns };
            }
            return prev;
          });
          return ns;
        });
        state.food = {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
        };
      } else {
        state.snake.pop();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? "#AAD751" : "#A2D149";
          ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
        }
      }

      drawFruit(ctx, state.food.x, state.food.y);
      ctx.fillStyle = "#4572E6";
      state.snake.forEach((p, i) => {
        ctx.beginPath();
        // @ts-ignore
        ctx.roundRect(
          p.x * gridSize + 1,
          p.y * gridSize + 1,
          gridSize - 2,
          gridSize - 2,
          [i === 0 ? 10 : 4]
        );
        ctx.fill();
        if (i === 0) {
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(p.x * gridSize + 8, p.y * gridSize + 8, 2.5, 0, Math.PI * 2);
          ctx.arc(p.x * gridSize + 17, p.y * gridSize + 8, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#4572E6";
        }
      });
    };

    const handleKey = (e: KeyboardEvent) => {
      const state = gameState.current;
      const key = e.key.toLowerCase();
      if (gameOver && (key === "r" || key === " ")) {
        resetGame();
        return;
      }
      const isUp = key === "w" || e.key === "ArrowUp";
      const isDown = key === "s" || e.key === "ArrowDown";
      const isLeft = key === "a" || e.key === "ArrowLeft";
      const isRight = key === "d" || e.key === "ArrowRight";

      if (isUp && state.processedDir.dy !== 1)
        state.nextDir = { dx: 0, dy: -1 };
      if (isDown && state.processedDir.dy !== -1)
        state.nextDir = { dx: 0, dy: 1 };
      if (isLeft && state.processedDir.dx !== 1)
        state.nextDir = { dx: -1, dy: 0 };
      if (isRight && state.processedDir.dx !== -1)
        state.nextDir = { dx: 1, dy: 0 };
    };

    window.addEventListener("keydown", handleKey);
    const loop = setInterval(draw, settings.speed);
    return () => {
      window.removeEventListener("keydown", handleKey);
      clearInterval(loop);
    };
  }, [gameOver, showMenu, settings]);

  const FruitIcon = () => {
    if (settings.fruitType === "apple") return "🍎";
    if (settings.fruitType === "banana") return "🍌";
    return "🍇";
  };

  return (
    <div className="w-full max-w-2xl bg-[#4A752C] rounded-3xl overflow-hidden shadow-2xl border-8 border-[#4A752C] select-none flex flex-col items-center">
      <div className="w-full p-3 flex justify-between items-center text-white font-black px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{FruitIcon()}</span>
          <span className="text-3xl italic">{score}</span>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[#F1C40F] fill-[#F1C40F]" />
          <span className="text-3xl italic">{currentBest}</span>
        </div>

        <button
          onClick={() => setShowMenu(true)}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="relative bg-[#3a5c23] w-full min-h-[420px] flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          width={settings.boardSize.cols * 25}
          height={settings.boardSize.rows * 25}
          className="block shadow-2xl border-2 border-[#2d461b] max-w-full"
        />

        {showMenu && (
          <div className="absolute inset-0 bg-[#4A752C]/95 backdrop-blur-md flex flex-col p-6 text-white z-20">
            <h2 className="text-2xl font-black mb-4 text-center tracking-widest uppercase italic">
              MAZANEX SNAKE
            </h2>

            <div className="flex flex-col gap-3 flex-1 w-full justify-center">
              <section>
                <label className="text-[10px] font-black uppercase opacity-90 mb-1.5 block text-center text-white">
                  Terreno
                </label>
                <div className="flex justify-center gap-2">
                  {[
                    {
                      label: "Mini",
                      cols: 10,
                      rows: 10,
                      icon: <Minimize size={14} />,
                    },
                    {
                      label: "Pro",
                      cols: 17,
                      rows: 15,
                      icon: <Square size={14} />,
                    },
                    {
                      label: "Max",
                      cols: 23,
                      rows: 19,
                      icon: <Maximize size={14} />,
                    },
                  ].map((sz) => (
                    <button
                      key={sz.label}
                      onClick={() =>
                        setSettings({ ...settings, boardSize: sz })
                      }
                      className={`flex flex-col items-center justify-center gap-1 w-20 h-14 rounded-xl transition-all border ${
                        settings.boardSize.label === sz.label
                          ? "bg-white text-[#4A752C] border-white shadow-lg"
                          : "bg-white/5 border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {sz.icon}
                      <span className="text-[9px] font-black uppercase">
                        {sz.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black uppercase opacity-90 mb-1.5 block text-center text-white">
                  Velocidad
                </label>
                <div className="flex justify-center gap-2">
                  {[
                    { label: "Slow", speed: 130, icon: "🐢" },
                    { label: "Normal", speed: 85, icon: "🐍" },
                    { label: "Elite", speed: 55, icon: "⚡" },
                  ].map((lv) => (
                    <button
                      key={lv.label}
                      onClick={() =>
                        setSettings({ ...settings, speed: lv.speed })
                      }
                      className={`flex flex-col items-center justify-center w-24 h-14 rounded-xl border transition-all ${
                        settings.speed === lv.speed
                          ? "bg-white text-[#4A752C] border-white shadow-lg"
                          : "bg-white/5 border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span className="text-lg">{lv.icon}</span>
                      <span className="text-[8px] font-black uppercase mt-0.5">
                        {lv.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <section>
                  <label className="text-[10px] font-black uppercase opacity-90 mb-1.5 block text-center text-white">
                    Fruta
                  </label>
                  <div className="flex justify-center gap-1">
                    {["apple", "banana", "grapes"].map((f) => (
                      <button
                        key={f}
                        onClick={() =>
                          setSettings({ ...settings, fruitType: f })
                        }
                        className={`text-xl p-2 rounded-xl transition-all ${
                          settings.fruitType === f
                            ? "bg-white/20 scale-110 shadow-inner"
                            : "opacity-40 hover:opacity-100"
                        }`}
                      >
                        {f === "apple" ? "🍎" : f === "banana" ? "🍌" : "🍇"}
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <label className="text-[10px] font-black uppercase opacity-90 mb-1.5 block text-center text-white">
                    Portal
                  </label>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        portalMode: !settings.portalMode,
                      })
                    }
                    className={`w-full h-10 rounded-xl text-[9px] font-black transition-all ${
                      settings.portalMode
                        ? "bg-indigo-500 text-white shadow-lg"
                        : "bg-white/10 text-white/50 hover:bg-white/20"
                    }`}
                  >
                    {settings.portalMode ? "ENABLED" : "DISABLED"}
                  </button>
                </section>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="mt-4 w-full py-3.5 bg-[#4572E6] hover:bg-[#345ec4] rounded-xl font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all uppercase italic tracking-tighter"
            >
              <Play size={20} fill="currentColor" /> Iniciar
            </button>
          </div>
        )}

        {gameOver && !showMenu && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white z-10 p-4 animate-in fade-in duration-300">
            <h2 className="text-4xl font-black mb-6 italic tracking-tighter uppercase">
              Game Over
            </h2>
            <div className="bg-white/10 p-6 rounded-3xl border border-white/10 mb-8 text-center">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">
                Puntaje Final
              </p>
              <p className="text-5xl font-black italic">{score}</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-[240px]">
              <button
                onClick={resetGame}
                className="w-full py-4 bg-[#4572E6] rounded-2xl font-black flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                <RotateCcw size={18} /> Reintentar
              </button>
              <button
                onClick={() => setShowMenu(true)}
                className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                <Settings size={18} className="inline mr-2" /> Menú de Ajustes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
