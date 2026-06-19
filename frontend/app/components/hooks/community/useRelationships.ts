"use client";

import { useEffect, useState } from "react";
import { socialService } from "@/app/clients/socialService";
import { useUserStore } from "@/app/store/useUserStore";

import type { Relationship, User } from "@/app/components/types/community";

export function useRelationships(users: User[]) {
  const { user: rawUser } = useUserStore();
  const currentUser = rawUser?.user || rawUser;

  const [relationships, setRelationships] = useState<Record<number, Relationship>>({});
  const [loadingRelationships, setLoading] = useState(true);

  const fetchRelationships = async () => {
    // Verificación extra de seguridad
    if (!currentUser?.id) return;

    setLoading(true);

    try {
      const map: Record<number, Relationship> = {};

      // Hacemos las consultas por cada usuario en la lista
      await Promise.all(
        users.map(async (u) => {
          // Usamos currentUser.id que ya garantizamos que existe
          map[u.id] = await socialService.getRelationshipStatus(currentUser.id, u.id);
        })
      );

      setRelationships(map);
    } catch (error) {
      console.error("Error al obtener relaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ahora validamos con el currentUser correcto
    if (!users || users.length === 0 || !currentUser?.id) {
      setLoading(false); 
      return;            
    }

    // Si todo está bien, disparamos la búsqueda
    fetchRelationships();
  }, [users, currentUser?.id]); // Escuchamos cambios en currentUser

  return {
    relationships,
    setRelationships,
    loadingRelationships,
  };
}