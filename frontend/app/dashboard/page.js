import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';

async function getInitialTodos(jwt) {
  try {
    const res = await fetch('http://localhost:1337/api/todos', {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;
  const userCookie = cookieStore.get('user')?.value;

  if (!jwt || !userCookie) {
    redirect('/signin');
  }

  const initialTodos = await getInitialTodos(jwt);
  return <DashboardClient initialTodos={initialTodos} />;
}
