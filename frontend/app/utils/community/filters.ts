import type {
    Relationship,
    User,
    UsersFilterType,
  } from "../types/community.types";
  
  interface FilterParams {
    users: User[];
    search: string;
    filter: UsersFilterType;
    relationships: Record<number, Relationship>;
  }
  
  export function filterUsers({
    users,
    search,
    filter,
    relationships,
  }: FilterParams) {
    return users.filter((u) => {
      const matchSearch = u.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
  
      const matchFilter =
        filter === "ALL" ||
        relationships[u.id]?.status === "ACCEPTED";
  
      return matchSearch && matchFilter;
    });
  }