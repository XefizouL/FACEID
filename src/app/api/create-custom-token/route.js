// src/app/api/create-custom-token/route.js
import { NextResponse } from 'next/server';
import admin from 'firebase-admin'; 
import '../../../lib/firebase-admin';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;
    const customToken = await admin.auth().createCustomToken(uid);

    return NextResponse.json({ token: customToken });

  } catch (error) {
    console.error("Error al crear custom token:", error);
    return NextResponse.json({ error: 'Usuario no encontrado o error interno.' }, { status: 500 });
  }
}