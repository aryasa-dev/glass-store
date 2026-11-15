import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5433eb]/30 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[#5433eb] text-white hover:bg-[#4527cd] shadow-[0_4px_16px_rgba(84,51,235,0.3)]":
              variant === "default",
            "border border-[#ebebeb] bg-white text-[#000000] hover:bg-[#f2f4f5]":
              variant === "outline",
            "hover:bg-[#f2f4f5] text-[#000000]": variant === "ghost",
            "h-10 px-5 text-xs": size === "default",
            "h-8 px-3.5 text-xs": size === "sm",
            "h-12 px-6 text-sm": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
