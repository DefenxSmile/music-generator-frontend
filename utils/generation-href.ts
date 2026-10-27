/** Static path so GitHub Pages can open a song without a dynamic route. */
export function generationHref(id: string): string {
  return `/generations/song?id=${encodeURIComponent(id)}`;
}

/** The create workspace, optionally focused on one result. */
export function createWorkspaceHref(id?: string): string {
  if (!id) return "/create";
  return `/create?id=${encodeURIComponent(id)}`;
}
