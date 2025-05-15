import React from 'react';
import Link from 'next/link';
import { Dictionary } from './types';
import Button from './Button';

const Header = ({ dictionary, lang }: { dictionary: Dictionary, lang?: string }) => (
  <header className="text-center mb-8 md:mb-12 px-3 md:px-0">
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
      {lang && (
        <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 w-full md:w-auto">
          <Link href={`/${lang}/fallacies`}>
            <Button variant="outline" size="md">
              {dictionary.fallaciesList?.title}
            </Button>
          </Link>
          <Link href={`/${lang}/mastery`}>
            <Button variant="outline" size="md">
              {dictionary.masteryDashboard?.title}
            </Button>
          </Link>
        </div>
      )}
      <div className="flex gap-2 mt-2 md:mt-0">
        <Link href="/en" locale="en">
          <Button 
            variant={lang === 'en' ? 'primary' : 'secondary'} 
            size="sm" 
            className="w-24 text-center"
          >
            English
          </Button>
        </Link>
        <Link href="/ua" locale="ua">
          <Button 
            variant={lang === 'ua' ? 'primary' : 'secondary'} 
            size="sm"
            className="w-24 text-center"
          >
            Українська
          </Button>
        </Link>
      </div>
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-2 md:mb-3">
      {dictionary.title}
    </h1>
    <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
      {dictionary.subtitle} {dictionary.instruction}
    </p>
    <div className="mt-3 md:mt-4 text-xs md:text-sm text-slate-500">
      <p className="flex flex-wrap justify-center gap-1 md:gap-2">
        <span>{dictionary.shortcuts}</span>
        <kbd className="px-1 md:px-2 py-0.5 md:py-1 bg-slate-100 rounded border border-slate-200">{dictionary.enter}</kbd>
        <span>{dictionary.enterAction},</span>
        <kbd className="px-1 md:px-2 py-0.5 md:py-1 bg-slate-100 rounded border border-slate-200">{dictionary.space}</kbd>
        <span>{dictionary.spaceAction}</span>
      </p>
    </div>
  </header>
);

export default Header;