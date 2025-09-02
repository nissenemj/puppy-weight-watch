import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Palette, 
  Bell, 
  Database, 
  Accessibility, 
  Star,
  Clock,
  Download,
  RotateCcw,
  Check
} from 'lucide-react';
import { LoadingState, InteractionFeedback } from './LoadingStates';

interface SettingsPanelProps {
  className?: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ className = '' }) => {
  const { preferences, updatePreferences, resetPreferences, loading } = useUserPreferences();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('success');

  const showSuccess = (message: string) => {
    setFeedbackMessage(message);
    setFeedbackType('success');
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const handlePreferenceChange = async (updates: any) => {
    try {
      await updatePreferences(updates);
      showSuccess('Asetukset tallennettu!');
    } catch (error) {
      console.error('Settings update failed:', error);
      setFeedbackMessage('Asetusten tallentaminen epäonnistui');
      setFeedbackType('error');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
    }
  };

  const handleReset = async () => {
    try {
      await resetPreferences();
      showSuccess('Asetukset palautettu oletuksiin');
    } catch (error) {
      console.error('Reset failed:', error);
    }
  };

  const favoriteFeatureOptions = [
    { id: 'weight-tracker', label: 'Painonseuranta', icon: '⚖️' },
    { id: 'calculator', label: 'Ruokalaskuri', icon: '🧮' },
    { id: 'puppy-book', label: 'Pentukirja', icon: '📖' },
    { id: 'info', label: 'Oppaat', icon: 'ℹ️' }
  ];

  const toggleFavoriteFeature = (featureId: string) => {
    const currentFavorites = preferences.favoriteFeatures || [];
    const newFavorites = currentFavorites.includes(featureId)
      ? currentFavorites.filter(id => id !== featureId)
      : [...currentFavorites, featureId];
    
    handlePreferenceChange({ favoriteFeatures: newFavorites });
  };

  return (
    <LoadingState loading={loading} variant="overlay">
      <div className={`space-y-6 ${className}`}>
        <InteractionFeedback
          type={feedbackType}
          message={feedbackMessage}
          show={showFeedback}
          onClose={() => setShowFeedback(false)}
        />

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mobile-grid-1">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Yleiset</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Ulkoasu</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Ilmoitukset</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              <span className="hidden sm:inline">Esteettömyys</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Suosikkitoiminnot
                </CardTitle>
                <CardDescription>
                  Valitse toiminnot, jotka näkyvät pikavalinnoissa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {favoriteFeatureOptions.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-lg">{feature.icon}</span>
                        {feature.label}
                      </Label>
                      <Switch
                        checked={preferences.favoriteFeatures?.includes(feature.id) || false}
                        onCheckedChange={() => toggleFavoriteFeature(feature.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mittayksiköt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Painoyksikkö</Label>
                  <Select
                    value={preferences.weightUnit}
                    onValueChange={(value: 'kg' | 'lbs') => 
                      handlePreferenceChange({ weightUnit: value })
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Muistutukset
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Päivittäinen painomuistutus</Label>
                  <Switch
                    checked={preferences.defaultWeightReminder}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange({ defaultWeightReminder: checked })
                    }
                  />
                </div>
                
                {preferences.defaultWeightReminder && (
                  <div className="flex items-center justify-between">
                    <Label>Muistutuksen aika</Label>
                    <Input
                      type="time"
                      value={preferences.reminderTime}
                      onChange={(e) => 
                        handlePreferenceChange({ reminderTime: e.target.value })
                      }
                      className="w-24"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Värivaa</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value: 'light' | 'dark' | 'auto') => 
                      handlePreferenceChange({ theme: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Vaalea</SelectItem>
                      <SelectItem value="dark">Tumma</SelectItem>
                      <SelectItem value="auto">Automaattinen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Fonttikoko</Label>
                  <Select
                    value={preferences.fontSize}
                    onValueChange={(value: 'small' | 'medium' | 'large') => 
                      handlePreferenceChange({ fontSize: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pieni</SelectItem>
                      <SelectItem value="medium">Keskikokoinen</SelectItem>
                      <SelectItem value="large">Suuri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dashboard-näkymä</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Näkymätyyli</Label>
                  <Select
                    value={preferences.dashboardLayout}
                    onValueChange={(value: 'compact' | 'detailed') => 
                      handlePreferenceChange({ dashboardLayout: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Tiivis</SelectItem>
                      <SelectItem value="detailed">Yksityiskohtainen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Näytä pikatoiminnot</Label>
                  <Switch
                    checked={preferences.showQuickActions}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange({ showQuickActions: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ilmoitusten asetukset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ota käyttöön ilmoitukset</Label>
                  <Switch
                    checked={preferences.enableNotifications}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange({ enableNotifications: checked })
                    }
                  />
                </div>

                {preferences.enableNotifications && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label>Kasvun virstanpylväät</Label>
                      <Switch
                        checked={preferences.growthMilestoneNotifications}
                        onCheckedChange={(checked) => 
                          handlePreferenceChange({ growthMilestoneNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Ruokintamuistutukset</Label>
                      <Switch
                        checked={preferences.feedingReminders}
                        onCheckedChange={(checked) => 
                          handlePreferenceChange({ feedingReminders: checked })
                        }
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Settings */}
          <TabsContent value="accessibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Esteettömyysasetukset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Rajoita animaatioita</Label>
                  <Switch
                    checked={preferences.reducedMotion}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange({ reducedMotion: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Suuri kontrasti</Label>
                  <Switch
                    checked={preferences.highContrast}
                    onCheckedChange={(checked) => 
                      handlePreferenceChange({ highContrast: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reset Button */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Palauta oletusasetukset</h3>
                <p className="text-sm text-muted-foreground">
                  Nollaa kaikki asetukset takaisin oletusarvoihin
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Palauta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LoadingState>
  );
};

export default SettingsPanel;