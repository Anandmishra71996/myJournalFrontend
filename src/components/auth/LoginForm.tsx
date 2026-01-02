'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import {
  validateLoginForm,
  type LoginFormData,
} from '@/validations';

interface LoginFormProps {
  onSignupClick?: () => void;
}

export default function LoginForm({ onSignupClick }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  const validateField = (field: string, value: string) => {
    const validation = validateLoginForm({
      email: field === 'email' ? value : formData.email,
      password: field === 'password' ? value : formData.password,
    });

    const newErrors = { ...errors };
    if (validation.errors?.[field]) {
      newErrors[field] = validation.errors[field];
    } else {
      delete newErrors[field];
    }
    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData({ ...formData, [name]: trimmedValue });

    if (touched[name]) {
      validateField(name, trimmedValue);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field as keyof typeof formData]);
  };

  const isFormValid = () => {
    const validation = validateLoginForm(formData);
    return validation.success && !Object.keys(errors).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate entire form
    const validation = validateLoginForm(formData);

    if (!validation.success) {
      setErrors(validation.errors || {});
      toast.error('Please fix the errors above');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);

      toast.success('Welcome back!');

      // Redirect based on profile completion
      const user = useAuthStore.getState().user;
      if (user?.isProfileCompleted === false) {
        router.push('/profile');
      } 
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    onSignupClick?.();
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white ${
              errors.email && touched.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-indigo-500'
            }`}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white ${
                errors.password && touched.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-indigo-500'
              }`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && touched.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:shadow-lg disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold mt-8"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <button 
            onClick={handleSignupClick}
            className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
