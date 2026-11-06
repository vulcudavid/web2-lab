import crypto from "crypto";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { UserRole, EngineeringDomain } from "@prisma/client";

const SESSION_COOKIE_NAME = "web2_session_user_id";

/**
 * Hash securizat folosind scrypt din modulul nativ Node.js crypto
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(":");
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(Buffer.from(key, "hex"), derivedKey);
  } catch {
    return false;
  }
}

/**
 * Înregistrare utilizator nou cu crearea profilului asociat rolului
 */
export async function registerUser(params: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  // Date specifice Student
  specialization?: string;
  studyYear?: number;
  group?: string;
  domain?: EngineeringDomain;
  // Date specifice Companie
  companyName?: string;
  cuiCif?: string;
  city?: string;
  address?: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: params.email.toLowerCase().trim() },
  });

  if (existingUser) {
    throw new Error("Un cont cu această adresă de email există deja.");
  }

  const passwordHash = hashPassword(params.password);

  const newUser = await prisma.user.create({
    data: {
      email: params.email.toLowerCase().trim(),
      passwordHash,
      firstName: params.firstName.trim(),
      lastName: params.lastName.trim(),
      role: params.role,
    },
  });

  // Creare profil în funcție de rol
  if (params.role === UserRole.STUDENT) {
    await prisma.studentProfile.create({
      data: {
        userId: newUser.id,
        faculty: "Facultatea de Inginerie ULBS",
        specialization: params.specialization || "Calculatoare",
        studyYear: Number(params.studyYear) || 3,
        group: params.group || "Grupa 331",
        domain: params.domain || EngineeringDomain.COMPUTER_SCIENCE_IT,
        headline: `Student la ${params.specialization || "Inginerie"}`,
      },
    });
  } else if (params.role === UserRole.COMPANY_TUTOR) {
    await prisma.companyProfile.create({
      data: {
        userId: newUser.id,
        companyName: params.companyName || "Companie Parteneră",
        cuiCif: params.cuiCif || `RO${Date.now().toString().slice(-8)}`,
        city: params.city || "Sibiu",
        address: params.address || "Str. Principală",
      },
    });
  }

  // Setare sesiune în cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 zile
  });

  return newUser;
}

/**
 * Autentificare utilizator
 */
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      studentProfile: true,
      companyProfile: true,
    },
  });

  if (!user) {
    throw new Error("Date de autentificare incorecte (email sau parolă greșită).");
  }

  // Verificare hash parolă (suportă atât scrypt, cât și demo hashes)
  const isMatch =
    user.passwordHash.includes(":") 
      ? verifyPassword(password, user.passwordHash)
      : user.passwordHash === password || user.passwordHash.startsWith("demo_");

  if (!isMatch) {
    throw new Error("Date de autentificare incorecte (email sau parolă greșită).");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return user;
}

/**
 * Deconectare utilizator
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Obține utilizatorul curent din sesiune
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            tags: {
              include: { tag: true },
            },
          },
        },
        companyProfile: {
          include: {
            offers: true,
          },
        },
      },
    });

    return user;
  } catch {
    return null;
  }
}
