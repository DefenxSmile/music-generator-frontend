/** Full-screen pause while a step is still opening. The label stays for assistive tech. */
export function Loading({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" aria-label={label} className="lp-boot">
      <div className="lp-boot-glow" aria-hidden />
      <p aria-hidden className="lp-boot-mark">
        AI Music
      </p>
    </div>
  );
}
