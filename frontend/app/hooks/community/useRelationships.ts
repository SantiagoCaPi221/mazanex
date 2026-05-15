"use client";

import { useEffect, useState } from "react";
import { socialService } from "@/service/socialService";
import { useUserStore } from "@/store/useUserStore";

import type { Relationship, User } from "@/app/types/community";

export function useRelationships(users: User[]) {
  const { user } = useUserStore();

  const [relationships, setRelationships] = useState<
    Record<number, Relationship>
  >({});

  const [loadingRelationships, setLoading] = useState(true);

  const fetchRelationships = async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      const map: Record<number, Relationship> = {};

      await Promise.all(
        users.map(async (u) => {
          map[u.id] = await socialService.getRelationshipStatus(user.id, u.id);
        })
      );

      setRelationships(map);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (users.length) fetchRelationships();
  }, [users, user?.id]);

  return {
    relationships,
    setRelationships,
    loadingRelationships,
  };
}
