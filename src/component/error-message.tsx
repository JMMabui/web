
interface ErrorMessageProps {
  error?: { message?: string };
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
    if (!error) return null;
  
    return (
      <p className="mt-2 text-sm text-red-600">
        {error.message || 'Campo inválido'}
      </p>
    );
  };
  
  export default ErrorMessage;
  