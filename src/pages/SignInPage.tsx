import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import SignInForm from '../components/SignInForm';
import type { AuthFormData } from '../schemas/authSchema';
import { useAuthStore, API_URL } from '../stores/authStore';

function SignInPage() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignIn = async (data: AuthFormData) => {
    try {
      setError(null);

      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      login(result.user, result.token || '');

      navigate('/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div>
      {error && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-red-500 px-4 py-2 text-white">
          {error}
        </div>
      )}
      <SignInForm
        title="Sign In"
        submitButtonText="Sign In"
        onSubmit={handleSignIn}
        footerLink={{ text: "Don't have an account? Sign Up", to: '/signup' }}
      />
    </div>
  );
}

export default SignInPage;
