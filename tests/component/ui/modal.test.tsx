import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "@/components/ui/modal";

function FocusTarget({ focusRef }: { focusRef: { current: HTMLElement | null } }) {
  return (
    <button
      type="button"
      ref={(node) => {
        focusRef.current = node;
      }}
    >
      Поле
    </button>
  );
}

describe("Modal", () => {
  it("opens a labelled dialog and closes from the backdrop", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} label="Тарифы">
        <p>349 ₽</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: "Тарифы" });
    expect(dialog.className).toContain("lp-auth-dialog");
    await userEvent.click(dialog);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("stays open when the backdrop and Escape are blocked", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} dismissable={false} label="Кто вы?">
        <p>Вопрос</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: "Кто вы?" });
    await userEvent.click(dialog);
    dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog).toHaveAttribute("open");
  });

  it("does not close when the click lands on the content", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} label="Тарифы">
        <p>349 ₽</p>
      </Modal>,
    );
    await userEvent.click(screen.getByText("349 ₽"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClosed without onClose when the parent closes it", () => {
    const onClose = vi.fn();
    const onClosed = vi.fn();
    const { rerender } = render(
      <Modal open onClose={onClose} onClosed={onClosed} label="Тарифы">
        <p>349 ₽</p>
      </Modal>,
    );
    rerender(
      <Modal open={false} onClose={onClose} onClosed={onClosed} label="Тарифы">
        <p>349 ₽</p>
      </Modal>,
    );
    expect(onClosed).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("uses a plain frame and moves focus to the requested element", () => {
    const focusRef = { current: null as HTMLElement | null };
    render(
      <Modal open onClose={vi.fn()} chrome="plain" labelledBy="modal-title" initialFocus={focusRef}>
        <h2 id="modal-title">Текст песни</h2>
        <FocusTarget focusRef={focusRef} />
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: "Текст песни" });
    expect(dialog.className).not.toContain("lp-auth-dialog");
    expect(dialog).not.toHaveAttribute("aria-label");
    expect(screen.getByRole("button", { name: "Поле" })).toHaveFocus();
  });
});
