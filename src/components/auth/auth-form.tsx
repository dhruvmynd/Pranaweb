import { ReactNode } from 'react';

interface AuthFormProps {
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
  children: ReactNode;
  title: string;
}

export function AuthForm({ onSubmit, error, children, title }: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {children}
        </form>
      </div>
    </div>
  );
}