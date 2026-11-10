"use client";

import { useOpenAuth } from "@/hooks/use-open-auth";
import { useMe } from "@/hooks/use-me";
import { useSessionStatus } from "@/hooks/use-session-status";
import { useSignedInHint } from "@/hooks/use-signed-in-hint";
import { ProfileControl } from "@/components/shell/profile-control";
import { showAccountChrome } from "@/utils/session-status";

/** Account control for the mobile bar and the header shown without the rail. */
export function AccountActions() {
  const status = useSessionStatus();
  const signedIn = useSignedInHint();
  const me = useMe();
  const openAuth = useOpenAuth();
  const account = showAccountChrome(status, signedIn);

  if (!account) {
    return (
      <button
        type="button"
        onClick={() => openAuth()}
        className="inline-flex h-9 items-center rounded-lg border border-overlay/15 px-3 text-sm font-medium text-text-primary transition-colors duration-150 hover:bg-overlay/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Войти
      </button>
    );
  }

  const loading = !me.data?.email && (me.isPending || me.isFetching || status === "loading");
  return <ProfileControl email={me.data?.email} loading={loading} compact />;
}
