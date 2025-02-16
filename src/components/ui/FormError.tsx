interface FormErrorProps {
  message: string;
}

export function FormError({ message }: FormErrorProps) {
  return (
    <p className="mt-2 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}
