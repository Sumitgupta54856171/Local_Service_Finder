"use server";

import { cookies } from "next/headers";

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken);
  cookieStore.set("refresh_token", refreshToken);
}
