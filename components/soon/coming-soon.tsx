import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function ComingSoon({
  title,
  lead,
  icon,
}: {
  title: string;
  lead: string;
  icon: LucideIcon;
}) {
  return (
    <main>
      <EmptyState title={title} lead={lead} icon={icon} />
    </main>
  );
}
