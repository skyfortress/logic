import React from 'react';
import Link from 'next/link';
import { Dictionary } from './types';

// Header component
const Header = ({ dictionary, lang }: { dictionary: Dictionary, lang?: string }) => (
  <header className="text-center mb-12">
    <div className="flex justify-between mb-4">
      {lang && (
        <div>
          <Link href={`/${lang}/fallacies`}>
            <button className="px-3 py-1.5 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium rounded border border-emerald-200 transition-colors">
              {dictionary.fallaciesList?.title || 'Logical Fallacies'}
            </button>
          </Link>
        </div>
      )}
      <div className="flex gap-2">
        <Link href="/en" locale="en">
          <button className="px-2 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded border border-slate-200 transition-colors">
            English
          </button>
        </Link>
        <Link href="/ua" locale="ua">
          <button className="px-2 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded border border-slate-200 transition-colors">
            Українська
          </button>
        </Link>
      </div>
    </div>
    <h1 className="text-4xl font-bold text-emerald-700 mb-3">
      {dictionary.title}
    </h1>
    <p className="text-slate-600 max-w-2xl mx-auto">
      {dictionary.subtitle} {dictionary.instruction}
    </p>
    <div className="mt-4 text-sm text-slate-500">
      <p>
        {dictionary.shortcuts} <kbd className="px-2 py-1 bg-slate-100 rounded border border-slate-200">{dictionary.enter}</kbd> {dictionary.enterAction}, <kbd className="px-2 py-1 bg-slate-100 rounded border border-slate-200">{dictionary.space}</kbd> {dictionary.spaceAction}
      </p>
    </div>
  </header>
);

export default Header;