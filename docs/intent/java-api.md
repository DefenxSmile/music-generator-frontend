# Java API

Источник: код в `music-generator-backend` на момент этой записи. Здесь только то, что есть в контроллерах, DTO, обработчике ошибок и `application.yml` / `application-dev.yml`. Полей кампании (`utm_*`, click id, `lp_consent`, `idea`) в Java нет: клиент их не отправляет.

Базовый URL браузера — `JAVA_API_BASE_URL`, без хвоста. Все вызовы с `credentials: "include"`.

## CORS

`SecurityConfig` разрешает методы `GET`, `POST`, `DELETE`, `OPTIONS`, заголовки `Authorization`, `Content-Type`, `Idempotency-Key` и `allowCredentials`. Origin берётся из `app.corsOrigins` (строка через запятую).

Браузер всегда ходит в `JAVA_API_BASE_URL` напрямую (и на localhost, и на проде). Отдельного API-слоя Next для Java нет. Сессия: access в памяти вкладки, refresh — HttpOnly cookie Java (`Path=/api/v1/auth`, `Secure`, `SameSite=None`), `credentials: "include"`.

`npm run dev` / `start` / Docker — `http://localhost:3000`, тот же origin, что в `app.postLoginRedirect`. В `app.corsOrigins` на стенде и в проде должны быть origin приложения: сейчас как минимум `http://localhost:3000`, позже `https://app.…`, для тестовых Pages — `https://defenxsmile.github.io`. Старт Яндекса — полный переход на хост Java (PKCE-cookie на домене API).

Боевой хост приложения — поддомен `app`, не корень. Название продукта и домен еще не выбраны. Корень сам по себе API не вызывает.

Другие заголовки (например `x-request-id`) клиент не шлёт: их нет в allow-list, preflight их отвергнет.

## Ошибка

Тело: `errorCode`, `message`, плюс дополнительные поля исключения.

| Ситуация | HTTP | errorCode | message |
| --- | --- | --- | --- |
| Нет или плохой access token, пустой или протухший refresh | 401 | `UNAUTHORIZED` | Нужно войти |
| Неверная почта или пароль | 401 | `INVALID_CREDENTIALS` | Неверная почта или пароль |
| Почта не подтверждена | 403 | `EMAIL_NOT_VERIFIED` | Сначала подтверди почту |
| Нет прав | 403 | `FORBIDDEN` | Недостаточно прав |
| Валидация тела | 400 | `VALIDATION_ERROR` | `поле: сообщение` через `; ` |
| Нечитаемое тело | 400 | `VALIDATION_ERROR` | Некорректное тело запроса |
| Необработанное исключение | 500 | `INTERNAL_ERROR` | Внутренняя ошибка |

401 от фильтра безопасности — JSON `{"errorCode":"UNAUTHORIZED","message":"Нужно войти"}`.

## Вход

Регистрация не открывает сессию.

`POST /api/v1/auth/register`  
Тело: `email`, `password` (8–72). Ответ `201`: `id`, `email`.  
`409 EMAIL_ALREADY_REGISTERED` — «Эта почта уже зарегистрирована», если почта уже подтверждена. Неподтверждённую запись можно перезаписать. Письмо со ссылкой подтверждения уходит с API. Стартовый баланс в коде ставится в 0, затем `grantSignup`. В `application.yml` `app.billing.signup-grant: 0`, поэтому грант не начисляется. `app.billing.generation-cost: 1`.

`POST /api/v1/auth/verify`  
Тело: `token`. Успех `204`. Ошибки: `400 INVALID_TOKEN` «Ссылка недействительна», `400 TOKEN_EXPIRED` «Срок ссылки истёк». Повтор уже использованной ссылки у уже подтверждённой почты — тоже `204`.

`GET /api/v1/auth/verify?token=`  
Отдаёт HTML с самого API («Почта подтверждена. Можно вернуться и войти.»). Второй HTML-страницы подтверждения в приложении нет. Письмо строит ссылку как `{app.publicUrl}/api/v1/auth/verify?token=`.

Продуктовое решение другое: подтверждение почты и пароль в онбординг не входят, см. `docs/decisions/0001-no-email-confirmation.md`. Этот раздел описывает API, как он есть. Экраны больше не вызывают register, login и сброс пароля.

Вход через Яндекс (как в Postman «Генератор музыки → Вход»):

1. Браузер открывает `GET /api/v1/auth/yandex` на `JAVA_API_BASE_URL` (302 на oauth.yandex.ru, PKCE и state в cookie API).
2. Callback на стороне Java: `GET /api/v1/auth/yandex/callback` → редирект на `{приложение}/oauth/callback#code=…` (`app.postLoginRedirect`).
3. Фронт читает `#code=`, сразу убирает его из адреса и вызывает `POST /api/v1/auth/oauth/token` с телом `{ "code" }`. Ответ `200`: `accessToken`, `expiresIn`; ставится cookie `refresh_token`. Код одноразовый (~2 минуты).
4. Дальше как обычно: `POST /api/v1/auth/refresh` и `POST /api/v1/auth/logout` с cookie.

VK в OpenAPI стенда нет. Маршрута `/api/v1/auth/oauth/yandex` нет — старт только `/api/v1/auth/yandex`.

`POST /api/v1/auth/login`  
Тело: `email`, `password`. Ответ `200`: `accessToken`, `expiresIn` (секунды). Ставит cookie `refresh_token`: HttpOnly, Secure, SameSite=None, path=`/api/v1/auth`, max-age = `app.jwt.refresh-ttl` (в dev-профиле 30 дней). Access TTL в dev-профиле 15 минут; клиент опирается на `expiresIn` и на 401, а не на зашитые числа.

`POST /api/v1/auth/refresh`  
Читает cookie `refresh_token`. Ответ `200`: новый `accessToken` и `expiresIn`, плюс новая cookie (старый refresh отзывается). Без годной cookie — 401 «Нужно войти».

`POST /api/v1/auth/logout`  
Читает ту же cookie, отзывает её и отвечает `204` с cookie max-age 0 (те же HttpOnly, Secure, SameSite=None, path).

`POST /api/v1/auth/password/forgot`  
Тело: `email`. Ответ `202`, даже если такой почты нет. Письмо, если пользователь есть, содержит токен и ссылку `{app.publicUrl}/reset-password?token=`. `publicUrl` — хост API, не это приложение. Экрана сброса пароля здесь нет.

`POST /api/v1/auth/password/reset`  
Тело: `token`, `password` (8–72). Успех `204`. Негодный или просроченный токен — `400 INVALID_TOKEN` «Ссылка недействительна». Активные refresh отзываются.

Access token хранится только в памяти вкладки (плюс `expiresIn` → proactive refresh). Refresh token JavaScript не читает и в `localStorage` не пишет. На 401 защищённого запроса клиент один раз вызывает refresh и повторяет запрос. Параллельные 401 делят один refresh: Java при каждом refresh отзывает предыдущую cookie. Полный поток и чеклист деплоя: `docs/intent/session.md`.

Cookie ставит Java на свой хост; фронт её не читает и не переписывает. Chrome на `http://localhost` принимает `Secure` + `SameSite=None` с HTTPS API при credentialed fetch. Отдельной сессии Next нет.

`app.postLoginRedirect` на стенде: `http://localhost:3000/oauth/callback`. Локальный `npm run dev` слушает тот же порт, поэтому после Яндекса callback попадает в это приложение.

## Поддержка

Публичный endpoint (без access token). App и лендинг шлют одно и то же тело.

`POST /api/v1/support/contact`  
Тело (camelCase): `email` (обязательно), `message` (обязательно, до 4000), `name` (до 120), `source` (`app` | `landing`), `pageUrl` (до 2000), `company` (honeypot — непустое → `{ ok: true, skipped: true }` без Telegram).  
Успех `200`: `{ "ok": true }`.  
Нет `TELEGRAM_BOT_TOKEN` / `TELEGRAM_SUPPORT_CHAT_ID` → `503` `SUPPORT_NOT_CONFIGURED` «Канал поддержки не настроен.»  
Сбой Telegram → `502` `SUPPORT_DELIVERY_FAILED`.  
Лимит с одного IP → `429`.

## Профиль и баланс

Нужен `Authorization: Bearer <accessToken>`.

`GET /api/v1/me`  
`id`, `email`, `emailVerified`, `balance`, `createdAt`.

`GET /api/v1/billing/generation-quote`  
`balance`, `cost`, `sufficient` (`balance >= cost`). Оплаты и пополнения в API нет.

## Генерации

Коллекция Postman «Генератор музыки» совпадает с экранами: создать → статус → список; плюс «Я» и «Хватает ли кредита». Локального mock create на фронте нет.

`POST /api/v1/generations`  
Тело: `prompt`, не пустой, до 2000 символов, на сервере обрезаются края. Необязательный заголовок `Idempotency-Key` (после trim не длиннее 200; иначе `400 VALIDATION_ERROR` «Idempotency-Key длиннее 200 символов»). Ответ `202` и одна `GenerationResponse`. Тот же ключ у того же пользователя возвращает уже созданную запись.  
`403 EMAIL_NOT_VERIFIED`.  
`409 GENERATION_IN_PROGRESS` «Уже есть песня в работе», дополнительно `generationId`, если есть активная.  
`402 INSUFFICIENT_CREDITS` «Недостаточно кредитов», дополнительно `balance` и `cost`.

`GET /api/v1/generations` — до 50 записей пользователя, новые сначала.  
`GET /api/v1/generations/{id}` — одна запись. Чужая или неизвестная: `404 NOT_FOUND` «Задача не найдена». Истёкшая: `410 EXPIRED` «Срок хранения трека истёк».

Поля `GenerationResponse`: `id`, `status`, `prompt`, `caption`, `lyrics`, `durationSeconds`, `vocalLanguage`, `instrumental`, `errorCode`, `audioUrl`, `audioUrlExpiresAt`, `expiresAt`, `createdAt`. Пустые ссылки и тексты приходят как `null`.

Статусы в работе, их опрашивают каждые 2 с: `PENDING`, `WRITING`, `MODERATING`, `QUEUED`, `RUNNING`. Конечные: `READY`, `REJECTED`, `FAILED`, `EXPIRED`. Если файл READY уже старше `expiresAt`, ответ показывает статус `EXPIRED` и без `audioUrl`. `audioUrl` — временная ссылка; в `application.yml` `app.generation.audio-url-ttl: 15m`, хранение `retention-days: 30`.

Коды на самой записи, которые ставит процессор: `CONTENT_REJECTED` (статус `REJECTED`), `SONG_DRAFT_INVALID`, `GENERATION_FAILED` (статус `FAILED`).

Лендинг обещает две версии. Этот API отдаёт одну запись. Приложение рисует одну.

`POST /api/v1/internal/runpod/webhook` из браузера не вызывать. Это вход для RunPod с заголовком `X-Runpod-Secret`.
