import { redirect } from 'next/navigation';

export default function AccountPage(): never {
  redirect('/user/dashboard');
} 