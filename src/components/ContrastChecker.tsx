import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, XCircle, Eye } from 'lucide-react';
import { 
  validateDesignSystemContrast, 
  getContrastRatio, 
  ColorCombination,
  COLOR_COMBINATIONS 
} from '@/utils/colorContrast';

export function ContrastChecker() {
  const [results, setResults] = useState<{
    passed: ColorCombination[];
    failed: ColorCombination[];
    warnings: ColorCombination[];
  } | null>(null);

  const runContrastCheck = () => {
    const validationResults = validateDesignSystemContrast();
    setResults(validationResults);
  };

  const getStatusIcon = (ratio: number, isLargeText = false) => {
    const aaThreshold = isLargeText ? 3 : 4.5;
    const aaaThreshold = isLargeText ? 4.5 : 7;
    
    if (ratio >= aaaThreshold) {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    } else if (ratio >= aaThreshold) {
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (ratio: number, isLargeText = false) => {
    const aaThreshold = isLargeText ? 3 : 4.5;
    const aaaThreshold = isLargeText ? 4.5 : 7;
    
    if (ratio >= aaaThreshold) {
      return <Badge className="bg-green-100 text-green-800">AAA</Badge>;
    } else if (ratio >= aaThreshold) {
      return <Badge className="bg-yellow-100 text-yellow-800">AA</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">FAIL</Badge>;
    }
  };

  const ColorSwatch = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
      <div 
        className="w-6 h-6 rounded border border-gray-300"
        style={{ backgroundColor: color }}
        aria-label={`Väri: ${color}`}
      />
      <span className="text-sm font-mono">{color}</span>
      <span className="text-sm text-muted-foreground">({label})</span>
    </div>
  );

  return (
    <div className="space-y-6" role="region" aria-labelledby="contrast-checker-title">
      <Card>
        <CardHeader>
          <CardTitle id="contrast-checker-title" className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Värikontrastin Tarkistus (WCAG 2.1)
          </CardTitle>
          <CardDescription>
            Tarkista, että kaikki värikombinaatiot täyttävät WCAG 2.1 AA saavutettavuusvaatimukset (4.5:1 suhde normaalille tekstille, 3:1 suurelle)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button onClick={runContrastCheck} className="touch-target focus-enhanced">
              Tarkista Värikontrastit
            </Button>
          </div>

          {results && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{results.passed.length}</div>
                    <div className="text-sm text-muted-foreground">Hyväksytty (AA+)</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{results.warnings.length}</div>
                    <div className="text-sm text-muted-foreground">Varoitus (AA, ei AAA)</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{results.failed.length}</div>
                    <div className="text-sm text-muted-foreground">Hylätty (&lt;AA)</div>
                  </CardContent>
                </Card>
              </div>

              {/* Failed combinations - need immediate attention */}
              {results.failed.length > 0 && (
                <Alert role="alert" className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Kriittinen:</strong> {results.failed.length} värikombinaatiota ei täytä WCAG AA -vaatimuksia ja on korjattava välittömästi.
                  </AlertDescription>
                </Alert>
              )}

              {/* Detailed Results */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Yksityiskohtaiset Tulokset</h3>
                
                <div className="overflow-x-auto mobile-table-responsive">
                  <table className="w-full text-sm" role="table" aria-label="Värikontrastien tulokset">
                    <thead>
                      <tr className="border-b" role="row">
                        <th className="text-left p-2" scope="col">Tila</th>
                        <th className="text-left p-2" scope="col">Nimi</th>
                        <th className="text-left p-2" scope="col">Kontrasti</th>
                        <th className="text-left p-2" scope="col">Etuväri</th>
                        <th className="text-left p-2" scope="col">Taustaväri</th>
                        <th className="text-left p-2" scope="col">Käyttö</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COLOR_COMBINATIONS.map((combo) => {
                        const ratio = getContrastRatio(combo.foreground, combo.background);
                        return (
                          <tr key={combo.name} className="border-b" role="row">
                            <td className="p-2" role="cell">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(ratio, combo.isLargeText)}
                                {getStatusBadge(ratio, combo.isLargeText)}
                              </div>
                            </td>
                            <td className="p-2 font-medium" role="cell">{combo.name}</td>
                            <td className="p-2 font-mono" role="cell">
                              {ratio.toFixed(2)}:1
                            </td>
                            <td className="p-2" role="cell">
                              <ColorSwatch color={combo.foreground} label="etu" />
                            </td>
                            <td className="p-2" role="cell">
                              <ColorSwatch color={combo.background} label="tausta" />
                            </td>
                            <td className="p-2 text-muted-foreground" role="cell">{combo.usage}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* WCAG Guidelines */}
              <Card role="complementary" aria-labelledby="wcag-guidelines">
                <CardHeader>
                  <CardTitle id="wcag-guidelines">WCAG 2.1 Ohjeet</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="font-medium inline">AA Taso (vähimmäisvaatimus):</dt>
                      <dd className="inline ml-2">Normaali teksti 4.5:1, suuri teksti 3:1</dd>
                    </div>
                    <div>
                      <dt className="font-medium inline">AAA Taso (paras käytäntö):</dt>
                      <dd className="inline ml-2">Normaali teksti 7:1, suuri teksti 4.5:1</dd>
                    </div>
                    <div>
                      <dt className="font-medium inline">Suuri teksti:</dt>
                      <dd className="inline ml-2">18pt+ normaali tai 14pt+ lihavoitu (noin 24px/18.5px)</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}