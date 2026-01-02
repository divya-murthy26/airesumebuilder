import React from 'react';
import { Check } from 'lucide-react';

const colorOptions = [
    '#3b82f6', '#ef4444', '#f97316', '#eab308', '#22c55e', 
    '#14b8a6', '#06b6d4', '#6366f1', '#a855f7', '#ec4899'
];

const ColorPicker = ({ color, onChange }) => {
    return (
        <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
            <h3 className='text-sm font-medium text-slate-700 mb-3'>Accent Color</h3>
            <div className='flex flex-wrap gap-3'>
                {colorOptions.map((c) => (
                    <button
                        key={c}
                        onClick={() => onChange(c)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200
                            ${color === c ? 'ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                    >
                        {color === c && <Check className='size-4 text-white' />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorPicker;
