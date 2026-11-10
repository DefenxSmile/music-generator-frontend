import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QualificationDialog } from "@/components/auth/qualification-dialog";

vi.mock("next/navigation", () => ({
  usePathname: () => "/create",
}));

vi.mock("@/hooks/use-session-status", () => ({
  useSessionStatus: vi.fn(),
}));

vi.mock("@/hooks/use-me", () => ({
  useMe: () => ({ data: undefined }),
}));

vi.mock("@/utils/qualification", async () => {
  const actual = await vi.importActual<typeof import("@/utils/qualification")>("@/utils/qualification");
  return {
    ...actual,
    QUALIFICATION_EVERY_SESSION: false,
    readQualificationDone: () => true,
  };
});

import { useSessionStatus } from "@/hooks/use-session-status";

describe("QualificationDialog hold", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-qualify-hold");
    vi.mocked(useSessionStatus).mockReset();
  });

  it("holds while session is loading", async () => {
    vi.mocked(useSessionStatus).mockReturnValue("loading");
    render(<QualificationDialog />);
    await waitFor(() => {
      expect(document.documentElement.hasAttribute("data-qualify-hold")).toBe(true);
    });
  });

  it("releases hold on resume_failed", async () => {
    document.documentElement.setAttribute("data-qualify-hold", "");
    vi.mocked(useSessionStatus).mockReturnValue("resume_failed");
    render(<QualificationDialog />);
    await waitFor(() => {
      expect(document.documentElement.hasAttribute("data-qualify-hold")).toBe(false);
    });
  });
});
