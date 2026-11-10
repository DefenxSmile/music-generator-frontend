# Сессия end-to-end

Фронт не хранит свою сессию и не поднимает BFF. Пользователь и refresh живут в Java.

## Модель

| Что | Где |
| --- | --- |
| Access token | Память вкладки (`utils/access-token.ts`), опционально `expiresAt` из `expiresIn` |
| Refresh token | HttpOnly cookie Java (`Path=/api/v1/auth`, `Secure`, `SameSite=None`) |
| Logout intent | `localStorage` `lp_logged_out` — не восстанавливать сессию после выхода |
| Signed-in hint | `sessionStorage` `lp_signed_in` — ранний qualify-hold и хром аккаунта на этой вкладке |

JavaScript **не** читает refresh cookie и **не** кладёт access в `localStorage`.

## Фазы (`SessionStatus`)

```
booting (loading)
   ├─→ authenticated   // access в памяти
   ├─→ anonymous       // нет сессии
   └─→ resume_failed   // был hint, refresh не восстановил; hold снят
```

Хелперы: `utils/session-status.ts` (`isAuthenticated`, `isLoggedOut`, `showAccountChrome`).

## Потоки

1. **Вход (Яндекс):** полный переход на `GET {JAVA_API_BASE_URL}/api/v1/auth/yandex` → callback Java → `/oauth/callback#code=` → `POST /api/v1/auth/oauth/token` → access в памяти + cookie refresh. Код из адреса убирается сразу, stash чистится после успеха.
2. **Resume (F5 / новая вкладка):** один `session` query: если `lp_logged_out` — null; иначе существующий access или `POST /auth/refresh` (timeout 12s, single-flight).
3. **Работа:** `fetchJson` шлёт Bearer; на 401 один refresh и retry. Параллельно — proactive refresh за ~60s до `expiresAt` (тот же single-flight).
4. **Выход:** `POST /auth/logout` best-effort → `lp_logged_out` + clear access → BroadcastChannel / `storage` другим вкладкам.
5. **Resume failed:** статус `resume_failed`, баннер «Повторить / Войти», `data-qualify-hold` не держится.

Квалификация открывается только при `authenticated`. Hold: `loading` или открытое окно вопросов.

## Чеклист деплоя (CORS / cookie)

После смены хоста или стенда проверить **на Java** и в браузере:

1. `app.corsOrigins` содержит origin приложения (`http://localhost:3000`, Pages, позже `https://app.…`).
2. `app.postLoginRedirect` указывает на `{origin}/oauth/callback`.
3. Ответ `POST /api/v1/auth/oauth/token` и `/auth/refresh` ставят `Set-Cookie: refresh_token=…; HttpOnly; Secure; SameSite=None; Path=/api/v1/auth` (не на 302 callback Яндекса).
4. Application origin ходит на API **напрямую** (fetch без `credentials: "include"` — по решению стенда).
5. Сценарий: вход → F5 → `POST /refresh` 200 → `GET /me` с email; квалификация не открывается повторно.
6. Выход → F5 → anonymous; другая вкладка тоже сбрасывает access.
7. Без cookie / с плохим CORS: фронт уходит в `resume_failed` или anonymous, hold не залипает.

Контракт API: `docs/intent/java-api.md`. Пирамида тестов: `tests/unit|component|integration`, правило `.cursor/rules/test-pyramid.mdc`.
