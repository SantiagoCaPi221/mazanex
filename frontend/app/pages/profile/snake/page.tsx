"use client";

import GoogleSnake from "@/app/components/GoogleSnake";
import { gameService } from "@/app/clients/gameService";
import { useUserStore } from "@/app/store/useUserStore";

export default function Page() {
  const { user, showNotification } = useUserStore();

const handleSnakeGameOver = async (puntos: number, modoJugado: string) => {
    console.log("DEBUG: ¿Cómo se llama mi usuario?", JSON.stringify(user, null, 2));

    if (!user || puntos <= 0) return;


    const payload = {
      userId: user.id,
      player_name: user.name || "JugadorAnonimo", // Forzamos un string por seguridad
      game: "SNAKE",
      highScore: puntos,
      screenshotUrl: "SISTEMA_VERIFICADO",
      mode: modoJugado,
    };

// IMPRIME EL OBJETO ANTES DEL STRINGIFY PARA VER SI REALMENTE TIENE LA LLAVE
    console.log("OBJETO ANTES DE JSON.STRINGIFY:", payload); 

    const exito = await gameService.saveScore(payload);

    if (exito) {
      showNotification(`Récord guardado: ${puntos} pts` , "success");
    } else {
      showNotification("No se pudo guardar el récord", "error"); // Agregamos mensaje de error
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