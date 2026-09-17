import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({ title, onBack }) {
  return (
    <header className="h-16 flex items-center justify-center border-b border-gray-100 bg-white">
      <div className="max-w-[900px] w-full px-4 flex items-center">
        <div className="flex-1">
          {onBack ? (
            <button onClick={onBack} className="text-gray-700"> <ArrowLeft className="h-5 w-5" /></button>
          ) : null}
        </div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <div className="flex-1" />
      </div>
    </header>
  );
}
