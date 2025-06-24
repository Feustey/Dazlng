import { redirect } from 'next/navigation';
import type { FC } from 'react';

const UserRoot: FC = () => {
  redirect('/user/dashboard');
  return null;
  );

export default UserRoot;
