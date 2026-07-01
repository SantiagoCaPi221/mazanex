"use client";

import GoogleSnake from "@/app/components/hooks/game/GoogleSnake";
import { gameService } from "@/app/clients/gameService";
import { useUserStore } from "@/app/store/useUserStore";

export default function Page() {
  const { user: rawUser, showNotification } = useUserStore();
  const currentUser = rawUser?.user || rawUser;

  const handleSnakeGameOver = async (puntos: number, modoJugado: string) => {
    console.log("DEBUG: Usuario extraído:", currentUser);

    // Validamos que exista el usuario real
    if (!currentUser || !currentUser.id || puntos <= 0) return;

    const payload = {
      userId: currentUser.id,
      player_name: currentUser.name || "JugadorAnonimo",
      game: "SNAKE",
      highScore: puntos,
      screenshotUrl: "SISTEMA_VERIFICADO",
      mode: modoJugado,
    };

    console.log("OBJETO ANTES DE JSON.STRINGIFY:", payload); 

    const exito = await gameService.saveScore(payload);

    if (exito) {
      showNotification(`Récord guardado: ${puntos} pts` , "success");
    } else {
      showNotification("No se pudo guardar el récord", "error");
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