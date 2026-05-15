import { User, Relationship } from "../../types/community";

interface Props {
  users: User[];

  search: string;

  filter: "ALL" | "FRIENDS";

  relationships: Record<number, Relationship>;
}

export function filterUsers({ users, search, filter, relationships }: Props) {
  return users.filter((u) => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" ? true : relationships[u.id]?.status === "ACCEPTED";

    return matchesSearch && matchesFilter;
  });
}
