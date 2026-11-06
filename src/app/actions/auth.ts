"use server";

import { revalidatePath } from "next/cache";
import { loginUser, registerUser, logoutUser } from "@/lib/auth";
import { UserRole, EngineeringDomain } from "@prisma/client";

export type AuthState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Vă rugăm să completați adresa de email și parola." };
  }

  try {
    await loginUser(email, password);
    revalidatePath("/");
    return { success: true, message: "Autentificare reușită!" };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Eroare la autentificare.";
    return { success: false, error: errorMsg };
  }
}

export async function registerAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const role = formData.get("role") as UserRole;

  if (!email || !password || !firstName || !lastName || !role) {
    return { success: false, error: "Toate câmpurile de bază sunt obligatorii." };
  }

  if (password.length < 6) {
    return { success: false, error: "Parola trebuie să aibă cel puțin 6 caractere." };
  }

  try {
    const specialization = (formData.get("specialization") as string) || undefined;
    const studyYear = formData.get("studyYear") ? Number(formData.get("studyYear")) : undefined;
    const group = (formData.get("group") as string) || undefined;
    const domain = (formData.get("domain") as EngineeringDomain) || undefined;

    const companyName = (formData.get("companyName") as string) || undefined;
    const cuiCif = (formData.get("cuiCif") as string) || undefined;
    const city = (formData.get("city") as string) || undefined;
    const address = (formData.get("address") as string) || undefined;

    await registerUser({
      email,
      password,
      firstName,
      lastName,
      role,
      specialization,
      studyYear,
      group,
      domain,
      companyName,
      cuiCif,
      city,
      address,
    });

    revalidatePath("/");
    return { success: true, message: "Cont creat cu succes!" };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Eroare la înregistrare.";
    return { success: false, error: errorMsg };
  }
}

export async function logoutAction() {
  await logoutUser();
  revalidatePath("/");
}
