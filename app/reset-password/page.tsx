import { redirect } from "next/navigation";

/** Java mail builds `{publicUrl}/reset-password?token=`. The screen lives at `/auth/reset-password`. */
export default async function LegacyResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const query = token ? `?token=${encodeURIComponent(token)}` : "";
  redirect(`/auth/reset-password${query}`);
}
