"use client";

import { useState } from "react";

import { authService } from "@/app/clients/authService";

import { AUTH_MESSAGES } from "@/app/components/utils/message/authMessage";
import type { SecurityMessage } from "@/app/components/types/security";

export function useSecurity(userId: number) {
  const [pass, setPass] = useState({
    current: "",
    new: "",
  });

  const [msg, setMsg] = useState<SecurityMessage | null>(null);

  const [loading, setLoading] = useState(false);

  const update = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pass.new === pass.current) {
      return setMsg({
        text: AUTH_MESSAGES.samePassword,
        type: "error",
      });
    }

    setLoading(true);
    setMsg(null);

    try {
      const res = await authService.updatePassword(userId, {
        currentPassword: pass.current,

        newPassword: pass.new,
      });

      if (res) {
        setMsg({
          text: AUTH_MESSAGES.passwordUpdated,
          type: "success",
        });

        setPass({
          current: "",
          new: "",
        });
      }
    } catch (error) {
      setMsg({
        text: AUTH_MESSAGES.invalidPassword,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    pass,
    setPass,
    msg,
    loading,
    update,
  };
}
