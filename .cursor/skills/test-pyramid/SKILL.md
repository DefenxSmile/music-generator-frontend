---
name: test-pyramid
description: >-
  Places and writes automated tests for AI Music under tests/unit, tests/component,
  and tests/integration. Use when adding features, fixing bugs, changing utils/requests/hooks/UI,
  or when the user mentions tests, coverage, or the test pyramid.
---

# Пирамида тестов (AI Music)

## Когда применять

Любое изменение поведения: новый util/request/hook, правка UI-примитива, багфикс сессии/HTTP, рефакторинг с риском регрессии. Правило: `.cursor/rules/test-pyramid.mdc`. Рядом с исходниками тесты не класть.

## Пирамида

```
        /\
       /  \      браузер / DevTools (не в tests/)
      /----\
     / int. \    tests/integration — модули + мок fetch
    /--------\
   / component\  tests/component — Testing Library
  /------------\
 /    unit      \ tests/unit — чистые функции
/----------------\
```

Больше всего unit, меньше component, ещё меньше integration. Один сценарий не дублировать на всех слоях без нужды: unit ловит ветки, integration — склейку, component — видимое поведение контрола.

## Куда писать

| Код | Слой | Путь |
|-----|------|------|
| `utils/*.ts` без React | unit | `tests/unit/<name>.test.ts` |
| `requests/*`, связка токен+fetch | integration | `tests/integration/<area>/<name>.test.ts` |
| `components/ui/*` | component | `tests/component/ui/<Name>.test.tsx` |
| экран/диалог с простой логикой | component | `tests/component/<area>/…` |
| полный поток в Chrome | вне пирамиды | skill `browser-testing-with-devtools` |

Импорты только `@/…`. Окружение: jsdom (`vitest.config.ts`). Сеть Java не поднимать — stub `fetch` и env.

## Чеклист на задачу

1. Какие слои затронуты? (часто unit + integration для auth/HTTP; component для ui).
2. Баг → сначала красный тест на слое проявления.
3. Новый файл логики → тест в той же PR/сессии.
4. Запуск: `npm test` или `npm run test:unit` / `test:component` / `test:integration`.
5. Не добавлять `*.test.ts(x)` в `app/`, `components/`, `hooks/`, `requests/`, `utils/`.

## Шаблоны

### Unit

```ts
import { describe, expect, it } from "vitest";
import { readAccessToken } from "@/utils/access-token-response";

describe("readAccessToken", () => {
  it("rejects empty values", () => {
    expect(readAccessToken({ accessToken: "" })).toBeNull();
  });
});
```

### Component

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Создать</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Создать" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### Integration

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { refreshAccessToken } from "@/requests/refresh-access-token";
import { setAccessToken } from "@/utils/access-token";

describe("refreshAccessToken", () => {
  beforeEach(() => {
    vi.stubEnv("JAVA_API_BASE_URL", "https://api.example.test");
    setAccessToken(null);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    setAccessToken(null);
  });

  it("stores access from a 200 body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ accessToken: "t", expiresIn: 60 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    await expect(refreshAccessToken()).resolves.toBe("t");
  });
});
```

## Границы продукта

- Access token только в памяти; refresh — HttpOnly cookie Java. Тесты не читают refresh из JS и не кладут его в `localStorage`.
- Не мокать «успешный вход» через второй бэкенд или Next BFF — только контракт Java (`docs/intent/java-api.md`).
- UI-качество экранов проверяй в браузере; component-тесты покрывают примитивы и явные ветки, не пиксели.

## Связанные skills

- `test-driven-development` — цикл red/green/refactor.
- `browser-testing-with-devtools` — ручной/MCP прогон экрана.
- `ui-quality` — планка вёрстки; тесты её не заменяют.
