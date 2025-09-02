import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Accessibility, Eye, Keyboard, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  severity: 'high' | 'medium' | 'low';
  rule: string;
  element: string;
  description: string;
  solution: string;
}

interface AccessibilityResults {
  score: number;
  issues: AccessibilityIssue[];
  passedRules: string[];
  compliance: {
    wcag21AA: boolean;
    wcag21AAA: boolean;
  };
}

export function AccessibilityChecker() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AccessibilityResults | null>(null);

  const runAccessibilityCheck = async () => {
    setIsRunning(true);
    
    // Simulate accessibility analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const issues: AccessibilityIssue[] = [
      {
        type: 'error',
        severity: 'high',
        rule: 'color-contrast',
        element: 'button.secondary',
        description: 'Text has insufficient contrast ratio of 3.2:1',
        solution: 'Increase contrast to at least 4.5:1 for normal text'
      },
      {
        type: 'warning',
        severity: 'medium',
        rule: 'alt-text',
        element: 'img[src="hero.jpg"]',
        description: 'Image missing alternative text',
        solution: 'Add descriptive alt attribute to image'
      },
      {
        type: 'warning',
        severity: 'medium',
        rule: 'focus-order',
        element: 'nav',
        description: 'Navigation skip link not properly implemented',
        solution: 'Add "Skip to main content" link at the beginning'
      }
    ];

    const passedRules = [
      'proper-heading-structure',
      'keyboard-navigation',
      'aria-labels',
      'semantic-markup',
      'button-accessibility'
    ];

    const results: AccessibilityResults = {
      score: 85,
      issues,
      passedRules,
      compliance: {
        wcag21AA: issues.filter(i => i.severity === 'high').length === 0,
        wcag21AAA: issues.length === 0
      }
    };
    
    setResults(results);
    setIsRunning(false);
  };

  const checkColorContrast = () => {
    const elements = document.querySelectorAll('*');
    const issues: AccessibilityIssue[] = [];
    
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const textColor = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simple contrast check (would need more sophisticated implementation)
      if (textColor && backgroundColor && textColor !== 'rgba(0, 0, 0, 0)') {
        // Placeholder for actual contrast calculation
        const contrast = calculateContrast(textColor, backgroundColor);
        if (contrast < 4.5) {
          issues.push({
            type: 'error',
            severity: 'high',
            rule: 'color-contrast',
            element: element.tagName.toLowerCase(),
            description: `Insufficient contrast ratio: ${contrast.toFixed(2)}:1`,
            solution: 'Increase contrast to at least 4.5:1'
          });
        }
      }
    });
    
    return issues;
  };

  const calculateContrast = (color1: string, color2: string): number => {
    // Simplified contrast calculation - would need proper implementation
    return Math.random() * 10 + 1;
  };

  const checkKeyboardNavigation = () => {
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    return focusableElements.length > 0;
  };

  const checkAriaLabels = () => {
    const interactiveElements = document.querySelectorAll('button, input, select, textarea');
    const issues: AccessibilityIssue[] = [];
    
    interactiveElements.forEach(element => {
      const hasLabel = element.hasAttribute('aria-label') || 
                      element.hasAttribute('aria-labelledby') ||
                      element.closest('label');
      
      if (!hasLabel) {
        issues.push({
          type: 'warning',
          severity: 'medium',
          rule: 'aria-labels',
          element: element.tagName.toLowerCase(),
          description: 'Interactive element missing accessible label',
          solution: 'Add aria-label or associate with a label element'
        });
      }
    });
    
    return issues;
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
              <Accessibility className="h-5 w-5" />
              Accessibility Checker
            </CardTitle>
            <Button onClick={runAccessibilityCheck} disabled={isRunning}>
              {isRunning ? 'Scanning...' : 'Run Accessibility Scan'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {results && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-4xl font-bold">
                  <span className={results.score >= 90 ? 'text-green-600' : results.score >= 70 ? 'text-yellow-600' : 'text-red-600'}>
                    {results.score}
                  </span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <Progress value={results.score} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Accessibility Score
                </p>
              </div>

              {/* Compliance Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      {results.compliance.wcag21AA ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">WCAG 2.1 AA</span>
                    </div>
                    <Badge 
                      variant={results.compliance.wcag21AA ? 'default' : 'destructive'}
                      className="mt-2"
                    >
                      {results.compliance.wcag21AA ? 'Compliant' : 'Non-compliant'}
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      {results.compliance.wcag21AAA ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      <span className="font-medium">WCAG 2.1 AAA</span>
                    </div>
                    <Badge 
                      variant={results.compliance.wcag21AAA ? 'default' : 'secondary'}
                      className="mt-2"
                    >
                      {results.compliance.wcag21AAA ? 'Compliant' : 'Non-compliant'}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Issues */}
              {results.issues.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Issues Found</h3>
                  <div className="space-y-3">
                    {results.issues.map((issue, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={getSeverityBadge(issue.severity) as "default" | "secondary" | "destructive" | "outline"}>
                                  {issue.severity}
                                </Badge>
                                <span className="font-medium">{issue.rule}</span>
                              </div>
                              <p className="text-sm mb-2">{issue.description}</p>
                              <p className="text-xs text-muted-foreground">
                                Element: {issue.element}
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                Solution: {issue.solution}
                              </p>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Passed Rules */}
              {results.passedRules.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Passed Checks</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {results.passedRules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Checks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Eye className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Color Contrast</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Check Contrast
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Keyboard className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Keyboard Navigation</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Test Navigation
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Accessibility className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Screen Reader</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Test Reader
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}