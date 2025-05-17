import { useAppSelector } from '@/state/hooks';

interface OverallProgressProps {
  masteryDashboard: {
    overallProgress: string;
    totalFallacies: string;
    masteredFallacies: string;
    inProgress: string;
    notStarted: string;
    seenTasks: string;
    correctAnswers: string;
    incorrectAnswers: string;
    correctPercentage: string;
  };
}

export function OverallProgress({ masteryDashboard }: OverallProgressProps) {
  const { seenFallacyIds, fallacyMasteries } = useAppSelector((state) => state.fallacyTrainer);
  
  const seenCount = seenFallacyIds.length;
  const masteredCount = Object.keys(fallacyMasteries).length;
  
  const correctAnswers = Object.values(fallacyMasteries).filter(level => level > 0).length;
  const incorrectAnswers = seenCount - correctAnswers;
  const correctPercentage = seenCount > 0 ? Math.round((correctAnswers / seenCount) * 100) : 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-semibold text-lg text-sky-800 mb-4">
        {masteryDashboard.overallProgress}
      </h2>
      <div className="space-y-3">
        <StatItem 
          label={masteryDashboard.masteredFallacies}
          value={masteredCount}
        />
        
        <StatItem 
          label={masteryDashboard.seenTasks}
          value={seenCount}
        />
        
        <StatItem 
          label={masteryDashboard.correctAnswers}
          value={correctAnswers}
        />
        
        <StatItem 
          label={masteryDashboard.incorrectAnswers}
          value={incorrectAnswers}
        />
        
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{masteryDashboard.correctPercentage}</span>
              <span className="font-mono font-semibold text-sky-700">{correctPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-sky-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${Math.min(100, Math.max(0, correctPercentage))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: number | string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-700">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}