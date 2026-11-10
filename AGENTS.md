# AI Music

Экраны музыкального продукта. Пользователь, регистрация, кредиты и генерация живут в Java. Этот репозиторий их не дублирует и второй бэкенд пользователей не заводит.

## Команды

Нужен Node 20 и npm.

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # tests/unit + component + integration
npm run test:unit
npm run test:component
npm run test:integration
npm run typecheck
npm run lint
npm run build
npm run start
```

`JAVA_API_BASE_URL` попадает в браузерный бандл на сборке. Для `npm run dev` и `npm run build` его читает Next из окружения или из `.env`. Файл `.env` не коммитить. Образец — `.env.example`.

GitHub Actions (`.github/workflows/ci.yml`) на `main` и на pull request гоняет lint, typecheck, build и сборку образа. Публикация образа в GHCR — только с `main` и только когда в репозитории задана переменная `JAVA_API_BASE_URL`. Тестовый сайт — GitHub Pages, workflow `.github/workflows/pages.yml`, адрес `https://defenxsmile.github.io/music-generator-frontend/`. Origin для CORS в Java: `https://defenxsmile.github.io`.

## Папки

- `app/` — только маршруты: страница монтирует один экран. `/`, `/create`, `/video`, `/release`, `/plans`, `/auth/*`, `/generations`, `/generations/song`
- `components/` — один компонент на файл, по областям: `shell`, `auth`, `create`, `song`, `plans`, `soon`, `ui`. В корень `components/` новые файлы не класть
- `hooks/` — один хук на файл. Экраны не собирают `queryKey` сами
- `requests/` — HTTP и опции TanStack Query, по одному ресурсу на файл
- `types/` — типы доменов. `utils/` — чистые функции и локальное хранение: токен, лид, квалификация, идея, ссылки и статус песни, тарифы
- `tests/` — пирамида: `unit/`, `component/`, `integration/`. Рядом с исходниками тесты не класть
- `docs/intent/java-api.md` — контракт Java, как он есть в коде
- `docs/intent/session.md` — сессия end-to-end и чеклист CORS/cookie
- `docs/intent/product.md` — версии продукта, активация и экраны онбординга
- `docs/decisions/` — принятые решения, в том числе регистрация без подтверждения почты
- `.cursor/rules/project-memory.mdc` — уже принятые решения
- `.cursor/rules/ui-quality.mdc` и `.cursor/skills/ui-quality/SKILL.md` — планка интерфейса на каждую правку вёрстки и новую фичу
- `.cursor/rules/test-pyramid.mdc` и `.cursor/skills/test-pyramid/SKILL.md` — где и как писать тесты
- `.cursor/skills/`, `.cursor/agents/` — навыки и субагенты; субагенты читают project memory

## Рядом, только чтение

- Java, источник правды по пользователю и генерации: `/Users/i.senkevich/Desktop/mainProjects/music-generator-backend/music-generator-backend`
- Практики фронтенда, rules, skills, agents: `/Users/i.senkevich/Desktop/mainProjects/ViralThumbnails`
- Лендинг, визуальный стиль и ссылки в приложение: `/Users/i.senkevich/Desktop/mainProjects/songs-generator-landing`

## Не делать

- Не заводить второго пользователя, свою таблицу людей или свою сессию помимо access token в памяти и HttpOnly cookie Java.
- Не отправлять в API `utm_*`, click id, `lp_consent` и `idea`: этих полей в Java нет.
- Цены на `/plans` — те же три превью-тарифа, что на лендинге. Оплаты в Java нет, кнопка выбора ничего не списывает. Слово «бесплатно» не писать.
- Не ставить метрику и GTM, пока нет отдельного решения.
- Не вызывать `POST /api/v1/internal/runpod/webhook` из браузера.
- Не читать refresh token из JavaScript и не класть его в `localStorage`.
