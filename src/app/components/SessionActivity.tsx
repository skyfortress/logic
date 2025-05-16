'use client';

import { useAppSelector } from '../state/hooks';
import { Dictionary } from './types';
import { formatDistanceToNow, formatDuration as fnsFormatDuration } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';

export interface SessionActivityProps {
  dictionary: Dictionary;
  lang?: string;
}

export function SessionActivity({ dictionary, lang = 'en' }: SessionActivityProps) {
  const { sessionActivity } = useAppSelector(state => state.fallacyTrainer);

  const { sessionActivity: texts } = dictionary.masteryDashboard;
  
  if (!sessionActivity || sessionActivity.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {dictionary.masteryDashboard?.noActivity}
      </div>
    );
  }

  const lastSession = sessionActivity[0];
  const locale = lang === 'ua' ? uk : enUS;

  const formatDate = (dateString: string) => {
    const sessionDate = new Date(dateString);
    
    return formatDistanceToNow(sessionDate, { addSuffix: true, locale });
  };

  const formatSessionDuration = (seconds: number) => {
    return fnsFormatDuration({ seconds }, { locale });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{texts?.lastSession}</span>
          <span className="font-medium text-sky-700">{formatDate(lastSession.date)}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">{texts?.duration}</span>
          <span className="font-medium">{formatSessionDuration(lastSession.duration)}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">{texts?.points}</span>
          <span className="font-medium text-indigo-600">{lastSession.points}</span>
        </div>
      </div>
      
      {sessionActivity.length > 1 && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-gray-500 mb-2">{texts?.history}</div>
          {sessionActivity.slice(1, 4).map((session, index) => (
            <div key={index} className="flex justify-between items-center text-xs py-1">
              <span>{formatDate(session.date)}</span>
              <span className="text-indigo-600 font-medium">+{session.points}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}