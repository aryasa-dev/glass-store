"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";

export interface AuthState {
  error?: string;
  success?: boolean;
}

export async function loginAdminAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { error: "Invalid email or password." };
    }

    if (user.role !== "ADMIN") {
      return { error: "Access denied. Administrator privileges required." };
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      return { error: "Invalid email or password." };
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred during authentication." };
  }

  redirect("/admin");
}

export async function logoutAdminAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
