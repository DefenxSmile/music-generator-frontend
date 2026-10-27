export class ApiError extends Error {
  readonly status: number;
  readonly errorCode: string;
  readonly details: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    errorCode: string,
    details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function apiErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof TypeError) return "Нет связи с сервером";
  return "Не получилось выполнить запрос";
}
