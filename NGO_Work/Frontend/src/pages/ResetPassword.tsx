import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetPasswordMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: (data: any) => {
      setSuccessMsg(data.message || 'Password reset successful!');
      toast.success('Password reset successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    },
    onError: (error: any) => {
      setErrorMsg(error.message || 'Invalid or expired token.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!token) {
      setErrorMsg('No password reset token was provided.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMsg('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    resetPasswordMutation.mutate({ token, newPassword: password });
  };

  return (
    <div className="flex-grow flex items-center justify-center card-content md:p-12 relative overflow-hidden min-h-screen bg-[#f9f9f9]">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#b6c5f6] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#fed813] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-[480px] p-6 sm:p-12 relative z-10 border border-[#c5c6cf]/30">
        {/* Brand & Heading */}
        <div className="w-full flex flex-col items-center justify-center bg-white mb-8">
          <img
            alt="Valmiki Samaj Trust Logo"
            className="h-[80px] w-[80px] mx-auto mb-4 rounded-full border border-[#c5c6cf] shadow-sm object-cover"
            src="/logo.jpg"
          />
          <h2 className="text-3xl font-extrabold text-primary mb-2 text-center">Reset Password</h2>
          <p className="text-body text-center">Please enter your new password below.</p>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {errorMsg}
          </div>
        )}

        {!token && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm mb-6 text-center">
            <span className="material-symbols-outlined text-[32px] text-red-600 block mb-2">
              warning
            </span>
            No reset token found. Please request a new password reset link.
            <div className="mt-4">
              <Link
                to="/forgot-password"
                className="inline-block py-2 px-4 rounded-lg bg-[#fed813] text-primary font-bold text-sm"
              >
                Request Link
              </Link>
            </div>
          </div>
        )}

        {successMsg ? (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
              <span className="material-symbols-outlined text-[32px] text-green-600 block mb-2">
                check_circle
              </span>
              {successMsg}
            </div>
            <p className="text-sm text-slate-500">Redirecting you to sign in page...</p>
            <Link
              to="/login"
              className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-[14px] font-bold text-primary bg-[#fed813] hover:bg-opacity-90 transition-colors duration-200"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          token && (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label className="block text-[14px] font-semibold text-[#1a1c1c] mb-1" htmlFor="password">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#75777f] text-[20px]">lock</span>
                  </div>
                  <input
                    className="block w-full pl-[40px] pr-[40px] py-2 border border-[#c5c6cf] rounded-lg bg-white text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#061941] focus:border-transparent transition-colors text-[16px] placeholder-muted"
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#75777f] hover:text-[#1a1c1c] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-[14px] font-semibold text-[#1a1c1c] mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#75777f] text-[20px]">lock</span>
                  </div>
                  <input
                    className="block w-full pl-[40px] pr-3 py-2 border border-[#c5c6cf] rounded-lg bg-white text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#061941] focus:border-transparent transition-colors text-[16px] placeholder-muted"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-[14px] font-bold text-primary bg-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200 disabled:opacity-50"
                type="submit"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
