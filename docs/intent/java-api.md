# Java API

Источник: код в `music-generator-backend` на момент этой записи. Здесь только то, что есть в контроллерах, DTO, обработчике ошибок и `application.yml` / `application-dev.yml`. Полей кампании (`utm_*`, click id, `lp_consent`, `idea`) в Java нет: клиент их не отправляет.

Базовый URL браузера — `JAVA_API_BASE_URL`, без хвоста. Все вызовы с `credentials: "include"`.

## CORS

`SecurityConfig` разрешает методы `GET`, `POST`, `DELETE`, `OPTIONS`, заголовки `Authorization`, `Content-Type`, `Idempotency-Key` и `allowCredentials`. Origin берётся из `app.corsOrigins` (строка через запятую).

`npm run dev` слушает `http://localhost:3010`. Docker по-прежнему слушает `http://localhost:3000` (`PORT` в образе). В `application-dev.yml` уже записано `app.cors-origins: http://localhost:3000`. Для dev-сервера на 3010 этот origin нужно добавить в `app.corsOrigins`, иначе браузер отклонит запросы с cookie. Тестовый сайт GitHub Pages открывается с origin `https://defenxsmile.github.io` — его тоже нужно добавить. Java в этой задаче не меняется.

Боевой хост приложения — поддомен `app`, не корень. Название продукта и домен еще не выбраны. В `app.corsOrigins` для продакшена нужен origin приложения. Корень сам по себе API не вызывает.

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

Целевой вход, которого в контроллерах ещё нет: браузер открывает `GET /api/v1/auth/oauth/yandex` или `GET /api/v1/auth/oauth/vk`. После успеха Java ставит cookie `refresh_token` и возвращает на `{приложение}/oauth/callback`. Пока маршрутов нет, клик не создаёт сессию.

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

Access token хранится только в памяти вкладки. Refresh token JavaScript не читает и в `localStorage` не пишет. На 401 защищённого запроса клиент один раз вызывает refresh и повторяет запрос. Параллельные 401 делят один refresh: Java при каждом refresh отзывает предыдущую cookie.

Cookie с флагом Secure браузер не сохранит на `http://localhost`. Обход через свой refresh в JavaScript не делается. Пока API открыт по HTTP на localhost, после перезагрузки страницы сессию не возобновить; до перезагрузки работает access token из памяти.

`app.postLoginRedirect` есть в свойствах (`application-dev.yml`: `http://localhost:3000/oauth/callback`) и ни одним контроллером не читается. Маршрута OAuth в приложении нет.

## Профиль и баланс

Нужен `Authorization: Bearer <accessToken>`.

`GET /api/v1/me`  
`id`, `email`, `emailVerified`, `balance`, `createdAt`.

`GET /api/v1/billing/generation-quote`  
`balance`, `cost`, `sufficient` (`balance >= cost`). Оплаты и пополнения в API нет.

## Генерации

`POST /api/v1/generations`  
Тело: `prompt`, не пустой, до 2000 символов, на сервере обрезаются края. Необязательный заголовок `Idempotency-Key` (после trim не длиннее 200; иначе `400 VALIDATION_ERROR` «Idempotency-Key длиннее 200 символов»). Ответ `202` и одна `GenerationResponse`. Тот же ключ у того же пользователя возвращает уже созданную запись.  
`403 EMAIL_NOT_VERIFIED`.  
`409 GENERATION_IN_PROGRESS` «Уже есть песня в работе», дополнительно `generationId`, если есть активная.  
`402 INSUFFICIENT_CREDITS` «Недостаточно кредитов», дополнительно `balance` и `cost`.

`GET /api/v1/generations` — до 50 записей пользователя, новые сначала.  
`GET /api/v1/generations/{id}` — одна запись. Чужая или неизвестная: `404 NOT_FOUND` «Задача не найдена». Истёкшая: `410 EXPIRED` «Срок хранения трека истёк».

Поля `GenerationResponse`: `id`, `status`, `prompt`, `caption`, `lyrics`, `durationSeconds`, `vocalLanguage`, `instrumental`, `errorCode`, `audioUrl`, `audioUrlExpiresAt`, `expiresAt`, `createdAt`. Пустые ссылки и тексты приходят как `null`.

Статусы в работе, их опрашивают: `PENDING`, `WRITING`, `MODERATING`, `QUEUED`, `RUNNING`. Конечные: `READY`, `REJECTED`, `FAILED`, `EXPIRED`. Если файл READY уже старше `expiresAt`, ответ показывает статус `EXPIRED` и без `audioUrl`. `audioUrl` — временная ссылка; в `application.yml` `app.generation.audio-url-ttl: 15m`, хранение `retention-days: 30`.

Коды на самой записи, которые ставит процессор: `CONTENT_REJECTED` (статус `REJECTED`), `SONG_DRAFT_INVALID`, `GENERATION_FAILED` (статус `FAILED`).

Лендинг обещает две версии. Этот API отдаёт одну запись. Приложение рисует одну.

`POST /api/v1/internal/runpod/webhook` из браузера не вызывать. Это вход для RunPod с заголовком `X-Runpod-Secret`.
