import { redirect } from 'next/navigation';
import type { FC } from 'react';

const AdminRoot: FC = () => {
  redirect('/admin/auth');
  return null;
};

export default AdminRoot; 