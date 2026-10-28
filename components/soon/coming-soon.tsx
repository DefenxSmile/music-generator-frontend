import { EmptyState } from "@/components/ui/empty-state";
import Button from "@/components/ui/Button";

export function ComingSoon({ title, lead }: { title: string; lead: string }) {
  return (
    <main>
      <EmptyState
        title={title}
        lead={lead}
        action={
          <Button href="/create" variant="outline">
            Создать песню
          </Button>
        }
      />
    </main>
  );
}
