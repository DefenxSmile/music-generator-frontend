export function isNavActive(href: string, pathname: string): boolean {
  const current = pathname.replace(/\/+$/, "") || "/";
  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
}
