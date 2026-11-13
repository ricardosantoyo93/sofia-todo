'use client';

import { cn } from 'cn';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DatePickerProps {
  id?: string;
  name?: string;
  label: string;
  placeholder?: string;
  className?: string;
  error?: string;
  onChange?: (date: Date | undefined) => void;
}

export function DatePicker({
  id,
  name,
  label,
  placeholder = 'Pick a date',
  className,
  error,
  onChange,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  const handleSelect = (next: Date | undefined) => {
    setDate(next);
    onChange?.(next);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
        {label}
      </label>
      <div className="mt-2.5">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                id={id}
                type="button"
                variant="outline"
                data-empty={!date}
                aria-invalid={!!error}
                className={cn(
                  'w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground',
                  className,
                )}
              >
                {date ? format(date, 'PPP') : <span>{placeholder}</span>}
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={handleSelect} defaultMonth={date} />
          </PopoverContent>
        </Popover>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        {name && <input type="hidden" name={name} value={date ? format(date, 'yyyy-MM-dd') : ''} />}
      </div>
    </div>
  );
}
