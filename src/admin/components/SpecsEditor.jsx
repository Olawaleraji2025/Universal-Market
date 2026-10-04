import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function SpecsEditor({
  specs = [],
  onChange,
}) {
  const handleAddRow = () => {
    onChange([...specs, { key: '', value: '' }]);
  };

  const handleUpdateRow = (index, field, newValue) => {
    const updated = [...specs];
    updated[index] = {
      ...updated[index],
      [field]: newValue,
    };
    onChange(updated);
  };

  const handleRemoveRow = (index) => {
    onChange(specs.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-3">
      {specs.length === 0 ? (
        <p className="text-xs text-[#475569] italic">
          No custom specifications added yet (e.g. Storage, RAM, Colour, Warranty).
        </p>
      ) : (
        <div className="space-y-2.5">
          {specs.map((row, index) => (
            <div
              key={index}
              className="flex items-center gap-2 sm:gap-3"
            >
              {/* Key field */}
              <div className="flex-1">
                <label htmlFor={`spec-key-${index}`} className="sr-only">
                  Specification Name
                </label>
                <input
                  id={`spec-key-${index}`}
                  type="text"
                  value={row.key}
                  onChange={(e) => handleUpdateRow(index, 'key', e.target.value)}
                  placeholder="e.g. Storage, RAM, Colour"
                  className="w-full min-h-[44px] px-3.5 text-sm text-[#01241a] bg-white border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] transition"
                />
              </div>

              {/* Value field */}
              <div className="flex-1">
                <label htmlFor={`spec-val-${index}`} className="sr-only">
                  Specification Value
                </label>
                <input
                  id={`spec-val-${index}`}
                  type="text"
                  value={row.value}
                  onChange={(e) => handleUpdateRow(index, 'value', e.target.value)}
                  placeholder="e.g. 128GB, 8GB, Blue"
                  className="w-full min-h-[44px] px-3.5 text-sm text-[#01241a] bg-white border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#047857] transition"
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveRow(index)}
                aria-label={`Remove specification row ${index + 1}`}
                className="w-11 h-11 rounded-[10px] flex items-center justify-center text-[#475569] hover:text-[#b91c1c] hover:bg-rose-50 transition border border-[#e2e8f0] shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Row Button */}
      <button
        type="button"
        onClick={handleAddRow}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] border border-dashed border-[#047857]/60 text-xs font-semibold text-[#047857] hover:bg-[#ecfdf5] transition focus:outline-none focus:ring-2 focus:ring-[#047857]"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add specification row</span>
      </button>
    </div>
  );
}
