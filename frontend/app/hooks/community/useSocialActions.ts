"use client";

import { socialService } from "@/service/socialService";
import { useUserStore } from "@/store/useUserStore";

import { Relationship, RelationshipStatus } from "../../types/community";

import { getRelationship } from "../../utils/community/relationships";

interface Props {
  relationships: Record<number, Relationship>;

  setRelationships: React.Dispatch<
    React.SetStateAction<Record<number, Relationship>>
  >;
}

export function useSocialActions({ relationships, setRelationships }: Props) {
  const { user, showNotification } = useUserStore();

  const updateRelationship = (
    otherUserId: number,
    newStatus: RelationshipStatus,
    isSender: boolean
  ) => {
    setRelationships((prev) => ({
      ...prev,
      [otherUserId]: {
        status: newStatus,
        isSender,
      },
    }));
  };

  const handleSocialAction = async (otherUserId: number) => {
    if (!user?.id) {
      showNotification("You must be logged in", "error");

      return;
    }

    const relationship = getRelationship(relationships, otherUserId);

    let success = false;

    let newStatus: RelationshipStatus = relationship.status;

    let newIsSender = relationship.isSender;

    if (relationship.status === "NONE") {
      success = await socialService.sendRequest(user.id, otherUserId);

      newStatus = "PENDING";
      newIsSender = true;
    } else if (relationship.status === "PENDING" && relationship.isSender) {
      success = await socialService.cancelRequest(user.id, otherUserId);

      newStatus = "NONE";
      newIsSender = false;
    } else if (relationship.status === "PENDING" && !relationship.isSender) {
      success = await socialService.acceptRequest(otherUserId, user.id);

      newStatus = "ACCEPTED";
      newIsSender = false;
    } else if (relationship.status === "ACCEPTED") {
      if (confirm("Remove this user from your friends list?")) {
        success = await socialService.removeFriend(user.id, otherUserId);

        newStatus = "NONE";
        newIsSender = false;
      } else {
        return;
      }
    }

    if (success) {
      updateRelationship(otherUserId, newStatus, newIsSender);

      showNotification(
        newStatus === "ACCEPTED"
          ? "You are now friends!"
          : "Relationship updated",
        "success"
      );
    } else {
      showNotification("Server could not process the action (500)", "error");
    }
  };

  return {
    handleSocialAction,
  };
}
