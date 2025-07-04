import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white"};

const sizeClasses = {
  sm: "py-2 px-3 text-sm",
  md: "py-3 px-5 text-base",
  lg: "py-4 px-7 text-lg"};
</HTMLButtonElement>
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = '',
  ...props
}) => {
  return (</ButtonProps>
    <button>
      {children}</button>
    </button>);;

export { Button };
export default Button; `