"use client";

import { useEffect, useState } from "react";
import { socialService } from "@/app/clients/socialService";
import { useUserStore } from "@/app/store/useUserStore";

import type { Relationship, User } from "@/app/components/types/community";

export function useRelationships(users: User[]) {
  const { user } = useUserStore();

  const [relationships, setRelationships] = useState<Record<number, Relationship>>({});
  // Iniciamos en true, pero nos aseguramos de apagarlo
  const [loadingRelationships, setLoading] = useState(true);

  const fetchRelationships = async () => {
    setLoading(true);

    try {
      const map: Record<number, Relationship> = {};

      await Promise.all(
        users.map(async (u) => {
          // El '!' le dice a TypeScript que estamos seguros de que user.id existe aquí
          map[u.id] = await socialService.getRelationshipStatus(user!.id, u.id);
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
    if (!users || users.length === 0 || !user?.id) {
      setLoading(false); // ... apagamos el loading inmediatamente.
      return;            // y nos salimos.
    }

    // Si pasamos los filtros de arriba, entonces sí vamos al backend a consultar
    fetchRelationships();
  }, [users, user?.id]);

  return {
    relationships,
    setRelationships,
    loadingRelationships,
  };
}