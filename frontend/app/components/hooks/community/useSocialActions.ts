"use client";

import { socialService } from "@/app/clients/socialService";
import { useUserStore } from "@/app/store/useUserStore";

import type { Relationship } from "@/app/components/types/community";

export function useSocialActions({
  relationships,
  setRelationships,
}: {
  relationships: Record<number, Relationship>;
  setRelationships: React.Dispatch<
    React.SetStateAction<Record<number, Relationship>>
  >;
}) {
  const { showNotification } = useUserStore();

  // Recibe explícitamente tu ID (senderId) desde el orquestador
  const handleSocialAction = async (senderId: number, targetId: number) => {
    if (!senderId) {
      showNotification("Debes iniciar sesión", "error");
      return;
    }

    const rel = relationships[targetId] || {
      status: "NONE",
      isSender: false,
    };

    let status = rel.status;
    let isSender = rel.isSender;

    try {
      if (rel.status === "NONE") {
        await socialService.sendRequest(senderId, targetId);
        status = "PENDING";
        isSender = true; // Actualizamos para que la UI sepa que tú enviaste la soli
      } 
      else if (rel.status === "PENDING" && rel.isSender) {
        await socialService.cancelRequest(senderId, targetId);
        status = "NONE";
        isSender = false;
      } 
      else if (rel.status === "PENDING" && !rel.isSender) {
        await socialService.acceptRequest(targetId, senderId);
        status = "ACCEPTED";
      } 
      else if (rel.status === "ACCEPTED") {
        if (!confirm("¿Eliminar amigo?")) return;
        await socialService.removeFriend(senderId, targetId);
        status = "NONE";
        isSender = false;
      }

      // Actualizamos el estado local para que la UI reaccione al instante
      setRelationships((prev) => ({
        ...prev,
        [targetId]: { ...rel, status, isSender },
      }));

      showNotification("solicitud de amistad enviada", "success");
      
    } catch (error) {
      console.error("Error procesando la solicitud de amistad:", error);
      showNotification("Error de conexión con el servidor", "error");
    }
  };

  return { handleSocialAction };
}