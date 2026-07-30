"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_LABELS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplay(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function parseISO(iso: string): Date | null {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

type DatePickerProps = {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  className?: string;
};

export function DatePicker({
  id,
  name,
  value,
  defaultValue,
  onChange,
  required,
  className = "",
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const selectedIso = isControlled ? (value ?? "") : internalValue;
  const selectedDate = selectedIso ? parseISO(selectedIso) : null;

  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate ?? new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function openCalendar() {
    setViewDate(selectedDate ?? new Date());
    setIsOpen((open) => !open);
  }

  function selectDate(date: Date) {
    const iso = toISODate(date);
    if (!isControlled) setInternalValue(iso);
    onChange?.(iso);
    setIsOpen(false);
  }

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {name && <input type="hidden" name={name} value={selectedIso} required={required} />}
      <button
        type="button"
        id={id}
        onClick={openCalendar}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-left text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
      >
        <CalendarIcon className="size-4 shrink-0 text-gray-400" />
        <span className={selectedIso ? "text-gray-900" : "text-gray-400"}>
          {selectedIso ? formatDisplay(selectedIso) : "dd/mm/yyyy"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              aria-label="Bulan sebelumnya"
              className="flex size-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-semibold text-gray-900">
              {MONTH_LABELS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              aria-label="Bulan berikutnya"
              className="flex size-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400">
            {DAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <span key={`empty-${i}`} />;
              const isSelected =
                !!selectedDate &&
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month &&
                selectedDate.getDate() === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(new Date(year, month, day))}
                  className={`flex size-8 items-center justify-center rounded-lg text-sm transition-colors ${
                    isSelected
                      ? "bg-[#003459] font-semibold text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
