import { AccountActions } from "@/components/shell/account-actions";
import { Wordmark } from "@/components/shell/wordmark";

export function AccountHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-overlay/8 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-3 px-4">
        <Wordmark />
        <div className="ml-auto">
          <AccountActions />
        </div>
      </div>
    </header>
  );
}
