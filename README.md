# AI Music

Фронтенд на Next.js 15. Пользователь и генерация — в Java API. Секреты в git не класть: рабочий файл `.env` в `.gitignore`, в репозитории только `.env.example`.

## Адрес API

Браузер ходит напрямую в `JAVA_API_BASE_URL` с cookie. Локально Java слушает порт 8080, если в её конфиге не задан другой:

```bash
JAVA_API_BASE_URL=http://localhost:8080
```

Значение вшивается в клиентский бандл при `next dev` / `next build`. Это адрес, который видит браузер, а не сеть контейнера.

Приложение открывается на `http://localhost:3000`. Этот origin уже есть в dev-профиле Java (`app.cors-origins`). Другой origin нужно добавить в `app.corsOrigins` в Java. Подробности и ограничение cookie `Secure` на `http://localhost` — в `docs/intent/java-api.md`.

Ключи OpenRouter и RunPod этому приложению не нужны. В `.env.example` они пустые и относятся к Java.

## Локально

```bash
npm install
cp .env.example .env
npm run dev
```

Лендинг в соседнем репозитории тоже занимает порт 3000. Одновременно с ним этот dev-сервер не поднять.

## Docker

Образ standalone, как у лендинга. `JAVA_API_BASE_URL` — build-arg, потому что браузер забирает его из собранного бандла.

```bash
docker build --build-arg JAVA_API_BASE_URL=http://localhost:8080 -t ai-music .
docker run --rm -p 3000:3000 ai-music
```

Проверка: `npm run typecheck`, `npm run lint`, `npm run build`. То же запускает GitHub Actions на `main` и на pull request (`.github/workflows/ci.yml`), плюс сборка Docker-образа.

Образ публикуется в GHCR только с `main`, и только если в репозитории задана переменная `JAVA_API_BASE_URL`. Без неё в бандл попал бы `http://localhost:8080`. Хост, на котором крутится контейнер, в этом репозитории не выбран.
