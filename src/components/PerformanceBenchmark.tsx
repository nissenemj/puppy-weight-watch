import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { measurePerformance } from '@/utils/performance';
import { Zap, Clock, HardDrive, Wifi, AlertTriangle } from 'lucide-react';

interface BenchmarkResults {
  bundleSize: number;
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  score: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'poor';
}

export function PerformanceBenchmark() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BenchmarkResults | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const runBenchmark = async () => {
    setIsRunning(true);
    
    const startTime = performance.now();
    
    // Measure bundle size
    const bundleSize = await measureBundleSize();
    
    // Measure render performance
    const renderStartTime = performance.now();
    // Simulate heavy rendering
    for (let i = 0; i < 1000; i++) {
      document.createElement('div');
    }
    const renderTime = performance.now() - renderStartTime;
    
    // Measure memory usage
    const memoryUsage = measureMemoryUsage();
    
    // Count network requests
    const networkRequests = countNetworkRequests();
    
    const loadTime = performance.now() - startTime;
    
    const benchmarkResults: BenchmarkResults = {
      bundleSize,
      loadTime,
      renderTime,
      memoryUsage,
      networkRequests,
      score: calculateOverallScore({
        bundleSize,
        loadTime,
        renderTime,
        memoryUsage,
        networkRequests
      })
    };
    
    setResults(benchmarkResults);
    setRecommendations(generateRecommendations(benchmarkResults));
    setIsRunning(false);
  };

  const measureBundleSize = async (): Promise<number> => {
    try {
      const response = await fetch('/');
      const text = await response.text();
      return new Blob([text]).size / 1024; // KB
    } catch {
      return 0;
    }
  };

  const measureMemoryUsage = (): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  };

  const countNetworkRequests = (): number => {
    const entries = performance.getEntriesByType('resource');
    return entries.length;
  };

  const calculateOverallScore = (metrics: Omit<BenchmarkResults, 'score'>): number => {
    let score = 100;
    
    // Bundle size penalty (target: < 500KB)
    if (metrics.bundleSize > 500) score -= Math.min(30, (metrics.bundleSize - 500) / 10);
    
    // Load time penalty (target: < 2s)
    if (metrics.loadTime > 2000) score -= Math.min(25, (metrics.loadTime - 2000) / 100);
    
    // Render time penalty (target: < 100ms)
    if (metrics.renderTime > 100) score -= Math.min(20, (metrics.renderTime - 100) / 10);
    
    // Memory usage penalty (target: < 50MB)
    if (metrics.memoryUsage > 50) score -= Math.min(15, (metrics.memoryUsage - 50) / 5);
    
    // Network requests penalty (target: < 20 requests)
    if (metrics.networkRequests > 20) score -= Math.min(10, metrics.networkRequests - 20);
    
    return Math.max(0, Math.round(score));
  };

  const generateRecommendations = (results: BenchmarkResults): string[] => {
    const recs: string[] = [];
    
    if (results.bundleSize > 500) {
      recs.push('Consider code splitting and lazy loading to reduce bundle size');
    }
    
    if (results.loadTime > 2000) {
      recs.push('Optimize critical rendering path and preload important resources');
    }
    
    if (results.renderTime > 100) {
      recs.push('Use React.memo and useMemo to optimize component rendering');
    }
    
    if (results.memoryUsage > 50) {
      recs.push('Check for memory leaks and optimize component cleanup');
    }
    
    if (results.networkRequests > 20) {
      recs.push('Reduce HTTP requests by bundling resources and using image sprites');
    }
    
    return recs;
  };

  const getMetrics = (results: BenchmarkResults): PerformanceMetric[] => [
    {
      name: 'Bundle Size',
      value: results.bundleSize,
      unit: 'KB',
      threshold: 500,
      icon: <HardDrive className="h-4 w-4" />,
      status: results.bundleSize <= 500 ? 'good' : results.bundleSize <= 800 ? 'warning' : 'poor'
    },
    {
      name: 'Load Time',
      value: results.loadTime,
      unit: 'ms',
      threshold: 2000,
      icon: <Clock className="h-4 w-4" />,
      status: results.loadTime <= 2000 ? 'good' : results.loadTime <= 3000 ? 'warning' : 'poor'
    },
    {
      name: 'Render Time',
      value: results.renderTime,
      unit: 'ms',
      threshold: 100,
      icon: <Zap className="h-4 w-4" />,
      status: results.renderTime <= 100 ? 'good' : results.renderTime <= 200 ? 'warning' : 'poor'
    },
    {
      name: 'Memory Usage',
      value: results.memoryUsage,
      unit: 'MB',
      threshold: 50,
      icon: <HardDrive className="h-4 w-4" />,
      status: results.memoryUsage <= 50 ? 'good' : results.memoryUsage <= 100 ? 'warning' : 'poor'
    },
    {
      name: 'Network Requests',
      value: results.networkRequests,
      unit: 'requests',
      threshold: 20,
      icon: <Wifi className="h-4 w-4" />,
      status: results.networkRequests <= 20 ? 'good' : results.networkRequests <= 30 ? 'warning' : 'poor'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Benchmark</CardTitle>
            <Button onClick={runBenchmark} disabled={isRunning}>
              {isRunning ? 'Running...' : 'Run Benchmark'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {results && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-4xl font-bold">
                  <span className={getStatusColor(results.score >= 80 ? 'good' : results.score >= 60 ? 'warning' : 'poor')}>
                    {results.score}
                  </span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <Progress value={results.score} className="mt-2" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getMetrics(results).map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {metric.icon}
                        <span className="font-medium">{metric.name}</span>
                      </div>
                      <div className="text-2xl font-bold">
                        <span className={getStatusColor(metric.status)}>
                          {metric.value.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          {metric.unit}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Target: ≤ {metric.threshold} {metric.unit}
                      </div>
                      <Badge 
                        variant={metric.status === 'good' ? 'default' : 'destructive'}
                        className="mt-2"
                      >
                        {metric.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Performance Recommendations:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {recommendations.map((rec, index) => (
                        <li key={index} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}