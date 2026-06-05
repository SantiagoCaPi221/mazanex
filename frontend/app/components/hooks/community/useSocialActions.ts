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
  const { user, showNotification } = useUserStore();

  const handleSocialAction = async (targetId: number) => {
    if (!user?.id) {
      showNotification("Debes iniciar sesión", "error");
      return;
    }

    const rel = relationships[targetId] || {
      status: "NONE",
      isSender: false,
    };

    let status = rel.status;

    if (rel.status === "NONE") {
      await socialService.sendRequest(user.id, targetId);
      status = "PENDING";
    }

    if (rel.status === "PENDING" && rel.isSender) {
      await socialService.cancelRequest(user.id, targetId);
      status = "NONE";
    }

    if (rel.status === "PENDING" && !rel.isSender) {
      await socialService.acceptRequest(targetId, user.id);
      status = "ACCEPTED";
    }

    if (rel.status === "ACCEPTED") {
      if (!confirm("Eliminar amigo?")) return;
      await socialService.removeFriend(user.id, targetId);
      status = "NONE";
    }

    setRelationships((prev) => ({
      ...prev,
      [targetId]: { ...rel, status },
    }));

    showNotification("Acción realizada", "success");
  };

  return { handleSocialAction };
}
