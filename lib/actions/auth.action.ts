"use server";

// class import menggunakan : ctrl + .

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

// 1. sign up
export async function signUp(params: SignUpParams) {
  const { uid, name, password, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User sudah tersedia, silahkan sig-in",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Berhasil membuat akun user, Tolong untuk login",
    };
  } catch (e: any) {
    console.error("Gagal membuat akun user", e);

    if (e.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email yang anda gunakan sudah tersedia",
      };
    }
    return {
      success: false,
      message: "Gagal membuat akun user",
    };
  }
}

// 3. sign in
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        succes: false,
        message: "User tidak ditemukan.. Tolong buat akun dulu",
      };
    }

    await setSessionCookies(idToken);
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Gagal login ke akun",
    };
  }
}

// 2. create session cookies
export async function setSessionCookies(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK + 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// MENDAPTAKAN SESSION USER YANG SEDANG LOGIN/TIDAK
export async function getCurrentUser(): Promise<User | null> {
  // ambil cookies
  const cookiesStore = await cookies();

  // cek session
  const sessionCookie = cookiesStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    // verifikasi session nya
    const decodeClaims = await auth.verifySessionCookie(sessionCookie, true);

    // ambil data user, dan gunakan session yang sudah di verifikasi
    const userRecord = await db.collection("users").doc(decodeClaims.uid).get();
    if (!userRecord.exists) return null;

    // kembalikan user dan return nya harus as karena promise
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    return null;
  }
}

// CEK USER SUDAH LOGIN ATAU BELUM
export async function isAuthenticated() {
  const user = await getCurrentUser();

  // !! : akan bernilai boolean saja jika terdapat data | tidak bernilai value { logic jika 1 maka = false jika !! maka = !false = true }
  return !!user;
}
