/**
 * Select component for dropdowns
 */

import { SelectHTMLAttributes, forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="input-label">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-2xl
              bg-white border border-slate-200
              text-slate-700 font-medium
              focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
              transition-all duration-300 appearance-none cursor-pointer
              hover:border-emerald-300 hover:bg-emerald-50/30
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}
              ${className}
            `}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '20px',
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-400">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="text-slate-700 py-2">
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-xs font-semibold text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
