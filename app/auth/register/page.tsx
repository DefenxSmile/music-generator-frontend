import { Suspense } from "react";
import { Loading } from "@/components/ui/loading";
import { RedirectToAuth } from "@/components/auth/redirect-to-auth";

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading label="Открываем идею" />}>
      <RedirectToAuth empty="idea" />
    </Suspense>
  );
}
