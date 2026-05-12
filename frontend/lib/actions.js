'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const STRAPI_URL = 'http://localhost:1337';

export async function signInAction(prevState, formData) {
  const identifier = formData.get('identifier');
  const password = formData.get('password');

  if (!identifier || !password) {
    return { error: 'Both fields are required.' };
  }

  let data;
  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    data = await res.json();
    if (!res.ok) {
      return { error: data?.error?.message || 'Invalid credentials.' };
    }
  } catch {
    return { error: 'Could not reach the server. Is Strapi running?' };
  }

  const cookieStore = await cookies();

  // Do NOT use httpOnly — js-cookie needs to read these client-side
  // in AuthContext so the dashboard can make authenticated API calls.
  cookieStore.set('jwt', data.jwt, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  });
  cookieStore.set('user', JSON.stringify(data.user), {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  });

  redirect('/dashboard');
}

export async function signUpAction(prevState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!username || !email || !password) {
    return { error: 'All fields are required.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  let data;
  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    data = await res.json();
    if (!res.ok) {
      return { error: data?.error?.message || 'Registration failed.' };
    }
  } catch {
    return { error: 'Could not reach the server. Is Strapi running?' };
  }

  const cookieStore = await cookies();

  cookieStore.set('jwt', data.jwt, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  });
  cookieStore.set('user', JSON.stringify(data.user), {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  });

  redirect('/dashboard');
}
