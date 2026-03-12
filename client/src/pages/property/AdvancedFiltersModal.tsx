import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type AdvancedFilters, defaultAdvancedFilters } from '../../types/AdvancedFilters.types';

interface AdvancedFiltersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: AdvancedFilters) => void;
    onReset: () => void;
    initialFilters: AdvancedFilters;
}

export function AdvancedFiltersModal({
    isOpen,
    onClose,
    onApply,
    onReset,
    initialFilters,
}: AdvancedFiltersModalProps) {
    const [localFilters, setLocalFilters] = useState<AdvancedFilters>(initialFilters);

    // Sync local state when modal opens
    useEffect(() => {
        if (isOpen) setLocalFilters(initialFilters);
    }, [isOpen]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const activeCount = Object.values(localFilters).filter(v => v !== '').length;

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleReset = () => {
        setLocalFilters(defaultAdvancedFilters);
        onReset();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">Advanced Filters</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Property Details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <FilterRangeRow
                        label="Bedrooms"
                        minPlaceholder="Min" maxPlaceholder="Max"
                        minValue={localFilters.minBedrooms} maxValue={localFilters.maxBedrooms}
                        onMinChange={(v) => setLocalFilters(f => ({ ...f, minBedrooms: v }))}
                        onMaxChange={(v) => setLocalFilters(f => ({ ...f, maxBedrooms: v }))}
                        type="number" min={0} max={20}
                    />
                    <FilterRangeRow
                        label="Bathrooms"
                        minPlaceholder="Min" maxPlaceholder="Max"
                        minValue={localFilters.minBathrooms} maxValue={localFilters.maxBathrooms}
                        onMinChange={(v) => setLocalFilters(f => ({ ...f, minBathrooms: v }))}
                        onMaxChange={(v) => setLocalFilters(f => ({ ...f, maxBathrooms: v }))}
                        type="number" min={0} max={20}
                    />
                    <FilterRangeRow
                        label="Area (sq ft)"
                        minPlaceholder="Min sq ft" maxPlaceholder="Max sq ft"
                        minValue={localFilters.minArea} maxValue={localFilters.maxArea}
                        onMinChange={(v) => setLocalFilters(f => ({ ...f, minArea: v }))}
                        onMaxChange={(v) => setLocalFilters(f => ({ ...f, maxArea: v }))}
                        type="number" min={0}
                    />
                    <FilterRangeRow
                        label="Year Built"
                        minPlaceholder="From year" maxPlaceholder="To year"
                        minValue={localFilters.minYearBuilt} maxValue={localFilters.maxYearBuilt}
                        onMinChange={(v) => setLocalFilters(f => ({ ...f, minYearBuilt: v }))}
                        onMaxChange={(v) => setLocalFilters(f => ({ ...f, maxYearBuilt: v }))}
                        type="number" min={1900} max={new Date().getFullYear()}
                    />
                    <FilterRangeRow
                        label="Number of Floors"
                        minPlaceholder="Min" maxPlaceholder="Max"
                        minValue={localFilters.minFloors} maxValue={localFilters.maxFloors}
                        onMinChange={(v) => setLocalFilters(f => ({ ...f, minFloors: v }))}
                        onMaxChange={(v) => setLocalFilters(f => ({ ...f, maxFloors: v }))}
                        type="number" min={1} max={100}
                    />

                    {/* Coming soon placeholder */}
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 p-4 text-center">
                        <p className="text-sm font-bold text-slate-400">Features & Amenities</p>
                        <p className="text-xs text-slate-300 mt-0.5">Coming soon — backend support in progress</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 p-6 border-t border-slate-100">
                    <button
                        onClick={handleReset}
                        className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                        Reset All
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 py-3 rounded-2xl bg-[#e51013] text-white font-bold text-sm hover:bg-[#c40e11] transition-colors shadow-lg shadow-red-500/20"
                    >
                        Apply Filters
                        {activeCount > 0 && (
                            <span className="ml-2 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {activeCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Reusable Range Row ──
interface FilterRangeRowProps {
    label: string;
    minPlaceholder: string;
    maxPlaceholder: string;
    minValue: string;
    maxValue: string;
    onMinChange: (v: string) => void;
    onMaxChange: (v: string) => void;
    type?: string;
    min?: number;
    max?: number;
}

function FilterRangeRow({
    label, minPlaceholder, maxPlaceholder,
    minValue, maxValue, onMinChange, onMaxChange,
    type = "text", min, max
}: FilterRangeRowProps) {
    return (
        <div>
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-widest block mb-2">
                {label}
            </label>
            <div className="grid grid-cols-2 gap-3">
                <input
                    type={type} placeholder={minPlaceholder} value={minValue}
                    min={min} max={max}
                    onChange={(e) => onMinChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#e51013] focus:outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-300 transition-colors"
                />
                <input
                    type={type} placeholder={maxPlaceholder} value={maxValue}
                    min={min} max={max}
                    onChange={(e) => onMaxChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#e51013] focus:outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-300 transition-colors"
                />
            </div>
        </div>
    );
}