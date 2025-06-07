import { redirect } from 'next/navigation';
import type { FC } from 'react';

const AdminRoot: FC = () => {
  redirect('/admin/dashboard');
  return null;
};

export default AdminRoot; 