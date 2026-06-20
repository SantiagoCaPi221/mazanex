"use client";

import GoogleSnake from "@/components/GoogleSnake";
import { gameService } from "@/app/clients/gameService";
import { useUserStore } from "@/store/useUserStore";

export default function Page() {
  const { user, showNotification } = useUserStore();

  const handleSnakeGameOver = async (puntos: number, modoJugado: string) => {
    // 1. Validación estricta
    console.log("DEBUG: ¿Qué hay en user?", user);
    
    if (!user || puntos <= 0) return;

    // 2. "Seguro de vida" para el nombre: 
    // Si user.username es null o undefined, usamos "JugadorAnonimo" 
    // para evitar que el backend explote por el campo nulo.
    const nameToSave = user.username || "JugadorAnonimo";

    console.log("DEBUG [Page.tsx]: Enviando datos:", { 
      userId: user.id, 
      player_name: nameToSave 
    });

    // 3. Envío al servicio
    const exito = await gameService.saveScore({
      userId: user.id,
      player_name: nameToSave, // <--- Coincide con lo que espera el Backend
      game: "SNAKE",
      highScore: puntos,
      screenshotUrl: "SISTEMA_VERIFICADO",
      mode: modoJugado,
    });

    if (exito) {
      showNotification(
        `Récord en [${modoJugado}] guardado: ${puntos} pts`,
        "success"
      );
    } else {
      console.log(
        `El puntaje de ${puntos} no supera tu récord actual en la categoría: ${modoJugado}`
      );
    }
  };

  return (
    <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
          Mazanex Snake
        </h2>
      </div>

      <div className="flex justify-center w-full">
        <GoogleSnake onGameOver={handleSnakeGameOver} />
      </div>
    </div>
  );
}