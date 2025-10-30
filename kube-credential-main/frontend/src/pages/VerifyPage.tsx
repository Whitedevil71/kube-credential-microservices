import React, { useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Form } from '../components/Form';
import { ResultCard } from '../components/ResultCard';
import { verifyCredential, CredentialVerifyResponse } from '../api/verificationAPI';
import { useToast } from '../components/Toast';

export const VerifyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isWaking, setIsWaking] = useState(false);
  const wakeTimerRef = useRef<number | null>(null);
  const [result, setResult] = useState<CredentialVerifyResponse | null>(null);
  const { add } = useToast();

  const formFields = [
    {
      name: 'credentialId',
      label: 'Credential ID',
      type: 'text',
      required: true,
      placeholder: 'e.g., CRED-2024-001'
    }
  ];

  const handleSubmit = async (formData: Record<string, string>) => {
    setLoading(true);
    setResult(null);
    // Show a wake-up notice if the request takes longer than 5 seconds
    if (wakeTimerRef.current) window.clearTimeout(wakeTimerRef.current);
    wakeTimerRef.current = window.setTimeout(() => setIsWaking(true), 5000);

    try {
      const response = await verifyCredential(formData.credentialId);
      setResult(response);
      if (response.success && response.verified) add('Credential verified', 'success');
      else add(response.message || 'Verification failed', 'error');
    } catch (error: any) {
      setResult({
        success: false,
        verified: false,
        message: error.message || 'Failed to verify credential',
        timestamp: new Date().toISOString()
      });
      add('Failed to verify credential', 'error');
    } finally {
      setLoading(false);
      if (wakeTimerRef.current) {
        window.clearTimeout(wakeTimerRef.current);
        wakeTimerRef.current = null;
      }
      setIsWaking(false);
    }
  };

  const getResultType = () => {
    if (!result) return 'error';
    if (result.verified && result.data?.isExpired) return 'warning';
    if (result.verified) return 'success';
    return 'error';
  };

  return (
    <div className="max-w-xl sm:max-w-2xl mx-auto">
  <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-5 sm:p-8 dark:bg-slate-900 dark:ring-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Verify Credential</h1>
            <p className="text-slate-600 mt-1 text-xs sm:text-sm">Check credential validity and authenticity</p>
          </div>
        </div>

        <Form
          fields={formFields}
          onSubmit={handleSubmit}
          submitLabel="Verify Credential"
          loading={loading}
        />

        {loading && (
          <div className="mt-6 animate-pulse space-y-3">
            <div className="h-3 sm:h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-16 sm:h-20 bg-slate-200 rounded"></div>
          </div>
        )}
        {loading && isWaking && (
          <div className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Waking server on free hosting… first request after idle can take up to a minute.
          </div>
        )}
        {result && !loading && (
          <ResultCard
            type={getResultType()}
            message={result.message}
            details={result.data}
          />
        )}
      </div>
    </div>
  );
};
