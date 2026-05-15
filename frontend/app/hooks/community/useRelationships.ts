"use client";

import { useEffect, useState } from "react";

import { socialService } from "@/service/socialService";
import { useUserStore } from "@/store/useUserStore";

import { User, Relationship } from "../../types/community";

export function useRelationships(users: User[]) {
  const { user } = useUserStore();

  const [relationships, setRelationships] = useState<
    Record<number, Relationship>
  >({});

  const [loadingRelationships, setLoadingRelationships] = useState(true);

  const buildRelationshipsMap = async () => {
    if (!user?.id || users.length === 0) return;

    setLoadingRelationships(true);

    try {
      const relationshipEntries = await Promise.all(
        users.map(async (otherUser) => {
          const response = await socialService.getRelationshipStatus(
            user.id,
            otherUser.id
          );

          return [otherUser.id, response];
        })
      );

      setRelationships(Object.fromEntries(relationshipEntries));
    } catch (error) {
      console.error("Error loading relationships:", error);
    } finally {
      setLoadingRelationships(false);
    }
  };

  useEffect(() => {
    buildRelationshipsMap();
  }, [users]);

  return {
    relationships,
    setRelationships,
    loadingRelationships,
  };
}
