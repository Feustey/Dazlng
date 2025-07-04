import AdminAuthPage from "./components/AdminAuthPage";
import type { FC } from "react";

const AdminRoot: FC = () => {
  return <AdminAuthPage />;
};

export default AdminRoot;
export const dynamic = "force-dynamic";