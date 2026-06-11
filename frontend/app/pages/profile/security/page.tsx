"use client";

import { useUserStore } from "@/app/store/useUserStore";

import { useSecurity } from "@/app/components/hooks/profile/security/useSecurity";

import SecurityCard from "@/app/components/comp_security/securityCard";

export default function SecurityPage() {
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  const security = useSecurity(user.id);

  return <SecurityCard {...security} />;
}
