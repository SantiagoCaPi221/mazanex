"use client";

import { useUserStore } from "@/store/useUserStore";

import { useSecurity } from "@/app/hooks/profile/security/useSecurity";

import SecurityCard from "@/components/comp_profile/comp_profile_security/SecurityCard";

export default function SecurityPage() {
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  const security = useSecurity(user.id);

  return <SecurityCard {...security} />;
}
