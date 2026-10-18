export const ACTIVE_GENERATION_STATUSES = [
  "PENDING",
  "WRITING",
  "MODERATING",
  "QUEUED",
  "RUNNING",
] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Принято",
  WRITING: "Пишем текст",
  MODERATING: "Проверка",
  QUEUED: "В очереди",
  RUNNING: "Собираем трек",
  READY: "Готово",
  REJECTED: "Отклонено",
  FAILED: "Не получилось",
  EXPIRED: "Срок хранения истёк",
};

const ERROR_LABELS: Record<string, string> = {
  CONTENT_REJECTED: "Текст не прошёл проверку",
  SONG_DRAFT_INVALID: "Не получилось собрать песню",
  GENERATION_FAILED: "Не получилось собрать песню",
};

export function isActiveGenerationStatus(status: string): boolean {
  return (ACTIVE_GENERATION_STATUSES as readonly string[]).includes(status);
}

export function generationStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function generationErrorLabel(errorCode: string | null): string | null {
  if (!errorCode) return null;
  return ERROR_LABELS[errorCode] ?? null;
}
