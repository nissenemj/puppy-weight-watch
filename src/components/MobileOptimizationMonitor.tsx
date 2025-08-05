import React, { useEffect, useState } from 'react';
import { MobileOptimizationChecker, MobileOptimizationReport } from '@/utils/mobileOptimizationCheck';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface MobileOptimizationMonitorProps {
  showInProduction?: boolean;
  showScoreOnly?: boolean;
}

export const MobileOptimizationMonitor: React.FC<MobileOptimizationMonitorProps> = ({
  showInProduction = false,
  showScoreOnly = false
}) => {
  const [report, setReport] = useState<MobileOptimizationReport | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development unless explicitly enabled for production
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && !showInProduction) return;

    const checkOptimization = () => {
      const newReport = MobileOptimizationChecker.generateReport();
      setReport(newReport);
      setIsVisible(!newReport.isOptimized || newReport.score < 90);
    };

    // Initial check
    setTimeout(checkOptimization, 1000);

    // Continuous monitoring
    const cleanup = MobileOptimizationChecker.runContinuousCheck(10000);

    return cleanup;
  }, [showInProduction]);

  if (!report || (!isVisible && showScoreOnly)) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4" />;
    if (score >= 70) return <Info className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  if (showScoreOnly) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Badge className={`${getScoreColor(report.score)} text-white flex items-center gap-2`}>
          {getScoreIcon(report.score)}
          Mobile: {report.score}%
        </Badge>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Alert className="bg-white border-l-4 border-l-orange-500 shadow-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Mobile Optimization</span>
              <Badge className={`${getScoreColor(report.score)} text-white`}>
                {report.score}%
              </Badge>
            </div>
            
            {report.issues.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Issues Found:</p>
                <ul className="text-xs space-y-1">
                  {report.issues.slice(0, 3).map((issue, index) => (
                    <li key={index} className="text-gray-600">• {issue}</li>
                  ))}
                  {report.issues.length > 3 && (
                    <li className="text-gray-500">• And {report.issues.length - 3} more...</li>
                  )}
                </ul>
              </div>
            )}
            
            {report.recommendations.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Recommendations:</p>
                <ul className="text-xs space-y-1">
                  {report.recommendations.slice(0, 2).map((rec, index) => (
                    <li key={index} className="text-blue-600">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Dismiss
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MobileOptimizationMonitor;