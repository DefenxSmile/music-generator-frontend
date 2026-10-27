import { Suspense } from "react";
import { CreateWorkspace } from "@/components/create/create-workspace";
export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <CreateWorkspace />
    </Suspense>
  );
}
