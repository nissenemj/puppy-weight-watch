import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Target, Smartphone, AlertTriangle, CheckCircle2, Ruler } from 'lucide-react';

interface TouchTarget {
  element: Element;
  width: number;
  height: number;
  area: number;
  isCompliant: boolean;
  recommendation: string;
}

interface TouchTargetResults {
  totalTargets: number;
  compliantTargets: number;
  complianceRate: number;
  smallTargets: TouchTarget[];
  recommendations: string[];
}

export function TouchTargetValidator() {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<TouchTargetResults | null>(null);
  const [highlightMode, setHighlightMode] = useState(false);

  const MINIMUM_TARGET_SIZE = 44; // pixels (Apple HIG and Material Design)
  const RECOMMENDED_TARGET_SIZE = 48; // pixels

  const scanTouchTargets = async () => {
    setIsScanning(true);
    
    // Give UI time to update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const touchableSelectors = [
      'button',
      'a',
      'input[type="button"]',
      'input[type="submit"]',
      'input[type="checkbox"]',
      'input[type="radio"]',
      '[role="button"]',
      '[onclick]',
      '.clickable',
      '.touch-target'
    ];
    
    const touchableElements = document.querySelectorAll(touchableSelectors.join(', '));
    const targets: TouchTarget[] = [];
    let compliantCount = 0;
    
    touchableElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const area = width * height;
      
      // Check if element is visible
      if (width > 0 && height > 0) {
        const isCompliant = width >= MINIMUM_TARGET_SIZE && height >= MINIMUM_TARGET_SIZE;
        
        if (isCompliant) {
          compliantCount++;
        }
        
        const target: TouchTarget = {
          element,
          width,
          height,
          area,
          isCompliant,
          recommendation: generateRecommendation(width, height)
        };
        
        targets.push(target);
      }
    });
    
    const smallTargets = targets.filter(target => !target.isCompliant);
    const complianceRate = targets.length > 0 ? (compliantCount / targets.length) * 100 : 100;
    
    const results: TouchTargetResults = {
      totalTargets: targets.length,
      compliantTargets: compliantCount,
      complianceRate,
      smallTargets,
      recommendations: generateGlobalRecommendations(smallTargets)
    };
    
    setResults(results);
    setIsScanning(false);
  };

  const generateRecommendation = (width: number, height: number): string => {
    if (width < MINIMUM_TARGET_SIZE && height < MINIMUM_TARGET_SIZE) {
      return `Increase both width and height to at least ${MINIMUM_TARGET_SIZE}px`;
    } else if (width < MINIMUM_TARGET_SIZE) {
      return `Increase width to at least ${MINIMUM_TARGET_SIZE}px`;
    } else if (height < MINIMUM_TARGET_SIZE) {
      return `Increase height to at least ${MINIMUM_TARGET_SIZE}px`;
    }
    return 'Target size is compliant';
  };

  const generateGlobalRecommendations = (smallTargets: TouchTarget[]): string[] => {
    const recs: string[] = [];
    
    if (smallTargets.length > 0) {
      recs.push(`${smallTargets.length} touch targets are below the minimum size of ${MINIMUM_TARGET_SIZE}px`);
    }
    
    const verySmallTargets = smallTargets.filter(t => Math.min(t.width, t.height) < 32);
    if (verySmallTargets.length > 0) {
      recs.push(`${verySmallTargets.length} targets are critically small (< 32px) and may be very difficult to tap`);
    }
    
    if (smallTargets.some(t => t.element.tagName === 'BUTTON')) {
      recs.push('Consider adding padding to buttons to increase their touch area');
    }
    
    if (smallTargets.some(t => t.element.tagName === 'A')) {
      recs.push('Add padding or increase font size for link elements');
    }
    
    return recs;
  };

  const highlightTargets = () => {
    setHighlightMode(!highlightMode);
    
    if (!highlightMode && results) {
      // Add highlight styles
      results.smallTargets.forEach(target => {
        (target.element as HTMLElement).style.outline = '2px solid red';
        (target.element as HTMLElement).style.outlineOffset = '2px';
        (target.element as HTMLElement).setAttribute('data-touch-invalid', 'true');
      });
    } else {
      // Remove highlight styles
      document.querySelectorAll('[data-touch-invalid]').forEach(element => {
        (element as HTMLElement).style.outline = '';
        (element as HTMLElement).style.outlineOffset = '';
        element.removeAttribute('data-touch-invalid');
      });
    }
  };

  useEffect(() => {
    // Cleanup highlights on unmount
    return () => {
      document.querySelectorAll('[data-touch-invalid]').forEach(element => {
        (element as HTMLElement).style.outline = '';
        (element as HTMLElement).style.outlineOffset = '';
        element.removeAttribute('data-touch-invalid');
      });
    };
  }, []);

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getElementDescription = (element: Element): string => {
    const tag = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.split(' ')[0]}` : '';
    const id = element.id ? `#${element.id}` : '';
    const text = element.textContent?.slice(0, 20) || '';
    
    return `${tag}${id}${className}${text ? ` ("${text}...")` : ''}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Touch Target Validator
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={highlightTargets}
                disabled={!results}
              >
                {highlightMode ? 'Hide Highlights' : 'Highlight Issues'}
              </Button>
              <Button onClick={scanTouchTargets} disabled={isScanning}>
                {isScanning ? 'Scanning...' : 'Scan Touch Targets'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {results && (
            <div className="space-y-6">
              {/* Overall Compliance */}
              <div className="text-center">
                <div className="text-4xl font-bold">
                  <span className={getComplianceColor(results.complianceRate)}>
                    {results.complianceRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={results.complianceRate} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Touch Target Compliance Rate
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{results.totalTargets}</div>
                    <div className="text-sm text-muted-foreground">Total Targets</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{results.compliantTargets}</div>
                    <div className="text-sm text-muted-foreground">Compliant</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{results.smallTargets.length}</div>
                    <div className="text-sm text-muted-foreground">Need Fixing</div>
                  </CardContent>
                </Card>
              </div>

              {/* Target Size Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Touch Target Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-white font-bold">
                        48
                      </div>
                      <div>
                        <div className="font-medium">Recommended Size</div>
                        <div className="text-sm text-muted-foreground">48×48px minimum</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-yellow-500 rounded flex items-center justify-center text-white font-bold text-sm">
                        44
                      </div>
                      <div>
                        <div className="font-medium">Minimum Size</div>
                        <div className="text-sm text-muted-foreground">44×44px absolute minimum</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issues */}
              {results.smallTargets.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Touch Targets Needing Attention</h3>
                  <div className="space-y-3">
                    {results.smallTargets.slice(0, 10).map((target, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="destructive">
                                  {target.width.toFixed(0)}×{target.height.toFixed(0)}px
                                </Badge>
                                <span className="font-medium">
                                  {getElementDescription(target.element)}
                                </span>
                              </div>
                              <p className="text-sm text-blue-600">
                                {target.recommendation}
                              </p>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                    
                    {results.smallTargets.length > 10 && (
                      <p className="text-sm text-muted-foreground text-center">
                        ... and {results.smallTargets.length - 10} more targets
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {results.recommendations.length > 0 && (
                <Alert>
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Mobile Optimization Recommendations:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {results.smallTargets.length === 0 && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium text-green-600">
                      Excellent! All touch targets meet the minimum size requirements.
                    </div>
                    <p className="text-sm mt-1">
                      Your interface is optimized for mobile touch interaction.
                    </p>
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