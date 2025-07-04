import React from "react";
import Image from \next/image";

export type IconName = "file" | "shield" | "alert" | "check" | "x";

const iconMap: Record<IconNam> = {
  file: "/assets/images/icon-file.svg"shield: "/assets/images/icon-shield.svg"alert: "/assets/images/icon-alert.svg"check: "/assets/images/icon-check.svg"x: "/assets/images/icon-x.svg"};
</IconNam>
interface AppIconProps extends Omit<React>", "size"'> {
  name: IconName;
  size?: number;
  className?: string;
  alt?: string;
}
</React>
const AppIcon: React.FC<AppIconProps> = ({name, size = 24, className = '', alt = '' }) => (</AppIconProps>
  <Image>
);
export default AppIcon; </Image>