"use client";

import { useState } from "react";

type Props = {
  src?: string;
  name: string;
  className?: string;
};

export function UserAvatar({ src, name, className = "" }: Props) {
  const [error, setError] = useState(false);

  const initials = name?.substring(0, 2).toUpperCase() || "??";

  if (!src || error) {
    return (
      <div
        className={`${className} bg-indigo-500/10 flex items-center justify-center font-black text-indigo-400`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      className={className}
      onError={() => setError(true)}
      alt={name}
    />
  );
}