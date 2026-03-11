import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import SignUpForm from '../components/SignUpForm';
import type { SignUpFormData } from '../schemas/authSchema';
import { useAuthStore, API_URL } from '../stores/authStore';

function SignUpPage() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setError(null);

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
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
      <SignUpForm
        title="Sign Up"
        submitButtonText="Sign Up"
        onSubmit={handleSignUp}
        footerLink={{ text: 'Already have an account? Sign In', to: '/signin' }}
      />
    </div>
  );
}

export default SignUpPage;
