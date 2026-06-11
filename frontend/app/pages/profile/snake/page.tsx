"use client";

import GoogleSnake from "@/app/components/GoogleSnake";
import { gameService } from "@/app/clients/gameService";
import { useUserStore } from "@/store/useUserStore";

export default function Page() {
  const { user, showNotification } = useUserStore();

  const handleSnakeGameOver = async (puntos: number, modoJugado: string) => {
    if (!user || puntos <= 0) return;

    // Actualizado al nuevo gameService
    const exito = await gameService.saveScore({
      userId: user.id,
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
