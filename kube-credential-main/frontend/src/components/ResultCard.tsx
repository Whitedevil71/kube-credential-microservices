import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Copy } from 'lucide-react';

interface ResultCardProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  details?: Record<string, any>;
}

export const ResultCard: React.FC<ResultCardProps> = ({ type, message, details }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
    }
  };

  const copyId = () => {
    if (!details?.credentialId) return;
    navigator.clipboard?.writeText(details.credentialId);
  };

  return (
  <div className={`${getBgColor()} border rounded-md p-5 mt-6 dark:border-slate-700 transition-colors duration-300`}>
  <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h3 className={`${getTextColor()} font-medium text-sm sm:text-base mb-2`}>{message}</h3>
          {details && (
            <div className="mt-3 bg-white/60 rounded-md p-3 sm:p-4 dark:bg-white/10 transition-colors duration-300">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Details:</h4>
              <dl className="space-y-2">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <dt className="text-gray-600 font-medium capitalize text-xs sm:text-sm">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </dt>
                    <dd className="sm:col-span-2 text-gray-800 flex items-center gap-2 text-xs sm:text-sm break-words">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      {key === 'credentialId' && (
                        <button
                          type="button"
                          onClick={copyId}
                          className="inline-flex items-center text-xs text-slate-600 hover:text-slate-800"
                          title="Copy credential ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
