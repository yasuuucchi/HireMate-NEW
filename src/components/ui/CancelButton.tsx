import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface CancelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function CancelButton({
  children,
  className,
  ...props
}: CancelButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(
        "inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
