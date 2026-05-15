"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { socialService } from "@/service/socialService";
import { gameService } from "@/service/gameService";
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

function ProfileAvatar({ src, name }: { src: string; name: string }) {
  const [hasError, setHasError] = useState(false);
  const initials = name?.substring(0, 2).toUpperCase() || "??";

  if (!src || hasError) {
    return (
      <div className="w-full h-full bg-slate-200 flex items-center justify-center font-black text-slate-400 text-3xl uppercase">
        {initials}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
}

export default function UserPublicProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser, showNotification } = useUserStore();

  const [profile, setProfile] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [relationship, setRelationship] = useState<any>({ status: "NONE" });
  const [isLoading, setIsLoading] = useState(true);
  const [showCard, setShowCard] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id || !currentUser) return;
    try {
      const data = await socialService.getPublicProfile(Number(id));
      setProfile(data);

      const res = await socialService.getRelationshipStatus(
        currentUser.id,
        Number(id)
      );
      setRelationship(res);

      if (res.status === "ACCEPTED" || currentUser.id === Number(id)) {
        const userScores = await gameService.getScoresByUserId(Number(id));
        setScores(userScores);
      }
    } catch (error) {
      console.error("Error sincronizando perfil público:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, currentUser]);

  // LA LÓGICA DEL REPORTE BLINDADA CONTRA SPAM
  const handleReport = async (scoreId: number) => {
    if (!currentUser?.id) return;

    if (
      !confirm(
        "¿Reportar evidencia? 3 reportes de usuarios distintos la eliminarán."
      )
    ) {
      return;
    }

    // Pasamos el ID del usuario actual al backend
    const result = await gameService.reportScore(scoreId, currentUser.id);

    // Atrapamos si ya lo había reportado
    if (result?.error === "ALREADY_REPORTED") {
      showNotification(
        "Ya has reportado esta evidencia anteriormente.",
        "error"
      );
      return;
    }

    if (result?.status === "DELETED") {
      showNotification(
        "Evidencia eliminada por consenso comunitario.",
        "error"
      );
      setScores((prev) => prev.filter((p) => p.id !== scoreId));
    } else if (result) {
      showNotification(
        `Reporte registrado (${result.count || 1}/3).`,
        "success"
      );
    }
  };

  const handleSocialAction = async () => {
    if (!currentUser || !profile) return;
    let res = null;

    if (relationship.status === "NONE") {
      res = await socialService.sendRequest(currentUser.id, profile.id);
    } else if (relationship.status === "PENDING" && relationship.isSender) {
      res = await socialService.cancelRequest(currentUser.id, profile.id);
    } else if (relationship.status === "PENDING" && !relationship.isSender) {
      res = await socialService.acceptRequest(profile.id, currentUser.id);
    } else if (relationship.status === "ACCEPTED") {
      if (confirm(`¿Terminar vínculo con ${profile.name}?`)) {
        res = await socialService.removeFriend(currentUser.id, profile.id);
      }
    }

    if (res) fetchData();
  };

  if (isLoading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#030712] gap-4">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!profile) return null;

  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden">
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

      <div
        className="fixed inset-0 -z-20 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: profile.backgroundUrl
            ? `url(${profile.backgroundUrl})`
            : "linear-gradient(to bottom, #1e293b, #030712)",
          imageRendering: profile.backgroundUrl ? "pixelated" : "auto",
        }}
      />
      <div
        className={`fixed inset-0 -z-10 transition-all duration-700 ${
          showCard ? "bg-slate-950/70 backdrop-blur-[4px]" : "bg-black/20"
        }`}
      />

      <div className="max-w-5xl mx-auto pt-10 pb-20 px-4 relative z-10">
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

        <div
          className={`bg-white/95 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-white transition-all duration-700 transform ${
            showCard
              ? "opacity-100 scale-100"
              : "opacity-0 translate-y-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="h-64 w-full relative bg-slate-200 overflow-hidden">
            {profile.bannerUrl ? (
              <img
                src={profile.bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-slate-800 to-indigo-900 opacity-50" />
            )}
          </div>

          <div className="px-8 md:px-12 pb-16 relative">
            <div className="absolute -top-24 left-8 md:left-12 w-40 h-40 md:w-48 md:h-48 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center border-[10px] border-white overflow-hidden">
              <ProfileAvatar src={profile.avatarUrl} name={profile.name} />
            </div>

            <div className="pt-24 md:pt-28 flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex-1 w-full text-slate-900">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-slate-900">
                    {profile.name}
                  </h1>
                  <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                </div>
                <p className="text-indigo-600 font-black text-sm mb-6 uppercase italic tracking-[0.3em]">
                  @
                  {profile.name?.replace(/\s+/g, "").toLowerCase() ||
                    "operator"}
                </p>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                  <p className="text-slate-600 font-bold italic leading-relaxed text-lg">
                    "
                    {profile.bio ||
                      "Este usuario aún no define su protocolo de biografía."}
                    "
                  </p>
                </div>
              </div>

              {currentUser.id !== profile.id && (
                <div className="w-full md:w-auto">
                  {relationship.status === "NONE" && (
                    <button
                      onClick={handleSocialAction}
                      className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                    >
                      <UserPlus className="w-5 h-5" /> Enviar Solicitud
                    </button>
                  )}

                  {relationship.status === "PENDING" &&
                    (relationship.isSender ? (
                      <button
                        onClick={handleSocialAction}
                        className="w-full md:w-auto group bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 border border-transparent px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
                      >
                        <Clock className="w-5 h-5 group-hover:hidden" />
                        <X className="w-5 h-5 hidden group-hover:block" />
                        <span className="group-hover:hidden">
                          Solicitud Enviada
                        </span>
                        <span className="hidden group-hover:block">
                          Cancelar
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={handleSocialAction}
                        className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Aceptar Solicitud
                      </button>
                    ))}

                  {relationship.status === "ACCEPTED" && (
                    <button
                      onClick={handleSocialAction}
                      className="w-full md:w-auto bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3 group"
                    >
                      <UserMinus className="w-5 h-5" /> Eliminar Amigo
                    </button>
                  )}
                </div>
              )}
            </div>

            {relationship.status !== "ACCEPTED" &&
            currentUser.id !== profile.id ? (
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
                  {scores.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
                      No hay registros verificados.
                    </div>
                  ) : (
                    scores.map((score: any) => {
                      const isSnake = score.game === "SNAKE";
                      return (
                        <div
                          key={score.id}
                          onClick={() =>
                            !isSnake && setSelectedImage(score.screenshotUrl)
                          }
                          className={`relative p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all group overflow-hidden ${
                            isSnake
                              ? "bg-slate-50/50 cursor-default"
                              : "bg-white cursor-pointer hover:shadow-2xl hover:border-indigo-200"
                          }`}
                        >
                          {!isSnake && (
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

                              {!isSnake ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReport(score.id);
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
