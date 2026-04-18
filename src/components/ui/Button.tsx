import { JSX } from "solid-js";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  class?: string;
  children: JSX.Element;
}

export default function Button(props: ButtonProps) {
  const variant = props.variant || "primary";
  const size = props.size || "md";

  const variantStyles = {
    primary: "bg-primary text-on-primary font-bold hover:opacity-90 active:opacity-75",
    secondary:
      "bg-surface-container-high border border-outline-variant text-on-surface hover:bg-secondary-container",
    ghost: "text-secondary hover:text-on-background hover:bg-surface-container rounded-md",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs rounded",
    md: "px-3 py-1.5 text-xs rounded",
    lg: "px-4 py-2 text-sm rounded",
  };

  return (
    <button
      {...props}
      class={`transition-colors duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${
        props.class || ""
      }`}
    >
      {props.children}
    </button>
  );
}
