import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, type AuthFormData } from '../schemas/authSchema';
import { Link } from 'react-router';

interface SignInFormProps {
  title: string;
  submitButtonText: string;
  onSubmit: (data: AuthFormData) => void;
  footerLink: { text: string; to: string };
}

function SignInForm({
  title,
  submitButtonText,
  onSubmit,
  footerLink,
}: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const handleFormSubmit = (data: AuthFormData) => {
    onSubmit(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:border dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            {submitButtonText}
          </button>
        </form>
        {footerLink && (
          <div className="mt-4 text-center">
            <Link
              to={footerLink.to}
              className="text-blue-500 hover:underline dark:text-blue-400"
            >
              {footerLink.text}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignInForm;
