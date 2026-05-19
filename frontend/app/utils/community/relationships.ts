import { Relationship } from "../../types/community";

export function isFriend(status: string) {
  return status === "ACCEPTED";
}

export function isPending(status: string) {
  return status === "PENDING";
}

export function getRelationship(
  relationships: Record<number, Relationship>,
  otherUserId: number
): Relationship {
  return (
    relationships[otherUserId] || {
      status: "NONE",
      isSender: false,
    }
  );
}
