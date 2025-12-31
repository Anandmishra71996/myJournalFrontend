'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import {
  validateSignupForm,
  getPasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
  getPasswordStrengthWidth,
  type SignupFormData,
} from '@/validations';

interface SignupFormProps {
  onLoginClick?: () => void;
}

export default function SignupForm({ onLoginClick }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong' | null>(null);

  const { register } = useAuthStore();
  const router = useRouter();

  const validateField = (field: string, value: string) => {
    const validation = validateSignupForm({
      name: field === 'name' ? value : formData.name,
      email: field === 'email' ? value : formData.email,
      password: field === 'password' ? value : formData.password,
      confirmPassword: field === 'confirmPassword' ? value : formData.confirmPassword,
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
    setFormData({ ...formData, [name]: name === 'password' ||name==='name' ? value : trimmedValue });

    // Update password strength
    if (name === 'password' && value) {
      setPasswordStrength(getPasswordStrength(value));
    } else if (name === 'password') {
      setPasswordStrength(null);
    }

    if (touched[name]) {
      validateField(name, trimmedValue || value);
    }

    // Update confirm password validation if it has a value
    if (name === 'password' && formData.confirmPassword && touched.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field as keyof typeof formData]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSignupForm(formData);
    if (!validation.success) {
      setErrors(validation.errors || {});
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      await register(validation.data!.email, validation.data!.password, validation.data!.name);
      toast.success('Account created successfully!');

      if (onLoginClick) {
        onLoginClick();
      }

      const user = useAuthStore.getState().user;
      if (user?.isProfileCompleted === false) {
        router.push('/profile');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h2>
        <p className="text-gray-600">
          Join us to start your journaling journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white ${
              errors.name && touched.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-indigo-500'
            }`}
            placeholder="John Doe"
            autoComplete="name"
          />
          {errors.name && touched.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
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

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white ${
              errors.password && touched.password
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-indigo-500'
            }`}
            placeholder="••••••••"
            autoComplete="new-password"
          />

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getPasswordStrengthColor(passwordStrength || 'weak')}`}
                    style={{ width: getPasswordStrengthWidth(passwordStrength || 'weak') }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600">
                  {getPasswordStrengthLabel(passwordStrength || 'weak')}
                </span>
              </div>
            </div>
          )}

          {errors.password && touched.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
          {!errors.password && formData.password && (
            <p className="text-green-600 text-xs mt-1">✓ Password is strong</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur('confirmPassword')}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white ${
              errors.confirmPassword && touched.confirmPassword
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-indigo-500'
            }`}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
          {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
            <p className="text-green-600 text-xs mt-1">✓ Passwords match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:shadow-lg disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold mt-8"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={onLoginClick}
            className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
