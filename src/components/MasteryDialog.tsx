import { useState, useEffect } from 'react';
import ConfettiExplosion from "react-confetti-blast";
import { Dictionary } from './types';
import Button from './Button';

interface MasteryDialogProps {
  onClose: () => void;
  fallacyType: string;
  dictionary: Dictionary;
}

export default function MasteryDialog({ onClose, fallacyType, dictionary }: MasteryDialogProps) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const bigExplodeProps = {
    force: 0.6,
    duration: 5000,
    particleCount: 200,
    width: windowSize.width,
    height: windowSize.height,
    zIndex: 1000
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div style={{  
        position: "absolute",
        right: "50%",
        left: "50%",
        top: "35%"
      }}><ConfettiExplosion {...bigExplodeProps} /></div>
      <div 
        className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 m-3 sm:m-4 max-w-sm w-full shadow-md transform transition-transform"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🏆</div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            {dictionary.masteryAchieved}
          </h2>
          <p className="text-base sm:text-lg mb-4 text-slate-700">
            {dictionary.masteryMessage.replace('{fallacyName}', fallacyType)}
          </p>
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full sm:w-auto mx-auto"
          >
            {dictionary.continue}
          </Button>
        </div>
      </div>
    </div>
  );
}