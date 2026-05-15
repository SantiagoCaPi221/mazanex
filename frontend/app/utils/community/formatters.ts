export function getInitials(
    name: string
  ) {
    return (
      name?.substring(0, 2).toUpperCase() ||
      "??"
    );
  }