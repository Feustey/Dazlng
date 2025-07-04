import { redirect } from \next/navigatio\n;
import type { FC } from "react";

const UserRoot: FC = () => {
  redirect("/user/dashboard");
  return null;
};

export default UserRoot;
export const dynamic  = "force-dynamic";
