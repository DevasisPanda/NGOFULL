import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../lib/trpc';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [devLink, setDevLink] = useState('');

  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: (data: any) => {
      setSuccessMsg(data.message || 'Reset link sent successfully!');
      setErrorMsg('');
      if (data.devLink) {
        setDevLink(data.devLink);
      }
    },
    onError: (error: any) => {
      setErrorMsg(error.message || 'An error occurred. Please try again.');
      setSuccessMsg('');
      setDevLink('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setDevLink('');
    forgotPasswordMutation.mutate({ email });
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
          <h2 className="text-3xl font-extrabold text-primary mb-2 text-center">Forgot Password</h2>
          <p className="text-body text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {errorMsg}
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

            {devLink && import.meta.env.DEV && (
              <div className="p-4 text-left bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-sm space-y-2 shadow-sm">
                <p className="font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-600 text-[20px] font-bold">info</span>
                  [Sandbox / Dev Link]
                </p>
                <p className="text-xs text-slate-500">
                  Since the server is in development mode or sandbox email restrictions apply, you can click this link directly to reset your password:
                </p>
                <a href={devLink} className="text-blue-600 underline font-semibold break-all text-xs block">
                  {devLink}
                </a>
              </div>
            )}
            <p className="text-sm text-slate-500">
              Be sure to check your spam/junk folder if you don't receive the email within a couple of minutes.
            </p>
            <Link
              to="/login"
              className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-[14px] font-bold text-primary bg-[#fed813] hover:bg-opacity-90 transition-colors duration-200"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-[14px] font-semibold text-[#1a1c1c] mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#75777f] text-[20px]">mail</span>
                </div>
                <input
                  className="block w-full pl-[40px] pr-3 py-2 border border-[#c5c6cf] rounded-lg bg-white text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#061941] focus:border-transparent transition-colors text-[16px] placeholder-muted"
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-[14px] font-bold text-primary bg-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200 disabled:opacity-50"
              type="submit"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
            </button>

            {/* Bottom Link */}
            <div className="mt-8 text-center">
              <Link
                className="text-[14px] font-semibold text-[#061941] hover:text-secondary transition-colors hover:underline"
                to="/login"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
