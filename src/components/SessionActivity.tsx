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
      <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base bg-gray-50 rounded-lg shadow-inner">
        {dictionary.masteryDashboard?.noActivity}
      </div>
    );
  }

  const locale = lang === 'ua' ? uk : enUS;

  const formatDate = (dateString: string) => {
    const sessionDate = new Date(dateString);
    return formatDistanceToNow(sessionDate, { addSuffix: true, locale });
  };

  const formatSessionDuration = (seconds: number) => {
    return fnsFormatDuration({ seconds }, { locale });
  };

  return (
      <div className="space-y-1 sm:space-y-2">
        {sessionActivity.slice(0, 5).map((session, index) => (
          <div key={index} className="flex justify-between items-center p-1.5 sm:p-2 hover:bg-gray-50 rounded-md transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 bg-sky-50 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-medium text-gray-700">{formatDate(session.date)}</span>
                <span className="text-[10px] sm:text-xs text-gray-500">{formatSessionDuration(session.duration)}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sky-700 font-medium bg-sky-50 py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-full text-[10px] sm:text-xs flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {session.points}
              </span>
            </div>
          </div>
        ))}
        </div>
  );
}