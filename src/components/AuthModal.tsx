'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    switchRole,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot' | 'profile'>(authModalTab || 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'donor' | 'recipient' | 'ngo'>('recipient');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync initial tab when modal opens
  React.useEffect(() => {
    if (authModalTab) setActiveTab(authModalTab);
    if (isAuthenticated) setActiveTab('profile');
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [authModalTab, isAuthModalOpen, isAuthenticated]);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await login(email, password);
    setIsSubmitting(false);
    if (!result.success) {
      setErrorMessage(result.error || 'Failed to sign in.');
    } else {
      setSuccessMessage('Successfully signed in!');
      setTimeout(() => closeAuthModal(), 1200);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await register({
      email,
      password,
      full_name: fullName,
      role,
      organization_name: orgName,
      phone,
      address,
    });
    setIsSubmitting(false);
    if (!result.success) {
      setErrorMessage(result.error || 'Registration failed.');
    } else {
      setSuccessMessage(`Account created as ${role.toUpperCase()}! Welcome to FOODLOOP.`);
      setTimeout(() => closeAuthModal(), 1500);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await forgotPassword(email);
    setIsSubmitting(false);
    if (!result.success) {
      setErrorMessage(result.error || 'Failed to request reset.');
    } else {
      setSuccessMessage(result.message || 'Password reset link sent to your inbox.');
    }
  };

  const handleQuickLogin = (demoRole: 'donor' | 'recipient' | 'ngo' | 'admin') => {
    if (demoRole === 'donor') {
      setEmail('donor@artisanbakery.com');
      setPassword('donor123');
    } else if (demoRole === 'recipient') {
      setEmail('buyer@gmail.com');
      setPassword('buyer123');
    } else if (demoRole === 'ngo') {
      setEmail('logistics@bostonfoodalliance.org');
      setPassword('ngo123');
    } else if (demoRole === 'admin') {
      setEmail('admin@foodloop.org');
      setPassword('admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-[#001d59] p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                alt="FOODLOOP"
                className="h-8 w-auto object-contain brightness-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEwSyS4A9z1_QrWAY3a_IiQ6V-zC1Nb6gUSPdCpfqDpeqcg0w64FyxyqTtZlTbmAv_VP40e7wH0evHrjr2G636nBHFFBEdECDYZWwPE90HtMHY1raCpjJRH8lr7YOH4K5nVI0K1goP9qyQuSWvmW6-PLruKxabyMeNkb3OjImlZQ22t01e5tWmrgx2srJW-2Zm7SN9H805jG7I3XC2zONOodklC6jC1J2325C3dU"
              />
              <div>
                <h2 className="text-lg font-bold tracking-tight">FOODLOOP Identity &amp; Auth</h2>
                <p className="text-xs text-white/70">Role-based zero-waste food rescue platform</p>
              </div>
            </div>
            <button
              onClick={closeAuthModal}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-6 bg-white/10 p-1 rounded-xl">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => { setActiveTab('signin'); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'signin' ? 'bg-white text-[#001d59] shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab('signup'); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'signup' ? 'bg-white text-[#001d59] shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
                <button
                  onClick={() => { setActiveTab('forgot'); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'forgot' ? 'bg-white text-[#001d59] shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Reset
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('profile')}
                className="flex-1 py-2 text-xs font-bold rounded-lg bg-white text-[#001d59] shadow-sm cursor-pointer"
              >
                My Account Profile
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert Banners */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {activeTab === 'signin' && (
          <div className="p-6 flex flex-col gap-4">
            <form onSubmit={handleSignIn} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#001d59]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full h-11 px-3.5 bg-[#f2f4f7] rounded-xl text-sm text-[#191c1e] focus:bg-white focus:ring-2 focus:ring-[#005ab6] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#001d59]">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[11px] font-bold text-[#005ab6] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-3.5 bg-[#f2f4f7] rounded-xl text-sm text-[#191c1e] focus:bg-white focus:ring-2 focus:ring-[#005ab6] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-11 rounded-xl bg-[#001d59] hover:bg-[#003087] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Sign In with PayPal / Email'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            {/* Quick Demo Logins for Hackathon Evaluators */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#747683] uppercase tracking-wider">
                Quick Role Autofill (1-Click Test):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('donor')}
                  className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left text-xs font-semibold text-amber-900 cursor-pointer"
                >
                  <div className="font-bold">1. Food Seller / Donor</div>
                  <div className="text-[10px] text-amber-700">Artisan Bakery</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('recipient')}
                  className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left text-xs font-semibold text-emerald-900 cursor-pointer"
                >
                  <div className="font-bold">2. Food Buyer</div>
                  <div className="text-[10px] text-emerald-700">Sarah Jenkins</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('ngo')}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left text-xs font-semibold text-blue-900 cursor-pointer"
                >
                  <div className="font-bold">3. NGO Hub</div>
                  <div className="text-[10px] text-blue-700">Boston Food Alliance</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left text-xs font-semibold text-purple-900 cursor-pointer"
                >
                  <div className="font-bold">4. Admin &amp; AI</div>
                  <div className="text-[10px] text-purple-700">Platform Overseer</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE ACCOUNT */}
        {activeTab === 'signup' && (
          <form onSubmit={handleRegister} className="p-6 flex flex-col gap-3.5 max-h-[75vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#001d59]">Select Your Role</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('donor')}
                  className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    role === 'donor'
                      ? 'border-[#001d59] bg-[#001d59] text-white shadow-xs'
                      : 'border-slate-200 text-[#444652] hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined block text-[20px] mb-0.5">storefront</span>
                  Food Seller / Donor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recipient')}
                  className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    role === 'recipient'
                      ? 'border-[#001d59] bg-[#001d59] text-white shadow-xs'
                      : 'border-slate-200 text-[#444652] hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined block text-[20px] mb-0.5">shopping_cart</span>
                  Food Buyer / Consumer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ngo')}
                  className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    role === 'ngo'
                      ? 'border-[#001d59] bg-[#001d59] text-white shadow-xs'
                      : 'border-slate-200 text-[#444652] hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined block text-[20px] mb-0.5">local_shipping</span>
                  NGO Shelter Hub
                </button>
              </div>
              <p className="text-[10px] text-[#747683] mt-0.5">
                * Note: Admin accounts are provisioned via secure enterprise protocol and cannot be registered publicly.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#001d59]">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Elena Rostova"
                  required
                  className="w-full h-10 px-3 bg-[#f2f4f7] rounded-xl text-xs text-[#191c1e] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#001d59]">Organization (Optional)</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g., Artisan Bakery Co."
                  className="w-full h-10 px-3 bg-[#f2f4f7] rounded-xl text-xs text-[#191c1e] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#001d59]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full h-10 px-3 bg-[#f2f4f7] rounded-xl text-xs text-[#191c1e] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#001d59]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full h-10 px-3 bg-[#f2f4f7] rounded-xl text-xs text-[#191c1e] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#001d59]">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (617) 555-0100"
                  className="w-full h-10 px-3 bg-[#f2f4f7] rounded-xl text-xs text-[#191c1e] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#001d59]">Address / Pickup Dock</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., 742 Boylston St, Boston, MA"
                className="w-full h-10 px-3 bg-[#f2f4f7] rounded-xl text-xs text-[#191c1e] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-11 rounded-xl bg-[#001d59] hover:bg-[#003087] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Registering...' : 'Create Account'}</span>
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </button>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgot} className="p-6 flex flex-col gap-4">
            <p className="text-xs text-[#444652]">
              Enter your registered email address below. We will dispatch secure password reset instructions to your verified mailbox.
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#001d59]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full h-11 px-3.5 bg-[#f2f4f7] rounded-xl text-sm text-[#191c1e] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-[#005ab6] hover:bg-[#004494] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Sending...' : 'Send Password Reset Link'}</span>
              <span className="material-symbols-outlined text-[18px]">mail</span>
            </button>
          </form>
        )}

        {/* TAB 4: MY PROFILE */}
        {activeTab === 'profile' && user && (
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.full_name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#005ab6]"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-extrabold text-[#001d59] truncate">{user.full_name}</span>
                <span className="text-xs text-[#747683] truncate">{user.email}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#001d59] text-white">
                    {user.role}
                  </span>
                  {user.is_verified && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Verified ✓
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#747683]">Organization:</span>
                <span className="font-semibold text-[#001d59]">{user.organization_name || 'Individual'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#747683]">Address:</span>
                <span className="font-semibold text-[#001d59]">{user.address || 'Boston, MA'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#747683]">Phone:</span>
                <span className="font-semibold text-[#001d59]">{user.phone || '+1 (617) 555-0100'}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={logout}
                className="flex-1 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Sign Out</span>
              </button>
              <button
                type="button"
                onClick={closeAuthModal}
                className="flex-1 py-2.5 rounded-xl bg-[#f2f4f7] hover:bg-slate-200 text-[#001d59] font-bold text-xs cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
