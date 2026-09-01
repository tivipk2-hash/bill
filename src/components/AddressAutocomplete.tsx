import React, { useState, useEffect, useRef } from 'react';
import { AddressSuggestion, getAddressSuggestions } from '../utils/addressService';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectAddress: (selected: { address: string; city: string; state: string; zip: string }) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelectAddress,
  placeholder = 'Street Address',
  className = '',
  id,
  disabled = false,
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Fetch suggestions on user typing
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await getAddressSuggestions(value);
        setSuggestions(results);
        if (results.length > 0) {
          setIsOpen(true);
          setSelectedIndex(0);
        } else {
          setIsOpen(false);
        }
      } catch (err) {
        console.error('Error fetching address suggestions:', err);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value]);

  // Handle outside clicks to close popup
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (item: AddressSuggestion) => {
    onSelectAddress({
      address: item.street,
      city: item.city,
      state: item.state,
      zip: item.zip,
    });
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={className}
        />
        {isLoading && (
          <div className="absolute right-2 no-print no-export text-blue-600">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </div>
        )}
      </div>

      {/* Auto-suggest dropdown matching the user's reference UI */}
      {isOpen && suggestions.length > 0 && (
        <div className="no-print no-export absolute left-0 top-full mt-0.5 z-50 min-w-[280px] w-full max-w-[420px] bg-white border-2 border-[#7a9bb8] shadow-2xl overflow-hidden font-sans text-xs">
          <ul className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
            {suggestions.map((item, index) => {
              const isSelected = selectedIndex === index;
              return (
                <li
                  key={`${item.fullAddress}-${index}`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleSelect(item)}
                  className={`px-3 py-2 cursor-pointer transition-colors duration-75 text-left select-none ${
                    isSelected
                      ? 'bg-[#0078d4] text-white font-medium'
                      : 'bg-white text-slate-900 hover:bg-[#0078d4] hover:text-white'
                  }`}
                >
                  <div className="leading-snug">
                    <div className="text-[13px]">{item.fullAddress}</div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="px-2.5 py-1 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-blue-500" />
              Address suggestions • Select to auto-fill City, State, ZIP
            </span>
            <span>↑↓ to navigate</span>
          </div>
        </div>
      )}
    </div>
  );
};
