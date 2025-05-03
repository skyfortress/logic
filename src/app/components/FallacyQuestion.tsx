import React from 'react';
import { Fallacy } from '../api/types';

const FallacyQuestion = ({ fallacy }: { fallacy: Fallacy }) => (
  <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-400 mb-6">
    <p className="text-slate-700 italic text-lg">
      &ldquo;{fallacy.text}&rdquo;
    </p>
  </div>
);

export default FallacyQuestion;