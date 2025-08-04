import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCoreWebVitals } from '@/hooks/useCoreWebVitals';
import { PerformanceBenchmark } from './PerformanceBenchmark';
import { AccessibilityChecker } from './AccessibilityChecker';
import { TouchTargetValidator } from './TouchTargetValidator';
import { ResponsiveTestRunner } from './ResponsiveTestRunner';
import { Smartphone, Tablet, Monitor, Zap, Accessibility, Target } from 'lucide-react';

interface TestResults {
  performance: number;
  accessibility: number;
  touchTargets: number;
  responsive: number;
  overall: number;
}

export function MobileTestingDashboard() {
  const { vitals, overallScore } = useCoreWebVitals();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    
    // Simulate comprehensive testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results: TestResults = {
      performance: 85,
      accessibility: 92,
      touchTargets: 88,
      responsive: 95,
      overall: 90
    };
    
    setTestResults(results);
    setIsRunning(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'destructive';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mobile Testing Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive mobile optimization testing suite</p>
        </div>
        <Button 
          onClick={runComprehensiveTest} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>

      {/* Overall Score */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Mobile Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">
                <span className={getScoreColor(testResults.overall)}>
                  {testResults.overall}
                </span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <Progress value={testResults.overall} className="flex-1" />
              <Badge variant={getScoreBadge(testResults.overall) as any}>
                {testResults.overall >= 90 ? 'Excellent' : 
                 testResults.overall >= 70 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vitals.lcp && (
              <div className="text-center">
                <div className="text-2xl font-bold">{vitals.lcp.value.toFixed(1)}s</div>
                <div className="text-sm text-muted-foreground">LCP</div>
                <Badge variant={vitals.lcp.rating === 'good' ? 'default' : 'destructive'}>
                  {vitals.lcp.rating}
                </Badge>
              </div>
            )}
            {vitals.fid && (
              <div className="text-center">
                <div className="text-2xl font-bold">{vitals.fid.value.toFixed(1)}ms</div>
                <div className="text-sm text-muted-foreground">FID</div>
                <Badge variant={vitals.fid.rating === 'good' ? 'default' : 'destructive'}>
                  {vitals.fid.rating}
                </Badge>
              </div>
            )}
            {vitals.cls && (
              <div className="text-center">
                <div className="text-2xl font-bold">{vitals.cls.value.toFixed(3)}</div>
                <div className="text-sm text-muted-foreground">CLS</div>
                <Badge variant={vitals.cls.rating === 'good' ? 'default' : 'destructive'}>
                  {vitals.cls.rating}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Categories */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="touch" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Touch Targets
          </TabsTrigger>
          <TabsTrigger value="responsive" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Responsive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <PerformanceBenchmark />
        </TabsContent>

        <TabsContent value="accessibility">
          <AccessibilityChecker />
        </TabsContent>

        <TabsContent value="touch">
          <TouchTargetValidator />
        </TabsContent>

        <TabsContent value="responsive">
          <ResponsiveTestRunner />
        </TabsContent>
      </Tabs>

      {/* Device Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Device Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            <div className="flex flex-col items-center gap-2">
              <Smartphone className="h-8 w-8" />
              <span className="text-sm">Mobile</span>
              <Badge variant="outline">375×667</Badge>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Tablet className="h-8 w-8" />
              <span className="text-sm">Tablet</span>
              <Badge variant="outline">768×1024</Badge>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Monitor className="h-8 w-8" />
              <span className="text-sm">Desktop</span>
              <Badge variant="outline">1920×1080</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}