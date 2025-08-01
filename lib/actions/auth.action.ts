"use server";

// class import menggunakan : ctrl + .

import {auth, db} from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

// 1. sign up
export async function signUp(params: SignUpParams) {
    const {uid, name, password, email} = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: 'User sudah tersedia, silahkan sig-in'
            }
        }

        await db.collection('user').doc(uid).set({
            name: name,
            email: email
        })

    } catch (e: any) {
        console.error('Gagal membuat akun user', e);


        if(e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'Email yang anda gunakan sudah tersedia'
            }
        }
        return {
            success: false,
            message: 'Gagal membuat akun user'
        }

    }
}

// 3. sign in
export async function signIn(params: SignInParams) {
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord) {
            return {
                succes: false,
                message: 'User tidak ditemukan.. Tolong buat akun dulu'
            }
        }

        await setSessionCookies(idToken);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Gagal login ke akun'
        }
    }
}

// 2. create session cookies
export async function setSessionCookies(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK + 1000
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax"
    })
}