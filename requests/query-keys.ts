/** One key tree. Invalidating a parent refreshes its children. */
export const queryKeys = {
  session: ["session"] as const,
  me: ["me"] as const,
  quote: ["billing", "generation-quote"] as const,
  generations: ["generations"] as const,
  generation: (id: string) => ["generations", id] as const,
};
