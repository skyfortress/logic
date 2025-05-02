import React from 'react';

// FallacyQuestion component - displays current fallacy
const FallacyQuestion = ({ fallacy }: { fallacy: any }) => (
  <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-400 mb-6">
    <p className="text-slate-700 italic text-lg">
      "{fallacy.text}"
    </p>
  </div>
);

export default FallacyQuestion;