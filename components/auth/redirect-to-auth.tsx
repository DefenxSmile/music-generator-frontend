"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/ui/loading";

/**
 * Old auth URLs stay reachable.
 * A signup link opens the home idea field. A login link opens the sign-in window there.
 * Campaign and consent params are not forwarded.
 */
export function RedirectToAuth({ empty = "auth" }: { empty?: "auth" | "idea" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idea = searchParams.get("idea")?.trim() ?? "";

  useEffect(() => {
    const params = new URLSearchParams();
    const next = searchParams.get("next");
    if (idea) params.set("idea", idea);
    if (empty === "auth") params.set("auth", "1");
    if (next) params.set("next", next);
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/");
  }, [empty, idea, router, searchParams]);

  return <Loading label={empty === "idea" && !idea ? "Открываем идею" : "Открываем вход"} />;
}
