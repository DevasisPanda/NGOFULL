import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { trackEvent } from '../utils/analytics';

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();
  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setSuccessMsg(data.message);
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error) => {
      setErrorMsg(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }
    
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMsg('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    
    trackEvent('membership_register');
    registerMutation.mutate({
      name: fullName,
      email: email,
      phone: phone,
      password: password
    });
  };

  return (
    <div className="flex-grow flex items-center justify-center card-content md:p-12 relative overflow-hidden min-h-screen bg-[#f9f9f9]">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#b6c5f6] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#fed813] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
      
      {/* Signup Card */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-[500px] p-6 sm:p-12 relative z-10 border border-[#c5c6cf]/30">
        {/* Brand & Heading */}
        <div className="w-full flex flex-col items-center justify-center bg-white mb-8 relative z-10">
          <img alt="Valmiki Samaj Trust Logo" className="h-[80px] w-[80px] mx-auto mb-4 rounded-full border border-[#c5c6cf] shadow-sm object-cover shrink-0" src="/logo.jpg" />
          <h2 className="text-3xl font-extrabold text-primary mb-2 text-center shrink-0">Create an Account</h2>
          <p className="text-body text-center">Create an account to become a member or volunteer.</p>
        </div>
        
        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm text-center">
              {successMsg}
            </div>
          )}
          {/* Full Name Field */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1a1c1c] mb-1" htmlFor="fullName">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#75777f] text-[20px]">person</span>
              </div>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="block w-full pl-[40px] pr-3 py-2 border border-[#c5c6cf] rounded-lg bg-white text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#061941] focus:border-transparent transition-colors text-[16px] placeholder-muted" id="fullName" name="fullName" placeholder="Enter your full name" required type="text" />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1a1c1c] mb-1" htmlFor="email">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#75777f] text-[20px]">mail</span>
              </div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-[40px] pr-3 py-2 border border-[#c5c6cf] rounded-lg bg-white text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#061941] focus:border-transparent transition-colors text-[16px] placeholder-muted" id="email" name="email" placeholder="Enter your email" required type="email" />
            </div>
          </div>
          
          {/* Phone Field */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1a1c1c] mb-1" htmlFor="phone">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#75777f] text-[20px]">call</span>
              </div>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="block w-full pl-[40px] pr-3 py-2 border border-[#c5c6cf] rounded-lg bg-white text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#061941] focus:border-transparent transition-colors text-[16px] placeholder-muted" id="phone" name="phone" placeholder="Enter 10-digit mobile number" required type="tel" pattern="[0-9]{10}" maxLength={10} title="Phone number must be exactly 10 digits" />
            </div>
          </div>
          
          {/* Password Field */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1a1c1c] mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#75777f] text-[20px]">lock</span>
              </div>
              <input value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-[40px] pr-[40px] py-2 border border-[#c5c6cf] rounded-lg bg-white text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#061941] focus:border-transparent transition-colors text-[16px] placeholder-muted" id="password" name="password" placeholder="••••••••" required type={showPassword ? "text" : "password"} />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#75777f] hover:text-[#1a1c1c] transition-colors" onClick={() => setShowPassword(!showPassword)} type="button">
                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-[14px] font-semibold text-[#1a1c1c] mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#75777f] text-[20px]">lock_reset</span>
              </div>
              <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full pl-[40px] pr-[40px] py-2 border border-[#c5c6cf] rounded-lg bg-white text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#061941] focus:border-transparent transition-colors text-[16px] placeholder-muted" id="confirmPassword" name="confirmPassword" placeholder="••••••••" required type={showConfirmPassword ? "text" : "password"} />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#75777f] hover:text-[#1a1c1c] transition-colors" onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button">
                <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <button disabled={registerMutation.isPending} className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-[14px] font-bold text-primary bg-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200 mt-4 disabled:opacity-50" type="submit">
            {registerMutation.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        {/* Bottom Link */}
        <div className="mt-8 text-center">
          <p className="text-body">
            Already have an account?{' '}
            <Link className="text-[14px] font-semibold text-[#061941] hover:text-secondary transition-colors hover:underline" to="/login">Sign In Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
