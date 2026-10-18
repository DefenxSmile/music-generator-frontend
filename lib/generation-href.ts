/** Static path so GitHub Pages can open a song without a dynamic route. */
export function generationHref(id: string): string {
  return `/generations/song?id=${encodeURIComponent(id)}`;
}
