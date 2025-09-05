import { cn } from "@/utils/utils";
import { ButtonHTMLAttributes } from "react";


type Variant = "primary" | "secondary" | "destructive" | "ghost" | "outline" |"link";
type Size = "sm" | "lg" | "icon" | "default";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90", 
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline:
    "border bg-background text-foreground hover:text-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<Size, string> = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9 rounded-md",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "default",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}