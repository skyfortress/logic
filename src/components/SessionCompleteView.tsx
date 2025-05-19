import { FC, useEffect, useState } from 'react';
import ConfettiExplosion from "react-confetti-blast";
import type { Dictionary } from './types';
import Button from './Button';
import ShareButtons from './ShareButtons';
import { QUESTIONS_IN_SESSION } from '@/state/slices/fallacyTrainerSlice';

interface SessionCompleteViewProps {
  score: number;
  dictionary: Dictionary;
  onStartNewSession: () => void;
  correctPercentage?: number;
}

const SessionCompleteView: FC<SessionCompleteViewProps> = ({
  score,
  dictionary,
  onStartNewSession,
  correctPercentage = 0
}) => {
  const [displayScore, setDisplayScore] = useState(0);
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

  useEffect(() => {
    if (score > 0) {
      const animationDuration = 1500;
      const framesPerSecond = 60;
      const incrementsCount = animationDuration / 1000 * framesPerSecond;
      const scoreIncrement = score / incrementsCount;
      let currentCount = 0;
      
      const timer = setInterval(() => {
        currentCount += scoreIncrement;
        if (currentCount >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(currentCount));
        }
      }, 1000 / framesPerSecond);
      
      return () => {
        clearInterval(timer);
      };
    }
  }, [score]);

  const confettiProps = {
    force: 0.6,
    duration: 5000,
    particleCount: 200,
    width: windowSize.width,
    height: windowSize.height,
    zIndex: 1000
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl shadow-md border border-slate-100 p-4 sm:p-6 md:p-8 relative">
      <div style={{  
        position: "absolute",
        right: "50%",
        left: "50%",
        top: "35%"
      }}>
        <ConfettiExplosion {...confettiProps} />
      </div>
      
      <div className="text-center">
        <div className="bg-blue-50 p-3 sm:p-5 rounded-lg sm:rounded-xl border-l-4 border-blue-400 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-sky-800 mb-1 sm:mb-2">{dictionary.sessionComplete}</h2>
        </div>
        
        <div className="mb-6 sm:mb-8 flex flex-col items-center">
          <div className="mb-1 sm:mb-2 text-xs sm:text-sm text-slate-600">{dictionary.finalScore}</div>
          <div className="text-5xl sm:text-7xl font-bold text-sky-700 mb-4 sm:mb-6 transition-all duration-100">
            {displayScore}
          </div>
          
          <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-100 flex flex-col items-center w-full max-w-xs">
            <span className="text-xs sm:text-sm text-slate-600 mb-1">{dictionary.masteryDashboard.correctPercentage}</span>
            <span className="text-2xl sm:text-3xl font-bold text-sky-700">{correctPercentage}%</span>
          </div>
        </div>
        
        <div className="mb-6 sm:mb-8 px-1">
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-2">
            <div 
              className="bg-blue-500 h-2 sm:h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${correctPercentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 sm:gap-6 items-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onStartNewSession}
            className="mx-auto w-full sm:w-auto"
          >
            {dictionary.startNewSession}
          </Button>
          
          <div className="mt-2 pt-4 border-t border-slate-100 w-full">
            <ShareButtons 
              score={score} 
              message={dictionary.shareMessage}
              url={typeof window !== 'undefined' ? window.location.href : ''}
              total={QUESTIONS_IN_SESSION * 100}
              percentage={correctPercentage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCompleteView;