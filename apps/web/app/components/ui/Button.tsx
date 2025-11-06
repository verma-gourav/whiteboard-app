import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "ghost";
  size: "sm" | "md" | "lg";
  text?: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-light-primary text-light hover:bg-[#3a369f] dark:bg-dark-primary dark:text-dark dark:hover:bg-[#cac8ff]",
  ghost:
    "text-black hover:bg-violet-100 dark:text-white dark:hover:bg-dark-secondary/30",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  variant,
  size = "md",
  text,
  icon,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 ${variantClasses[variant]} ${sizeClasses[size]}  ${className}`}
    >
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );
};

export default Button;
