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

GitHub Actions (`.github/workflows/ci.yml`) на `main` и на pull request гоняет lint, typecheck, build и сборку образа. Публикация образа в GHCR — только с `main` и только когда в репозитории задана переменная `JAVA_API_BASE_URL`. Тестовый сайт — GitHub Pages, workflow `.github/workflows/pages.yml`, адрес `https://defenxsmile.github.io/music-generator-frontend/`. Origin для CORS в Java: `https://defenxsmile.github.io`.

## Папки

- `app/` — только маршруты: страница монтирует один экран. `/`, `/create`, `/plans`, `/auth/*`, `/generations`, `/generations/song`
- `components/shell` — оболочка, меню, сессия. `components/auth` — окна входа и вопросов. `components/create` — главная и конструктор. `components/song` — плеер, карточка, список. `components/plans` — тарифы. `components/ui` — общие контролы. В корень `components/` новые файлы не класть
- `lib/api/` — один `fetch-json` и вызовы по доменам (`auth`, `me`, `billing`, `generations`)
- `lib/auth/` — access token в памяти, адрес возврата после входа, локальная сессия `next dev`
- `lib/lead/` — снимок лида, квалификация, идея, согласие и первое касание. `lib/song/` — ссылки, статус и обложка. `lib/plans/` — карточки тарифов. В корне `lib/` только общее: `cn`, `format`, `credits`, адрес Java, префикс хранилища
- `docs/intent/java-api.md` — контракт Java, как он есть в коде
- `docs/intent/product.md` — версии продукта, активация и экраны онбординга
- `docs/decisions/` — принятые решения, в том числе регистрация без подтверждения почты
- `.cursor/rules/project-memory.mdc` — уже принятые решения
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
