# AI Music

Экраны музыкального продукта. Пользователь, регистрация, кредиты и генерация живут в Java. Этот репозиторий их не дублирует и второй бэкенд пользователей не заводит.

## Команды

Нужен Node 20 и npm.

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run lint
npm run build
npm run start
```

`JAVA_API_BASE_URL` попадает в браузерный бандл на сборке. Для `npm run dev` и `npm run build` его читает Next из окружения или из `.env`. Файл `.env` не коммитить. Образец — `.env.example`.

## Папки

- `app/` — маршруты App Router: `/`, `/plans`, `/auth/*`, `/generations`, `/generations/[id]`
- `components/` — оболочка, формы, плеер
- `lib/api/` — один `fetch-json` и вызовы по доменам (`auth`, `me`, `billing`, `generations`)
- `lib/auth/` — access token только в памяти
- `docs/intent/java-api.md` — контракт Java, как он есть в коде
- `.cursor/rules/project-memory.mdc` — уже принятые решения
- `.cursor/skills/`, `.cursor/agents/` — навыки и субагенты; субагенты читают project memory

## Рядом, только чтение

- Java, источник правды по пользователю и генерации: `/Users/i.senkevich/Desktop/mainProjects/music-generator-backend/music-generator-backend`
- Практики фронтенда, rules, skills, agents: `/Users/i.senkevich/Desktop/mainProjects/ViralThumbnails`
- Лендинг, визуальный стиль и ссылки в приложение: `/Users/i.senkevich/Desktop/mainProjects/songs-generator-landing`

## Не делать

- Не заводить второго пользователя, свою таблицу людей или свою сессию помимо access token в памяти и HttpOnly cookie Java.
- Не отправлять в API `utm_*`, click id, `lp_consent` и `idea`: этих полей в Java нет.
- Не показывать цены лендинга и не писать «бесплатно».
- Не ставить метрику и GTM, пока нет отдельного решения.
- Не вызывать `POST /api/v1/internal/runpod/webhook` из браузера.
- Не читать refresh token из JavaScript и не класть его в `localStorage`.
