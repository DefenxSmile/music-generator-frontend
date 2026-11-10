# Как получить `TELEGRAM_*` для support

Эти переменные ставятся **только на Java** (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_SUPPORT_CHAT_ID`). Фронты их не читают.

## 1. Создать бота

1. Открой Telegram → [@BotFather](https://t.me/BotFather).
2. Команда `/newbot` → имя и username бота.
3. BotFather пришлёт токен вида `123456:ABC...` → это `TELEGRAM_BOT_TOKEN`.
4. Не коммить токен в git; только `.env` / secrets стенда.

## 2. Создать чат для тикетов

Удобнее **группа** или супергруппа (не личка с ботом):

1. Создай группу, например «AI Music Support».
2. Добавь туда бота.
3. Сделай бота админом с правом писать сообщения (для супергрупп часто нужно).

## 3. Узнать `chat_id`

**Вариант A — через getUpdates**

1. Напиши в группу любое сообщение (чтобы апдейт появился).
2. В браузере или curl:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates"
```

3. В JSON найди `"chat":{"id": -100xxxxxxxxxx}` — это `TELEGRAM_SUPPORT_CHAT_ID` (у групп обычно отрицательный, часто с `-100`).

**Вариант B — бот вроде @userinfobot / @getidsbot**  
Добавь в группу, он покажет id чата.

## 4. Проверить отправку

```bash
curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"<TELEGRAM_SUPPORT_CHAT_ID>","text":"support ping"}'
```

Сообщение должно появиться в чате.

## 5. Прописать на Java

В `.env` бекенда:

```bash
TELEGRAM_BOT_TOKEN=...
TELEGRAM_SUPPORT_CHAT_ID=...
```

В `application.yml` уже есть:

```yaml
app:
  telegram:
    bot-token: ${TELEGRAM_BOT_TOKEN:}
    support-chat-id: ${TELEGRAM_SUPPORT_CHAT_ID:}
```

Перезапусти Java. Без этих значений `POST /api/v1/support/contact` отвечает `503`.

## 6. CORS

В `app.corsOrigins` должны быть origin **приложения** и **лендинга** (через запятую), иначе браузер заблокирует POST с формы.
