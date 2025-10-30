import React from 'react';

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitLabel: string;
  loading: boolean;
}

export const Form: React.FC<FormProps> = ({ fields, onSubmit, submitLabel, loading }) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm sm:text-[0.95rem] font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300"
          >
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 text-sm sm:text-base"
              rows={3}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 text-sm sm:text-base"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
  className="w-full bg-brand-primary text-white py-2.5 px-5 rounded-md font-medium text-sm sm:text-base hover:brightness-110 disabled:bg-slate-400 disabled:cursor-not-allowed transition shadow-sm"
      >
        {loading ? 'Processing…' : submitLabel}
      </button>
    </form>
  );
};
