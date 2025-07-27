import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Weight, Pill, AlertTriangle } from '@/utils/iconImports';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddHealthRecordDialogProps {
  bookId: string;
  onHealthRecordAdded: () => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface VaccinationTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  manufacturer: string;
}

export const AddHealthRecordDialog: React.FC<AddHealthRecordDialogProps> = ({
  bookId,
  onHealthRecordAdded,
  children,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');
  const [type, setType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState<VaccinationTemplate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AEFI fields
  const [vaccineBrand, setVaccineBrand] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [reactionObserved, setReactionObserved] = useState(false);
  const [reactionDescription, setReactionDescription] = useState('');
  const { toast } = useToast();

  // Fetch vaccination templates
  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('vaccination_templates')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching templates:', error);
      } else {
        setTemplates(data || []);
      }
    };

    if (open) {
      fetchTemplates();
    }
  }, [open]);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setType(template.type);
      setDescription(template.name);
      setMedicationName(template.name);
      setNotes(template.description);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date is not in the future
    if (date && date > new Date()) {
      toast({
        title: "Virhe",
        description: "Päivämäärä ei voi olla tulevaisuudessa",
        variant: "destructive"
      });
      return;
    }

    if (!date || !type || !description.trim()) {
      toast({
        title: "Virhe",
        description: "Täytä kaikki pakolliset kentät",
        variant: "destructive"
      });
      return;
    }

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Virhe",
        description: "Kirjaudu sisään lisätäksesi terveysmerkintöjä",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('health_records')
        .insert({
          book_id: bookId,
          entry_date: format(date, 'yyyy-MM-dd'),
          time: time || null,
          type,
          description: description.trim(),
          notes: notes.trim() || null,
          veterinarian: veterinarian.trim() || null,
          weight_kg: weightKg ? parseFloat(weightKg) : null,
          medication_name: medicationName.trim() || null,
          dosage: dosage.trim() || null,
          vaccine_brand: vaccineBrand.trim() || null,
          lot_number: lotNumber.trim() || null,
          reaction_observed: reactionObserved,
          reaction_description: reactionDescription.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Onnistui!",
        description: "Terveysmerkintä lisätty onnistuneesti",
      });

      // Reset form
      setOpen(false);
      setDate(new Date());
      setTime('');
      setType('');
      setDescription('');
      setNotes('');
      setVeterinarian('');
          setWeightKg('');
          setMedicationName('');
          setDosage('');
          setSelectedTemplate('');
          setVaccineBrand('');
          setLotNumber('');
          setReactionObserved(false);
          setReactionDescription('');
      onHealthRecordAdded();
    } catch (error) {
      console.error('Error adding health record:', error);
      toast({
        title: "Virhe",
        description: error instanceof Error ? error.message : "Terveysmerkinnän lisääminen epäonnistui",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lisää terveysmerkintä</DialogTitle>
          <DialogDescription>
            Lisää uusi terveysmerkintä pentukirjaan. Tähdellä merkityt kentät ovat pakollisia.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Valitse valmis pohja (valinnainen)</Label>
            <Select value={selectedTemplate} onValueChange={(value) => {
              setSelectedTemplate(value);
              handleTemplateSelect(value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Valitse rokotus- tai madotuspohja" />
              </SelectTrigger>
              <SelectContent>
                {templates.filter(t => t.type === 'vaccination').map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center">
                      <Pill className="mr-2 h-4 w-4" />
                      {template.name}
                    </div>
                  </SelectItem>
                ))}
                {templates.filter(t => t.type === 'deworming').map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center">
                      <Pill className="mr-2 h-4 w-4" />
                      {template.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Päivämäärä *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, 'dd.MM.yyyy') : 'Valitse päivämäärä'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Kellonaika</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tyyppi *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Valitse tyyppi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaccination">Rokotus</SelectItem>
                <SelectItem value="deworming">Madotus</SelectItem>
                <SelectItem value="checkup">Tarkastus</SelectItem>
                <SelectItem value="other">Muu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Kuvaus *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Esim. DHPP-rokotus"
              maxLength={200}
            />
          </div>

          {/* Medication and Dosage Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medicationName">Lääke/Valmiste</Label>
              <Input
                id="medicationName"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                placeholder="Esim. Nobivac DHPPi"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Annos</Label>
              <Input
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="Esim. 1 ml"
                maxLength={50}
              />
            </div>
          </div>

          {/* Weight and Veterinarian Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weightKg">Paino (kg)</Label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="Esim. 2.5"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="veterinarian">Eläinlääkäri</Label>
              <Input
                id="veterinarian"
                value={veterinarian}
                onChange={(e) => setVeterinarian(e.target.value)}
                placeholder="Esim. Dr. Virtanen"
                maxLength={100}
              />
            </div>
          </div>

          {/* AEFI Fields for Vaccinations */}
          {type === 'vaccination' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vaccineBrand">Rokotteen merkki</Label>
                  <Input
                    id="vaccineBrand"
                    value={vaccineBrand}
                    onChange={(e) => setVaccineBrand(e.target.value)}
                    placeholder="Esim. Nobivac"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lotNumber">Erä-/lot-numero</Label>
                  <Input
                    id="lotNumber"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    placeholder="Esim. ABC123"
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reactionObserved"
                    checked={reactionObserved}
                    onCheckedChange={(checked) => setReactionObserved(checked === true)}
                  />
                  <Label htmlFor="reactionObserved" className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                    Havaittiin rokotusreaktio (AEFI)
                  </Label>
                </div>

                {reactionObserved && (
                  <div className="space-y-2">
                    <Label htmlFor="reactionDescription">Reaktion kuvaus</Label>
                    <Textarea
                      id="reactionDescription"
                      value={reactionDescription}
                      onChange={(e) => setReactionDescription(e.target.value)}
                      placeholder="Kuvaile havaittua reaktiota: ihottuma, oksentelu, väsymys..."
                      rows={2}
                      maxLength={300}
                    />
                    <p className="text-xs text-orange-600">
                      Ilmoita vakavat reaktiot eläinlääkärille ja rokotteen valmistajalle.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Lisätiedot</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mahdolliset sivuvaikutukset, erityishuomiot..."
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Peruuta
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Lisätään...' : 'Lisää'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};