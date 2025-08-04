import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Tablet, Smartphone, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Breakpoint {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  category: 'mobile' | 'tablet' | 'desktop';
}

interface ResponsiveIssue {
  breakpoint: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  element: string;
  recommendation: string;
}

interface ResponsiveResults {
  overallScore: number;
  breakpointScores: Record<string, number>;
  issues: ResponsiveIssue[];
  passedChecks: string[];
}

const BREAKPOINTS: Breakpoint[] = [
  { name: 'iPhone SE', width: 375, height: 667, icon: <Smartphone className="h-4 w-4" />, category: 'mobile' },
  { name: 'iPhone 12', width: 390, height: 844, icon: <Smartphone className="h-4 w-4" />, category: 'mobile' },
  { name: 'iPhone 12 Pro Max', width: 428, height: 926, icon: <Smartphone className="h-4 w-4" />, category: 'mobile' },
  { name: 'iPad Mini', width: 768, height: 1024, icon: <Tablet className="h-4 w-4" />, category: 'tablet' },
  { name: 'iPad Pro', width: 1024, height: 1366, icon: <Tablet className="h-4 w-4" />, category: 'tablet' },
  { name: 'MacBook Air', width: 1280, height: 800, icon: <Monitor className="h-4 w-4" />, category: 'desktop' },
  { name: 'Desktop HD', width: 1920, height: 1080, icon: <Monitor className="h-4 w-4" />, category: 'desktop' },
];

export function ResponsiveTestRunner() {
  const [isTesting, setIsTesting] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint | null>(null);
  const [results, setResults] = useState<ResponsiveResults | null>(null);
  const [originalViewport, setOriginalViewport] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    // Store original viewport size
    setOriginalViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  const runResponsiveTest = async () => {
    setIsTesting(true);
    
    const breakpointScores: Record<string, number> = {};
    const allIssues: ResponsiveIssue[] = [];
    const passedChecks: string[] = [];
    
    // Test each breakpoint
    for (const breakpoint of BREAKPOINTS) {
      setCurrentBreakpoint(breakpoint);
      
      // Simulate viewport change (in real implementation, this would use browser APIs)
      await simulateViewportChange(breakpoint);
      
      // Run checks for this breakpoint
      const { score, issues, passed } = await testBreakpoint(breakpoint);
      
      breakpointScores[breakpoint.name] = score;
      allIssues.push(...issues);
      passedChecks.push(...passed);
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Calculate overall score
    const scores = Object.values(breakpointScores);
    const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    const results: ResponsiveResults = {
      overallScore,
      breakpointScores,
      issues: allIssues,
      passedChecks: [...new Set(passedChecks)] // Remove duplicates
    };
    
    setResults(results);
    setCurrentBreakpoint(null);
    setIsTesting(false);
    
    // Restore original viewport (in a real implementation)
    if (originalViewport) {
      await simulateViewportChange({ 
        name: 'Original', 
        width: originalViewport.width, 
        height: originalViewport.height,
        icon: null,
        category: 'desktop'
      });
    }
  };

  const simulateViewportChange = async (breakpoint: Breakpoint) => {
    // In a real implementation, this would change the viewport size
    // For demo purposes, we'll just update the meta viewport tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', `width=${breakpoint.width}, initial-scale=1.0`);
    }
    
    // Trigger a resize event
    window.dispatchEvent(new Event('resize'));
    
    return new Promise(resolve => setTimeout(resolve, 100));
  };

  const testBreakpoint = async (breakpoint: Breakpoint): Promise<{
    score: number;
    issues: ResponsiveIssue[];
    passed: string[];
  }> => {
    const issues: ResponsiveIssue[] = [];
    const passed: string[] = [];
    let score = 100;
    
    // Check for horizontal scrolling
    if (document.body.scrollWidth > breakpoint.width) {
      issues.push({
        breakpoint: breakpoint.name,
        issue: 'Horizontal scrolling detected',
        severity: 'high',
        element: 'body',
        recommendation: 'Ensure content fits within viewport width'
      });
      score -= 25;
    } else {
      passed.push('No horizontal scrolling');
    }
    
    // Check for text readability
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    let hasSmallText = false;
    
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);
      
      if (breakpoint.category === 'mobile' && fontSize < 14) {
        hasSmallText = true;
      }
    });
    
    if (hasSmallText) {
      issues.push({
        breakpoint: breakpoint.name,
        issue: 'Text too small for mobile',
        severity: 'medium',
        element: 'text elements',
        recommendation: 'Increase font size to at least 14px on mobile'
      });
      score -= 15;
    } else {
      passed.push('Text size appropriate');
    }
    
    // Check touch target sizes (mobile only)
    if (breakpoint.category === 'mobile') {
      const touchTargets = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
      let hasSmallTargets = false;
      
      touchTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          hasSmallTargets = true;
        }
      });
      
      if (hasSmallTargets) {
        issues.push({
          breakpoint: breakpoint.name,
          issue: 'Touch targets too small',
          severity: 'high',
          element: 'interactive elements',
          recommendation: 'Ensure touch targets are at least 44x44px'
        });
        score -= 20;
      } else {
        passed.push('Touch targets appropriately sized');
      }
    }
    
    // Check navigation visibility
    const navigation = document.querySelector('nav');
    if (navigation) {
      const isVisible = window.getComputedStyle(navigation).display !== 'none';
      if (isVisible) {
        passed.push('Navigation visible');
      } else {
        issues.push({
          breakpoint: breakpoint.name,
          issue: 'Navigation not visible',
          severity: 'medium',
          element: 'nav',
          recommendation: 'Ensure navigation is accessible on all screen sizes'
        });
        score -= 10;
      }
    }
    
    // Check for content overflow
    const containers = document.querySelectorAll('div, section, article');
    let hasOverflow = false;
    
    containers.forEach(container => {
      const rect = container.getBoundingClientRect();
      if (rect.width > breakpoint.width * 1.1) { // Allow 10% tolerance
        hasOverflow = true;
      }
    });
    
    if (hasOverflow) {
      issues.push({
        breakpoint: breakpoint.name,
        issue: 'Content overflow detected',
        severity: 'medium',
        element: 'containers',
        recommendation: 'Use responsive design techniques to prevent overflow'
      });
      score -= 15;
    } else {
      passed.push('No content overflow');
    }
    
    return {
      score: Math.max(0, score),
      issues,
      passed
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Responsive Design Tester
            </CardTitle>
            <Button onClick={runResponsiveTest} disabled={isTesting}>
              {isTesting ? 'Testing...' : 'Run Responsive Test'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isTesting && currentBreakpoint && (
            <Alert>
              <RotateCcw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Testing {currentBreakpoint.name} ({currentBreakpoint.width}×{currentBreakpoint.height})
              </AlertDescription>
            </Alert>
          )}
          
          {results && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-4xl font-bold">
                  <span className={getScoreColor(results.overallScore)}>
                    {results.overallScore.toFixed(1)}
                  </span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <Progress value={results.overallScore} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Responsive Design Score
                </p>
              </div>

              {/* Breakpoint Scores */}
              <Tabs defaultValue="scores" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="scores">Breakpoint Scores</TabsTrigger>
                  <TabsTrigger value="issues">Issues</TabsTrigger>
                  <TabsTrigger value="passed">Passed Checks</TabsTrigger>
                </TabsList>

                <TabsContent value="scores">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {BREAKPOINTS.map((breakpoint) => (
                      <Card key={breakpoint.name}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {breakpoint.icon}
                            <span className="font-medium">{breakpoint.name}</span>
                          </div>
                          <div className="text-2xl font-bold">
                            <span className={getScoreColor(results.breakpointScores[breakpoint.name] || 0)}>
                              {(results.breakpointScores[breakpoint.name] || 0).toFixed(0)}
                            </span>
                            <span className="text-sm text-muted-foreground">/100</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {breakpoint.width}×{breakpoint.height}px
                          </div>
                          <Badge variant="outline" className="mt-2">
                            {breakpoint.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="issues">
                  {results.issues.length > 0 ? (
                    <div className="space-y-3">
                      {results.issues.map((issue, index) => (
                        <Alert key={index}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant={getSeverityBadge(issue.severity) as any}>
                                    {issue.severity}
                                  </Badge>
                                  <span className="font-medium">{issue.breakpoint}</span>
                                </div>
                                <p className="text-sm mb-2">{issue.issue}</p>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Element: {issue.element}
                                </p>
                                <p className="text-xs text-blue-600">
                                  Solution: {issue.recommendation}
                                </p>
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium text-green-600">
                          No responsive design issues found!
                        </div>
                        <p className="text-sm mt-1">
                          Your design works well across all tested breakpoints.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="passed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {results.passedChecks.map((check, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>{check}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}