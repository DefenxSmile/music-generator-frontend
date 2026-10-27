import { Disc3 } from "lucide-react";
import { ComingSoon } from "@/components/soon/coming-soon";
export default function ReleasePage() {
  return (
    <ComingSoon
      title="Релиз"
      lead="Готовую песню можно будет выложить на площадки. Обложка и видео идут следом."
      icon={Disc3}
    />
  );
}
