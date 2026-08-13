'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import Select from 'react-select';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function Select2Input({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  className = '',
  disabled = false,
  required = false
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (opt.description && opt.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Hidden native input for HTML5 required validation */}
      {required && (
        <input 
          type="text" 
          value={value} 
          onChange={() => {}} 
          required={required} 
          className="absolute opacity-0 w-full h-full pointer-events-none -z-10" 
        />
      )}

      {/* Main Select Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
          isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-700'
        } rounded-xl text-sm font-semibold focus:outline-hidden transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500 cursor-pointer'
        }`}
      >
        <span className={selectedOption ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Search Bar */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs font-bold text-slate-400">
                No results found.
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 transition-colors ${
                    value === opt.value
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{opt.label}</span>
                    {opt.description && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {opt.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {opt.badge && (
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] rounded-md font-bold uppercase tracking-wider">
                        {opt.badge}
                      </span>
                    )}
                    {value === opt.value && <Check className="w-4 h-4 text-emerald-500" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const SearchableSelect = ({ value, onChange, children, className, placeholder, disabled, name }: any) => {
  const instanceId = useId();
  const options = React.Children.toArray(children).map((child: any) => {
    if (React.isValidElement(child) && child.type === 'option') {
      return {
        value: child.props.value !== undefined ? child.props.value : child.props.children,
        label: child.props.children,
      };
    }
    return null;
  }).filter(Boolean);

  const selectedOption = options.find((o) => String(o?.value) === String(value)) || null;

  return (
    <Select
      instanceId={name || instanceId}
      value={selectedOption}
      onChange={(selected: any) => onChange({ target: { value: selected ? selected.value : '', name } })}
      options={options as any}
      isDisabled={disabled}
      placeholder={placeholder || "Search..."}
      className={className}
      classNames={{
        control: (state) => `w-full rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs font-bold ${state.isFocused ? 'ring-2 ring-emerald-500 border-transparent' : 'border-slate-200 dark:border-slate-700'}`,
        menu: () => 'bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-lg text-xs z-50',
        menuList: () => 'z-50',
        option: (state) => `p-2.5 cursor-pointer ${
          state.isSelected 
            ? 'bg-emerald-500 text-white' 
            : state.isFocused 
              ? 'bg-emerald-50 dark:bg-slate-700 dark:text-white' 
              : 'text-gray-900 dark:text-gray-100'
        }`,
        singleValue: () => 'text-gray-900 dark:text-gray-100',
        input: () => 'text-gray-900 dark:text-gray-100',
        placeholder: () => 'text-gray-400 dark:text-gray-500',
      }}
      styles={{
        control: (base) => ({ 
          ...base, 
          border: 'none', 
          boxShadow: 'none', 
          backgroundColor: 'transparent',
          minHeight: '42px',
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
      }}
      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
    />
  );
};

