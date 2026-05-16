import { clsx } from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-xs font-sans font-semibold transition-all rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary hover:bg-primary-container hover:-translate-y-px shadow-sm",
        secondary:
          "bg-secondary text-on-secondary hover:bg-secondary-container hover:-translate-y-px shadow-sm",
        outline:
          "border border-primary text-primary bg-transparent hover:bg-primary hover:text-on-primary",
        ghost: "text-on-surface hover:bg-surface-container",
        gold:
          "bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary",
      },
      size: {
        sm: "h-9 px-sm text-label-sm",
        md: "h-11 px-md text-label-lg",
        lg: "h-12 px-lg text-body-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
