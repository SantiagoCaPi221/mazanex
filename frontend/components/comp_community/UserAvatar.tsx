"use client";

import { useState } from "react";

type Props = {
  src?: string;
  name: string;
  className?: string;
};

export function UserAvatar({ src, name, className = "" }: Props) {
  const [hasError, setHasError] = useState(false);
  const initials = name?.substring(0, 2).toUpperCase() || "??";

  if (!src || hasError) {
    return (
      <div
        className={`${className} bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black uppercase border border-indigo-500/20`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`${className} object-cover`}
      onError={() => setHasError(true)}
    />
  );
}
