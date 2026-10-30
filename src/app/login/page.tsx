import React, { Suspense } from 'react';
import { LoginForm } from './login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | SCOPEsure Solar Quotation Auditor',
  description: 'Sign in to access your solar quotation audit projects, risk matrices, and vendor comparisons.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#E5E8E1] p-4 sm:p-8 flex items-center justify-center font-sans antialiased text-[#17211D]">
      <Suspense
        fallback={
          <div className="w-full max-w-[440px] bg-white rounded-[32px] p-8 shadow-xl border border-[#D9DFD7] flex items-center justify-center min-h-[460px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-3 border-[#397553]/20 border-t-[#397553] rounded-full animate-spin" />
              <p className="text-xs text-[#68756C] font-medium">Loading SCOPEsure Auth...</p>
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

