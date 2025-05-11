'use client';

import { Dictionary } from './types';

interface MasteryDialogProps {
  onClose: () => void;
  fallacyType: string;
  dictionary: Dictionary;
}

export default function MasteryDialog({ onClose, fallacyType, dictionary }: MasteryDialogProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 `}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-6 m-4 max-w-sm w-full shadow-md transform transition-transform"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-2">{dictionary.masteryAchieved}</h2>
          <p className="text-lg mb-4 text-slate-700">
            {dictionary.masteryMessage.replace('{fallacyName}', fallacyType)}
          </p>
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            onClick={onClose}
          >
            {dictionary.continue}
          </button>
        </div>
      </div>
    </div>
  );
}