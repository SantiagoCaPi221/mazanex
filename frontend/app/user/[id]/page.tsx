"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { profileService } from "@/service/profileService";
import { socialService } from "@/service/socialService";
import { useUserStore } from "@/store/useUserStore";
import {
  Trophy,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  UserPlus,
  Clock,
  UserMinus,
  ShieldAlert,
  Zap,
  X,
} from "lucide-react";

// --- COMPONENTE DE APOYO: AVATAR CON FALLBACK ---
function AvatarPerfil({ src, nombre }: { src: string; nombre: string }) {
  const [error, setError] = useState(false);
  const iniciales = nombre?.substring(0, 2).toUpperCase() || "??";

  if (!src || error) {
    return (
      <div className="w-full h-full bg-slate-200 flex items-center justify-center font-black text-slate-400 text-3xl uppercase">
        {iniciales}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={nombre}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
}

export default function UserPublicProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: bruno, showNotification } = useUserStore();

  const [perfil, setPerfil] = useState<any>(null);
  const [puntajes, setPuntajes] = useState<any[]>([]);
  const [relacion, setRelacion] = useState<any>({ status: "NONE" });
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const cargarDatos = async () => {
    if (!id || !bruno) return;
    try {
      // Usamos los nuevos métodos en inglés
      const data = await socialService.getPublicProfile(Number(id));
      setPerfil(data);

      const res = await socialService.getRelationshipStatus(
        bruno.id,
        Number(id)
      );
      setRelacion(res);

      // Si son amigos (ACCEPTED) o es tu propio perfil
      if (res.status === "ACCEPTED" || bruno.id === Number(id)) {
        const scores = await profileService.getScoresByUserId(Number(id));
        setPuntajes(scores);
      }
    } catch (error) {
      console.error("Error sincronizando perfil público:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id, bruno]);

  const handleReportar = async (puntajeId: number) => {
    if (
      !confirm("¿Reportar evidencia? 3 reportes la eliminarán automáticamente.")
    )
      return;
    const result = await profileService.reportScore(puntajeId);
    if (result?.status === "DELETED") {
      showNotification(
        "Evidencia eliminada por consenso comunitario.",
        "error"
      );
      setPuntajes((prev) => prev.filter((p) => p.id !== puntajeId));
    } else {
      showNotification(`Reporte registrado (${result?.count || 0}/3).`, "info");
    }
  };

  const handleAccionSocial = async () => {
    if (!bruno || !perfil) return;
    let res = null;

    // Adaptado a los nuevos estados (NONE, PENDING, ACCEPTED) y boolean isSender
    if (relacion.status === "NONE") {
      res = await socialService.sendRequest(bruno.id, perfil.id);
    } else if (relacion.status === "PENDING" && relacion.isSender) {
      res = await socialService.cancelRequest(bruno.id, perfil.id);
    } else if (relacion.status === "PENDING" && !relacion.isSender) {
      res = await socialService.acceptRequest(perfil.id, bruno.id);
    } else if (relacion.status === "ACCEPTED") {
      if (confirm(`¿Terminar vínculo con ${perfil.name}?`)) {
        res = await socialService.removeFriend(bruno.id, perfil.id);
      }
    }

    if (res) cargarDatos();
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#030712] gap-4">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!perfil) return null;

  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden">
      {/* VISOR DE IMAGEN (LIGHTBOX) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X className="w-10 h-10" />
          </button>
          <div
            className="relative max-w-5xl w-full flex flex-col items-center gap-4 animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl border border-white/10 object-contain"
              alt="Evidencia"
            />
          </div>
        </div>
      )}

      {/* FONDO DINÁMICO (Cambiado fondoUrl -> backgroundUrl) */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: perfil.backgroundUrl
            ? `url(${perfil.backgroundUrl})`
            : "linear-gradient(to bottom, #1e293b, #030712)",
          imageRendering: perfil.backgroundUrl ? "pixelated" : "auto",
        }}
      />
      <div
        className={`fixed inset-0 -z-10 transition-all duration-700 ${
          showCard ? "bg-slate-950/70 backdrop-blur-[4px]" : "bg-black/20"
        }`}
      />

      <div className="max-w-5xl mx-auto pt-10 pb-20 px-4 relative z-10">
        {/* BARRA DE NAVEGACIÓN SUPERIOR */}
        <div className="flex justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="bg-white/10 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/10 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Regresar
          </button>
          <button
            onClick={() => setShowCard(!showCard)}
            className="bg-white/10 text-white p-4 rounded-2xl backdrop-blur-xl border border-white/10 hover:bg-indigo-600 transition-all shadow-xl"
          >
            {showCard ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* TARJETA DE PERFIL PRINCIPAL */}
        <div
          className={`bg-white/95 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-white transition-all duration-700 transform ${
            showCard
              ? "opacity-100 scale-100"
              : "opacity-0 translate-y-10 scale-95 pointer-events-none"
          }`}
        >
          {/* BANNER CON FALLBACK */}
          <div className="h-64 w-full relative bg-slate-200 overflow-hidden">
            {perfil.bannerUrl ? (
              <img
                src={perfil.bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-slate-800 to-indigo-900 opacity-50" />
            )}
          </div>

          <div className="px-8 md:px-12 pb-16 relative">
            {/* AVATAR CON FALLBACK (Cambiado perfil.nombre -> perfil.name) */}
            <div className="absolute -top-24 left-8 md:left-12 w-40 h-40 md:w-48 md:h-48 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center border-[10px] border-white overflow-hidden">
              <AvatarPerfil src={perfil.avatarUrl} nombre={perfil.name} />
            </div>

            <div className="pt-24 md:pt-28 flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex-1 w-full text-slate-900">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-slate-900">
                    {perfil.name}
                  </h1>
                  <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                </div>
                <p className="text-indigo-600 font-black text-sm mb-6 uppercase italic tracking-[0.3em]">
                  @
                  {perfil.name?.replace(/\s+/g, "").toLowerCase() || "operator"}
                </p>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                  <p className="text-slate-600 font-bold italic leading-relaxed text-lg">
                    "
                    {perfil.bio ||
                      "Este usuario aún no define su protocolo de biografía."}
                    "
                  </p>
                </div>
              </div>

              {bruno.id !== perfil.id && (
                <button
                  onClick={handleAccionSocial}
                  className={`w-full md:w-auto px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 ${
                    relacion.status === "ACCEPTED"
                      ? "bg-rose-50 text-rose-500 border border-rose-100"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {relacion.status === "ACCEPTED" ? (
                    <>
                      <UserMinus className="w-4 h-4" /> Eliminar Amigo
                    </>
                  ) : relacion.status === "PENDING" ? (
                    <>
                      <Clock className="w-4 h-4" /> Solicitud Enviada
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> Enviar Solicitud
                    </>
                  )}
                </button>
              )}
            </div>

            {/* CONDICIONAL DE PRIVACIDAD */}
            {relacion.status !== "ACCEPTED" && bruno.id !== perfil.id ? (
              <div className="mt-12 py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <Lock className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                <h2 className="text-xl font-black text-slate-400 mb-2 uppercase italic tracking-tighter">
                  Registros Encriptados
                </h2>
                <p className="text-slate-400 font-bold max-w-sm mx-auto text-[10px] tracking-widest uppercase">
                  Debes establecer un vínculo social para acceder al muro de
                  evidencias.
                </p>
              </div>
            ) : (
              <div className="mt-16">
                <h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4 italic uppercase tracking-tighter">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  Muro de Evidencias
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {puntajes.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
                      No hay registros verificados.
                    </div>
                  ) : (
                    puntajes.map((score: any) => {
                      const esSnake = score.game === "SNAKE"; // Cambiado score.juego -> score.game
                      return (
                        <div
                          key={score.id}
                          onClick={() =>
                            !esSnake && setSelectedImage(score.screenshotUrl)
                          }
                          className={`relative p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all group overflow-hidden ${
                            esSnake
                              ? "bg-slate-50/50 cursor-default"
                              : "bg-white cursor-pointer hover:shadow-2xl hover:border-indigo-200"
                          }`}
                        >
                          {!esSnake && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                              <img
                                src={score.screenshotUrl}
                                className="w-full h-full object-cover blur-sm"
                              />
                            </div>
                          )}

                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-1">
                                  {score.game}
                                </p>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-500 font-black text-[8px] rounded-lg uppercase border border-indigo-100">
                                  {score.mode || "Standard"}
                                </span>
                              </div>

                              {!esSnake ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReportar(score.id);
                                  }}
                                  className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                  title="Reportar Evidencia Sospechosa"
                                >
                                  <ShieldAlert className="w-5 h-5" />
                                </button>
                              ) : (
                                <Zap className="w-5 h-5 text-amber-400 opacity-30" />
                              )}
                            </div>

                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {/* Cambiado score.puntajeMaximo -> score.highScore */}
                                {score.highScore?.toLocaleString() || "0"}
                              </span>
                              <span className="text-slate-400 font-black text-[10px] uppercase italic">
                                PTS
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
