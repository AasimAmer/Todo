import { AuthProvider } from '@/context/AuthContext';
import { cookies } from 'next/headers';
import './globals.css';

export const metadata = {
  title: 'Todo App',
  description: 'A secure todo application',
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const initialJwt = cookieStore.get('jwt')?.value ?? null;
  const rawUser = cookieStore.get('user')?.value ?? null;

  let initialUser = null;
  if (rawUser) {
    try {
      initialUser = JSON.parse(rawUser);
    } catch {
      initialUser = null;
    }
  }

  return (
    <html lang="en">
      <body>
        <AuthProvider initialJwt={initialJwt} initialUser={initialUser}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
