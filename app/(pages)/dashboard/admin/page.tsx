import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminPanelClient from './AdminPanelClient';

// Server Component - runs on the server
export default async function AdminPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    redirect('/dashboard/profile');
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/admin/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      console.log('Admin verification failed:', response.status, response.json());
      redirect('/dashboard/profile');
    }

    const adminData = await response.json();

    // Check if user is actually an admin
    if (!adminData.isAdmin) {
      redirect('/dashboard/profile');
    }

    // If we get here, user is authenticated and is an admin
    // Render the client component
    return <AdminPanelClient />;
  } catch (error) {
    console.error('Error verifying admin status:', error);
    redirect('/dashboard/profile');
  }
}